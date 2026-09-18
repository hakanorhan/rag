"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { carSearchStateQuery, parseCarSearchState } from "@/lib/carSearch";
import type { CarSearchState } from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";
import type { ReservationDTO, ReservationOptions } from "@/types/reservation";
import NewReservationForm from "../NewReservationForm";

type ReservationSearchBookingProps = {
  locale: string;
  locations: LocationDTO[];
  reservation: ReservationDTO;
  options: ReservationOptions;
};

export default function ReservationSearchBooking({
  locale,
  locations,
  reservation,
  options,
}: ReservationSearchBookingProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const searchState = parseCarSearchState(
    Object.fromEntries(searchParams.entries()),
  );
  const updateSearchState = (values: Partial<CarSearchState>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(values)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  };

  const pickupLocation =
    locations.find(
      (location) =>
        String(location.locationId) === searchState.pickUpLocationId,
    ) ?? reservation.pickupLocation;
  const returnLocation =
    locations.find(
      (location) =>
        String(location.locationId) === searchState.returnLocationId,
    ) ?? reservation.returnLocation;
  const searchStateWithLocations: CarSearchState = {
    ...searchState,
    pickUpLocationId: String(pickupLocation.locationId),
    returnLocationId: String(returnLocation.locationId),
  };

  const reservationWithSearchState: ReservationDTO = {
    ...reservation,
    pickupLocation,
    returnLocation,
    pickupAt: searchState.pickupAt,
    returnAt: searchState.returnAt,
    searchQuery:
      searchState.searchType === "freeText" ? searchState.query : null,
  };

  return (
    <NewReservationForm
      locale={locale}
      locations={locations}
      reservation={reservationWithSearchState}
      options={options}
      searchHref={{
        pathname: "/cars",
        query: carSearchStateQuery(searchStateWithLocations),
      }}
      searchState={searchStateWithLocations}
      onSearchStateChange={updateSearchState}
    />
  );
}
