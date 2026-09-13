import "server-only";

import { CAR_API_URL } from "@/lib/api";
import { parseProblemDetail } from "@/lib/problemDetails";
import { getSession } from "@/lib/session";
import type { CarDTO } from "@/types/car";
import type { LocationDTO } from "@/types/location";
import type {
  ReservationCarError,
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
  | { status: "error"; error: ReservationCarError };

export type ReservationPageResult =
  | { status: "unauthorized" | "not-found" | "error" }
  | {
      status: "success";
      reservation: ReservationDTO;
      options: ReservationOptions;
    };

export type ReservationsPageResult =
  | { status: "unauthorized" | "forbidden" | "error" }
  | { status: "success"; reservations: ReservationDTO[] };

export async function getAllCars(): Promise<CarDTO[]> {
  const response = await fetch(`${CAR_API_URL}/cars`);
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car request failed");
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
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car request failed");
  }
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export async function getLocations() {
  const response = await fetch(`${CAR_API_URL}/locations`);
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Location request failed");
  }
  return response.json() as Promise<LocationDTO[]>;
}

export async function createReservation(
  request: ReservationCarRequest,
  idempotencyKey: string,
): Promise<CreateReservationResult> {
  try {
    const accessToken = (await getSession())?.accessToken;
    if (!accessToken) {
      return { status: "error", error: "not-authenticated" };
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
      const problem = await parseProblemDetail(response);
      const status = problem?.status ?? response.status;

      if (status === 401) {
        return { status: "error", error: "not-authenticated" };
      }
      if (status === 403) {
        return { status: "error", error: "no-customer-account" };
      }
      if (problem?.type === "/problems/car-unavailable" || status === 409) {
        return { status: "error", error: "not-available" };
      }
      return { status: "error", error: "request-failed" };
    }

    const reservationId: unknown = await response.json();
    if (
      typeof reservationId !== "number" ||
      !Number.isSafeInteger(reservationId) ||
      reservationId <= 0
    ) {
      return { status: "error", error: "request-failed" };
    }

    return { status: "success", reservationId };
  } catch {
    return { status: "error", error: "request-failed" };
  }
}

export async function getReservationOptions(): Promise<ReservationOptions> {
  const response = await fetch(`${CAR_API_URL}/reservation/options`);
  if (!response.ok) throw new Error("Reservation options request failed");
  return response.json();
}

export async function getReservations(): Promise<ReservationsPageResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) return { status: "unauthorized" };

  const response = await fetch(`${CAR_API_URL}/reservations`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    const status = problem?.status ?? response.status;
    if (status === 401) return { status: "unauthorized" };
    if (status === 403) return { status: "forbidden" };
    return { status: "error" };
  }
  const reservations: unknown = await response.json();
  if (!Array.isArray(reservations)) return { status: "error" };
  return {
    status: "success",
    reservations: reservations as ReservationDTO[],
  };
}

export async function getReservationPage(input: {
  reservationId: number;
}): Promise<ReservationPageResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) return { status: "unauthorized" };

  const responses = await Promise.all([
    fetch(`${CAR_API_URL}/reservation/${input.reservationId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    getReservationOptions(),
  ]);
  const [reservationResponse, options] = responses;
  if (!reservationResponse.ok) {
    const problem = await parseProblemDetail(reservationResponse);
    const status = problem?.status ?? reservationResponse.status;
    if (status === 401) return { status: "unauthorized" };
    if (status === 403 || status === 404) return { status: "not-found" };
    return { status: "error" };
  }
  const reservation: ReservationDTO = await reservationResponse.json();
  return { status: "success", reservation, options };
}

export async function updateReservationOptions(
  input: ReservationOptionsRequest,
): Promise<ReservationOptionsState> {
  const { reservationId, ...options } = input;
  try {
    const accessToken = (await getSession())?.accessToken;
    if (!accessToken) {
      return { status: "error", error: "notAuthenticated" };
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
      const problem = await parseProblemDetail(response);
      const status = problem?.status ?? response.status;
      const error =
        status === 401
          ? "notAuthenticated"
          : status === 409
            ? "notEditable"
            : status === 400
              ? "invalid"
              : "saveError";
      return { status: "error", error };
    }
    const reservation: ReservationDTO = await response.json();
    return { status: "success", reservation };
  } catch {
    return { status: "error", error: "saveError" };
  }
}
