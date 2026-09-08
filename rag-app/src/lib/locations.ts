import "server-only";

import { apiFetch } from "@/lib/api";
import { parseProblemDetail } from "@/lib/problemDetails";
import type { LocationDTO } from "@/types/location";

export async function getLocations() {
  const response = await apiFetch({ service: "car", path: "locations" });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Location request failed");
  }
  return response.json() as Promise<LocationDTO[]>;
}
