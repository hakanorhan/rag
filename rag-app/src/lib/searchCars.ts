import "server-only";

import type { CarDTO } from "@/types/car";

export async function searchCars(message: string): Promise<CarDTO[]> {
  const response = await fetch(`${process.env.AI_API_URL}/cars/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Car search failed: ${response.status}`);
  }

  const result: unknown = await response.json();

  if (!Array.isArray(result)) {
    throw new Error("Invalid car search response");
  }

  return result as CarDTO[];
}

export default searchCars;
