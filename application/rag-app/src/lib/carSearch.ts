import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";

type SearchParams = Record<string, string | string[] | undefined>;

function getValue(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseCarSearchState(params: SearchParams): CarSearchState {
  const query = getValue(params.query);
  const requestedSearchType = getValue(params.searchType);

  return {
    pickUpLocationId: getValue(params.pickUpLocationId),
    returnLocationId: getValue(params.returnLocationId),
    pickupAt: getValue(params.pickupAt),
    returnAt: getValue(params.returnAt),
    query,
    mileagePackageId: getValue(params.mileagePackageId) || undefined,
    extraIds:
      params.extraIds === undefined ? undefined : getValue(params.extraIds),
    searchType:
      requestedSearchType === "freeText" || (!requestedSearchType && query)
        ? "freeText"
        : "criteria",
  };
}

export function carSearchStateQuery(
  searchState: CarSearchState,
): Record<string, string> {
  const query: Record<string, string> = {
    searchType: searchState.searchType,
  };

  for (const key of [
    "pickUpLocationId",
    "returnLocationId",
    "pickupAt",
    "returnAt",
    "query",
    "mileagePackageId",
    "extraIds",
  ] as const) {
    if (key === "extraIds" && searchState.extraIds !== undefined) {
      query[key] = searchState.extraIds;
    } else if (searchState[key]) {
      query[key] = searchState[key];
    }
  }

  return query;
}

export function buildCarSearch(input: {
  params: SearchParams;
  locations: LocationDTO[];
}) {
  const { params, locations } = input;
  const pickUpLocationId = getValue(params.pickUpLocationId);
  const returnLocationId = getValue(params.returnLocationId);
  const pickupLocation = locations.find(
    (location) => location.locationId === Number(pickUpLocationId),
  );
  const returnLocation = locations.find(
    (location) => location.locationId === Number(returnLocationId),
  );
  const location = pickupLocation?.name ?? getValue(params.location);
  const pickupAt = getValue(params.pickupAt);
  const returnAt = getValue(params.returnAt);

  return {
    location,
    pickupAt,
    returnAt,
    pickUpLocationId: pickupLocation?.locationId ?? 0,
    returnLocationId: returnLocation?.locationId ?? 0,
    hasValidDateRange:
      (!pickupAt && !returnAt) || isValidDateRange(pickupAt, returnAt),
  };
}

export type CarSearchHref = {
  pathname: "/cars";
  query: Record<string, string>;
};

export function buildCarSearchHref(searchState: CarSearchState): CarSearchHref {
  return {
    pathname: "/cars",
    query: carSearchStateQuery(searchState),
  };
}

export type ReservationCarHref = {
  pathname: "/reservation-car/new/[carId]";
  params: { carId: string };
  query: Record<string, string>;
};

export function buildReservationCarHref(
  carId: number,
  searchState: CarSearchState,
): ReservationCarHref {
  return {
    pathname: "/reservation-car/new/[carId]",
    params: { carId: String(carId) },
    query: carSearchStateQuery(searchState),
  };
}
