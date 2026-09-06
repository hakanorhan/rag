import "server-only";

import { apiFetch } from "@/lib/api";
import { getAccessToken } from "@/lib/session";
import type {
  ReservationCarError,
  ReservationCarRequest,
  ReservationDTO,
  ReservationOptions,
  ReservationOptionsRequest,
  ReservationOptionsState,
} from "@/types/reservation";

type CreateReservationResult =
  | { status: "success"; reservationId: number }
  | { status: "error"; error: ReservationCarError };

export async function createReservation(
  request: ReservationCarRequest,
): Promise<CreateReservationResult> {
  try {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return { status: "error", error: "not-authenticated" };
    }

    const response = await apiFetch({
      service: "car",
      path: "reservation",
      method: "POST",
      accessToken,
      json: request,
    });

    if (!response.ok) {
      if (response.status === 401) {
        return { status: "error", error: "not-authenticated" };
      }

      if (response.status === 403) {
        return { status: "error", error: "no-customer-account" };
      }

      if (response.status === 409) {
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

export async function getReservations(
  accessToken: string,
): Promise<ReservationsPageResult> {
  const response = await apiFetch({
    service: "car",
    path: "reservations",
    accessToken,
  });
  if (response.status === 401) return { status: "unauthorized" };
  if (response.status === 403) return { status: "forbidden" };
  if (!response.ok) return { status: "error" };
  const reservations: unknown = await response.json();
  if (!Array.isArray(reservations)) return { status: "error" };
  return {
    status: "success",
    reservations: reservations as ReservationDTO[],
  };
}

export async function getReservationPage(input: {
  reservationId: number;
  accessToken: string;
}): Promise<ReservationPageResult> {
  const { reservationId, accessToken } = input;
  const responses = await Promise.all([
    apiFetch({
      service: "car",
      path: `reservation/${reservationId}`,
      accessToken,
    }),
    apiFetch({ service: "car", path: "reservation/options", accessToken }),
  ]);
  const [reservationResponse, optionsResponse] = responses;
  if (responses.some((response) => response.status === 401))
    return { status: "unauthorized" };
  if (reservationResponse.status === 403 || reservationResponse.status === 404)
    return { status: "not-found" };
  if (responses.some((response) => !response.ok)) return { status: "error" };
  const [reservation, options]: [ReservationDTO, ReservationOptions] =
    await Promise.all([reservationResponse.json(), optionsResponse.json()]);
  return { status: "success", reservation, options };
}

export async function updateReservationOptions(
  input: ReservationOptionsRequest,
): Promise<ReservationOptionsState> {
  const { reservationId, ...options } = input;
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) return { status: "error", error: "notAuthenticated" };

    const response = await apiFetch({
      service: "car",
      path: `reservation/${reservationId}/options`,
      method: "PUT",
      accessToken,
      json: options,
    });
    if (!response.ok) {
      const error =
        response.status === 401
          ? "notAuthenticated"
          : response.status === 409
            ? "notEditable"
            : response.status === 400
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
