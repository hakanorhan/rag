import "server-only";

import type { CarDTO } from "@/types/car";

type CarSearchCriteria = {
  location?: string;
  pickupAt?: string;
  returnAt?: string;
};

export async function searchCarsByCriteria(
  criteria: CarSearchCriteria,
): Promise<CarDTO[]> {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(criteria)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const response = await fetch(
    `${process.env.CAR_API_URL}/cars/search?${searchParams.toString()}`,
    { cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Car search failed: ${response.status}`);
  }

  const result: unknown = await response.json();

  if (!Array.isArray(result)) {
    throw new Error("Invalid car search response");
  }

  return result as CarDTO[];
}

export default searchCarsByCriteria;
