"use server";

import { buildCarSearch } from "@/lib/carSearch";
import {
  type CarSearchResult,
  carSearchStateSchema,
} from "@/lib/carSearchState";
import { searchCars, searchCarsByCriteria, searchCarsById } from "@/lib/cars";
import { getLocations } from "@/lib/locations";

function findLocationId(
  name: string | null,
  locations: Awaited<ReturnType<typeof getLocations>>,
) {
  if (!name) return "";
  const normalizedName = name.trim().toLocaleLowerCase("de-DE");
  const location = locations.find(
    (candidate) =>
      candidate.name.trim().toLocaleLowerCase("de-DE") === normalizedName,
  );
  return location ? String(location.locationId) : "";
}

export async function findCars(searchState: unknown): Promise<CarSearchResult> {
  const input = carSearchStateSchema.safeParse(searchState);
  if (!input.success) return { status: "invalid" as const };

  const search = input.data;

  try {
    if (search.searchType === "freeText" || search.searchId) {
      if (!search.query.trim() && !search.searchId) return { status: "invalid" as const };

      const [result, locations] = await Promise.all([
        search.searchId ? searchCarsById(search.searchId) : searchCars(search.query),
        getLocations().catch(() => []),
      ]);
      return {
        status: "success" as const,
        cars: result.cars,
        searchState: {
          ...search,
          searchId: result.searchId,
          query: result.searchQuery,
          searchType: "freeText",
          pickUpLocationId:
            findLocationId(result.pickupLocation, locations) ||
            search.pickUpLocationId,
          returnLocationId:
            findLocationId(result.returnLocation, locations) ||
            search.returnLocationId,
          pickupAt: result.pickupAt ?? "",
          returnAt: result.returnAt ?? "",
        },
      };
    }

    const locations = await getLocations();
    const criteria = buildCarSearch({ params: search, locations });
    if (
      !criteria.pickUpLocationId ||
      !criteria.returnLocationId ||
      !criteria.pickupAt ||
      !criteria.returnAt ||
      !criteria.hasValidDateRange
    ) {
      return { status: "invalid" as const };
    }

    const cars = await searchCarsByCriteria({
      location: criteria.location,
      pickupAt: criteria.pickupAt,
      returnAt: criteria.returnAt,
    });
    return { status: "success" as const, cars, searchState: search };
  } catch {
    return { status: "error" as const };
  }
}
