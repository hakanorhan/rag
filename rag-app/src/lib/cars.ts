import "server-only";

import { type ApiRequest, apiFetch } from "@/lib/api";
import { parseProblemDetail } from "@/lib/problemDetails";
import type { CarDTO, CarSearchResponse } from "@/types/car";
import type { ReservationDTO } from "@/types/reservation";

type CarSearchCriteria = {
  location?: string;
  pickupAt?: string;
  returnAt?: string;
};

async function fetchCars(input: ApiRequest): Promise<CarDTO[]> {
  const response = await apiFetch(input);
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car request failed");
  }
  const result: unknown = await response.json();
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export function getAllCars() {
  return fetchCars({ service: "car", path: "cars" });
}

export async function searchCars(message: string) {
  const response = await apiFetch({
    service: "ai",
    path: "cars/search",
    method: "POST",
    json: { message },
  });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car search request failed");
  }
  const result: CarSearchResponse = await response.json();
  if (!Array.isArray(result.cars)) {
    throw new Error("Invalid car search response");
  }
  return result;
}

export function searchCarsByCriteria(criteria: CarSearchCriteria) {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(criteria)) {
    if (value) searchParams.set(key, value);
  }
  return fetchCars({ service: "car", path: `cars/search?${searchParams}` });
}

function selectRelatedCars(input: {
  available: CarDTO[];
  matches: CarDTO[] | null;
  excludedCarId: number;
}) {
  const { available, matches, excludedCarId } = input;
  const matchingIds = new Set((matches ?? available).map((car) => car.id));
  return available
    .filter((car) => car.id !== excludedCarId && matchingIds.has(car.id))
    .slice(0, 3);
}

export async function getRelatedCars(reservation: ReservationDTO) {
  const [available, matches] = await Promise.all([
    searchCarsByCriteria({
      location: reservation.pickupLocation.name,
      pickupAt: reservation.pickupAt,
      returnAt: reservation.returnAt,
    }),
    reservation.searchQuery
      ? searchCars(reservation.searchQuery).then((result) => result.cars)
      : null,
  ]);
  return selectRelatedCars({
    available,
    matches,
    excludedCarId: reservation.car.id,
  });
}
