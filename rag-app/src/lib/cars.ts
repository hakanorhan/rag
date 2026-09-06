import "server-only";

import { type ApiRequest, apiJson } from "@/lib/api";
import type { CarDTO } from "@/types/car";
import type { ReservationDTO } from "@/types/reservation";

type CarSearchCriteria = {
  location?: string;
  pickupAt?: string;
  returnAt?: string;
};

async function fetchCars(input: ApiRequest): Promise<CarDTO[]> {
  const result = await apiJson(input);
  if (!Array.isArray(result)) throw new Error("Invalid car search response");
  return result as CarDTO[];
}

export function getAllCars() {
  return fetchCars({ service: "car", path: "cars" });
}

export function searchCars(message: string) {
  return fetchCars({
    service: "ai",
    path: "cars/search",
    method: "POST",
    json: { message },
  });
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
    reservation.searchQuery ? searchCars(reservation.searchQuery) : null,
  ]);
  return selectRelatedCars({
    available,
    matches,
    excludedCarId: reservation.car.id,
  });
}
