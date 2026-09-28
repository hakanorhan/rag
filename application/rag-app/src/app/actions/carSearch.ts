"use server";

import { buildCarSearch } from "@/lib/carSearch";
import {
  type CarSearchResult,
  carSearchStateSchema,
} from "@/lib/carSearchState";
import { ProblemDetailError } from "@/lib/problemDetails";
import { consumeRateLimit, rateLimitProblem } from "@/lib/rateLimit";
import { searchCars, searchCarsById } from "@/lib/services/ai";
import { getLocations, searchCarsByCriteria } from "@/lib/services/car";

export async function getSearchLocations() {
  return getLocations();
}

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
  if (!input.success) {
    return {
      status: "error",
      problem: {
        type: "/problems/validation-error",
        status: 400,
        code: "VALIDATION_ERROR",
      },
    };
  }

  const search = input.data;
  try {
    if (search.searchType === "freeText" || search.searchId) {
      if (!search.query.trim() && !search.searchId) {
        return {
          status: "error",
          problem: {
            type: "/problems/validation-error",
            status: 400,
            code: "VALIDATION_ERROR",
          },
        };
      }

      if (!search.searchId) {
        try {
          await consumeRateLimit("freeTextSearch");
        } catch {
          return { status: "error", problem: rateLimitProblem };
        }
      }

      const [result, locations] = await Promise.all([
        search.searchId
          ? searchCarsById(search.searchId)
          : searchCars(search.query),
        getLocations().catch(() => []),
      ]);
      return {
        status: "success" as const,
        cars: result.cars,
        searchState: {
          ...search,
          searchId: search.searchId,
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
      return {
        status: "error",
        problem: {
          type: "/problems/validation-error",
          status: 400,
          code: "VALIDATION_ERROR",
        },
      };
    }

    const cars = await searchCarsByCriteria({
      location: criteria.location,
      pickupAt: criteria.pickupAt,
      returnAt: criteria.returnAt,
    });
    return { status: "success" as const, cars, searchState: search };
  } catch (error) {
    if (error instanceof ProblemDetailError) {
      return {
        status: "error",
        problem: error.problem,
      };
    }
    throw error;
  }
}
