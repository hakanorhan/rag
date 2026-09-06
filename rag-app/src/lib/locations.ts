import "server-only";

import { apiJson } from "@/lib/api";
import type { LocationDTO } from "@/types/location";

export function getLocations() {
  return apiJson<LocationDTO[]>({ service: "car", path: "locations" });
}
