import "server-only";

import { CAR_API_URL } from "@/lib/api";
import { type ProblemDetail, ProblemDetailError } from "@/lib/problemDetails";
import { getSession } from "@/lib/session";
import type { CarDTO } from "@/types/car";
import type { LocationDTO } from "@/types/location";
import type {
  ReservationCarRequest,
  ReservationDTO,
  ReservationOptions,
  ReservationOptionsRequest,
  ReservationOptionsState,
} from "@/types/reservation";

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
      paypalClientId: string;
      paid: boolean;
    };

export type ReservationsPageResult =
  | { status: "error"; problem: ProblemDetail }
  | {
      status: "success";
      reservations: (ReservationDTO & { paid: boolean })[];
    };

export async function getAllCars(): Promise<CarDTO[]> {
  const response = await fetch(`${CAR_API_URL}/cars`);
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export async function searchCarsByCriteria(
  criteria: CarSearchCriteria,
): Promise<CarDTO[]> {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(criteria)) {
    if (value) searchParams.set(key, value);
  }
  const response = await fetch(`${CAR_API_URL}/cars/search?${searchParams}`);
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export async function getLocations() {
  const response = await fetch(`${CAR_API_URL}/locations`);
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  return response.json() as Promise<LocationDTO[]>;
}

export async function createReservation(
  request: ReservationCarRequest,
  idempotencyKey: string,
): Promise<CreateReservationResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(`${CAR_API_URL}/reservations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    return { status: "error", problem: await response.json() };
  }

  const reservationId: unknown = await response.json();
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
  const response = await fetch(`${CAR_API_URL}/reservation/options`);
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  return response.json();
}

export async function getPaypalClientId(): Promise<string> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) return "";
  const response = await fetch(`${CAR_API_URL}/paypal/config`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return "";
  const config: unknown = await response.json();
  return typeof config === "object" &&
    config !== null &&
    "clientId" in config &&
    typeof config.clientId === "string"
    ? config.clientId
    : "";
}

export async function getReservations(): Promise<ReservationsPageResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(`${CAR_API_URL}/reservations`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return { status: "error", problem: await response.json() };
  }
  const reservations: unknown = await response.json();
  if (!Array.isArray(reservations)) {
    throw new Error("Invalid reservations response");
  }
  return {
    status: "success",
    reservations: await Promise.all(
      (reservations as ReservationDTO[]).map(async (reservation) => {
        try {
          const response = await fetch(
            `${CAR_API_URL}/paypal/reservations/${reservation.reservationId}`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
              cache: "no-store",
            },
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
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const responses = await Promise.all([
    fetch(`${CAR_API_URL}/reservation/${input.reservationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    getReservationOptions(),
    getPaypalClientId(),
    fetch(`${CAR_API_URL}/paypal/reservations/${input.reservationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);
  const [reservationResponse, options, paypalClientId, paymentResponse] =
    responses;
  if (!reservationResponse.ok) {
    return { status: "error", problem: await reservationResponse.json() };
  }
  const reservation: ReservationDTO = await reservationResponse.json();
  const payment = paymentResponse.ok ? await paymentResponse.json() : null;
  return {
    status: "success",
    reservation,
    options,
    paypalClientId,
    paid: payment?.paid === true,
  };
}

export async function updateReservationOptions(
  input: ReservationOptionsRequest,
): Promise<ReservationOptionsState> {
  const { reservationId, ...options } = input;
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(
    `${CAR_API_URL}/reservation/${reservationId}/options`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(options),
    },
  );
  if (!response.ok) {
    return { status: "error", problem: await response.json() };
  }
  const reservation: ReservationDTO = await response.json();
  return { status: "success", reservation };
}
