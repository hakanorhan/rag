import "server-only";

import { CAR_API_URL } from "@/lib/api";
import type { ProblemDetail } from "@/lib/problemDetails";
import type { CarDTO } from "@/types/car";
import type { LocationDTO } from "@/types/location";
import type {
  ReservationCarRequest,
  ReservationDTO,
  ReservationOptions,
  ReservationOptionsRequest,
  ReservationOptionsState,
} from "@/types/reservation";
import { getAuthenticatedFetch, serverFetch } from "./serverFetch";

type CarSearchCriteria = {
  location?: string;
  pickupAt?: string;
  returnAt?: string;
};

type CreateReservationResult =
  | { status: "success"; reservationId: number }
  | { status: "error"; problem: ProblemDetail };

export type ReservationPageResult =
  | { status: "error"; problem: ProblemDetail }
  | {
      status: "success";
      reservation: ReservationDTO;
      options: ReservationOptions;
      paid: boolean;
    };

export type ReservationsPageResult =
  | { status: "error"; problem: ProblemDetail }
  | {
      status: "success";
      reservations: (ReservationDTO & { paid: boolean })[];
      totalPages: number;
    };

export async function getAllCars(options?: RequestInit): Promise<CarDTO[]> {
  const response = await serverFetch.requestOrThrow(
    `${CAR_API_URL}/cars`,
    options,
  );
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export async function getCar(id: number): Promise<CarDTO | null> {
  const response = await serverFetch.request(`${CAR_API_URL}/cars/${id}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`Failed to load car: ${response.status}`);
  return response.json() as Promise<CarDTO>;
}

export async function searchCarsByCriteria(
  criteria: CarSearchCriteria,
): Promise<CarDTO[]> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(criteria)) {
    if (value) searchParams.set(key, value);
  }
  const response = await serverFetch.requestOrThrow(
    `${CAR_API_URL}/cars/search?${searchParams}`,
  );
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export async function getLocations() {
  const response = await serverFetch.requestOrThrow(`${CAR_API_URL}/locations`);
  return response.json() as Promise<LocationDTO[]>;
}

export async function createReservation(
  request: ReservationCarRequest,
  idempotencyKey: string,
): Promise<CreateReservationResult> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(`${CAR_API_URL}/reservations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(request),
  });
  if (result.status === "error") return result;

  const reservationId: unknown = await result.response.json();
  if (
    typeof reservationId !== "number" ||
    !Number.isSafeInteger(reservationId) ||
    reservationId <= 0
  ) {
    throw new Error("Invalid reservation response");
  }

  return { status: "success", reservationId };
}

export async function getReservationOptions(): Promise<ReservationOptions> {
  const response = await serverFetch.requestOrThrow(
    `${CAR_API_URL}/reservation/options`,
  );
  return response.json();
}

export async function getReservations(
  page = 0,
): Promise<ReservationsPageResult> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(
    `${CAR_API_URL}/reservations?page=${page}`,
  );
  if (result.status === "error") return result;
  const { response } = result;
  const reservations: unknown = await response.json();
  if (!Array.isArray(reservations)) {
    throw new Error("Invalid reservations response");
  }
  return {
    status: "success",
    totalPages: Number(response.headers.get("X-Total-Pages") ?? 0),
    reservations: await Promise.all(
      (reservations as ReservationDTO[]).map(async (reservation) => {
        try {
          const response = await client.request(
            `${CAR_API_URL}/paypal/reservations/${reservation.reservationId}`,
            { cache: "no-store" },
          );
          const payment = response.ok ? await response.json() : null;
          return { ...reservation, paid: payment?.paid === true };
        } catch {
          return { ...reservation, paid: false };
        }
      }),
    ),
  };
}

export async function getReservationPage(input: {
  reservationId: number;
}): Promise<ReservationPageResult> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const responses = await Promise.all([
    client.requestResult(`${CAR_API_URL}/reservation/${input.reservationId}`),
    getReservationOptions(),
    client.request(`${CAR_API_URL}/paypal/reservations/${input.reservationId}`),
  ]);
  const [reservationResult, options, paymentResponse] = responses;
  if (reservationResult.status === "error") return reservationResult;
  const reservation: ReservationDTO = await reservationResult.response.json();
  const payment = paymentResponse.ok ? await paymentResponse.json() : null;
  return {
    status: "success",
    reservation,
    options,
    paid: payment?.paid === true,
  };
}

export async function updateReservationOptions(
  input: ReservationOptionsRequest,
): Promise<ReservationOptionsState> {
  const { reservationId, ...options } = input;
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(
    `${CAR_API_URL}/reservation/${reservationId}/options`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    },
  );
  if (result.status === "error") return result;
  const reservation: ReservationDTO = await result.response.json();
  return { status: "success", reservation };
}
