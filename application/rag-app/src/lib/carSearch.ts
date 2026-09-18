import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";
import type { ReservationDTO } from "@/types/reservation";

type SearchParams = Record<string, string | string[] | undefined>;

function getValue(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

export function parseCarSearchState(params: SearchParams): CarSearchState {
  const query = getValue(params.query);
  const searchId = getValue(params.searchId);
  const requestedSearchType = getValue(params.searchType);

  return {
    pickUpLocationId: getValue(params.pickUpLocationId),
    returnLocationId: getValue(params.returnLocationId),
    pickupAt: getValue(params.pickupAt),
    returnAt: getValue(params.returnAt),
    query,
    searchId: searchId || undefined,
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
    "searchId",
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
  const query = getValue(params.query);
  const returnAt = getValue(params.returnAt);
  const requestedSearchType = getValue(params.searchType);
  const searchType: "freeText" | "criteria" =
    requestedSearchType === "freeText" || (!requestedSearchType && query)
      ? "freeText"
      : "criteria";

  return {
    location,
    pickupAt,
    returnAt,
    query,
    searchType,
    pickUpLocationId: pickupLocation?.locationId ?? 0,
    returnLocationId: returnLocation?.locationId ?? 0,
    hasSearch:
      searchType === "freeText"
        ? Boolean(query)
        : Boolean(location || pickupAt || returnAt),
    hasValidDateRange:
      (!pickupAt && !returnAt) || isValidDateRange(pickupAt, returnAt),
    initialValues: {
      pickUpLocationId,
      returnLocationId,
      pickupAt,
      query,
      returnAt,
    },
  };
}

export type CarSearch = ReturnType<typeof buildCarSearch>;

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

export function buildReservationSearchHref(
  reservation: ReservationDTO,
): CarSearchHref {
  const searchState: CarSearchState = {
    searchType: reservation.searchQuery ? "freeText" : "criteria",
    pickUpLocationId: String(reservation.pickupLocation.locationId),
    returnLocationId: String(reservation.returnLocation.locationId),
    pickupAt: reservation.pickupAt,
    returnAt: reservation.returnAt,
    query: reservation.searchQuery ?? "",
  };

  return {
    pathname: "/cars",
    query: carSearchStateQuery(searchState),
  };
}
