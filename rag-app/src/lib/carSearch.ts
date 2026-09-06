import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";
import type { ReservationDTO } from "@/types/reservation";

type SearchParams = Record<string, string | string[] | undefined>;

function getValue(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
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

export function buildReservationSearchHref(reservation: ReservationDTO) {
  const searchParams = new URLSearchParams({
    searchType: reservation.searchQuery ? "freeText" : "criteria",
    pickUpLocationId: String(reservation.pickupLocation.locationId),
    returnLocationId: String(reservation.returnLocation.locationId),
    pickupAt: reservation.pickupAt,
    returnAt: reservation.returnAt,
  });
  if (reservation.searchQuery)
    searchParams.set("query", reservation.searchQuery);

  return {
    pathname: "/cars" as const,
    query: Object.fromEntries(searchParams),
  };
}
