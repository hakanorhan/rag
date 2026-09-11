"use client";

import Alert from "@mui/material/Alert";
import Skeleton from "@mui/material/Skeleton";
import { useTranslations } from "next-intl";
import { useCarSearchState } from "@/hooks/useCarSearchState";
import { carSearchStateQuery } from "@/lib/carSearch";
import { isValidDateRange } from "@/lib/dateTime";
import type { CarSearchState } from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";
import type { ReservationDTO, ReservationOptions } from "@/types/reservation";
import ReservationForm from "../ReservationForm";

type ReservationSearchBookingProps = {
  locale: string;
  locations: LocationDTO[];
  reservation: ReservationDTO;
  options: ReservationOptions;
  initialSearchState: CarSearchState;
};

export default function ReservationSearchBooking({
  locale,
  locations,
  reservation,
  options,
  initialSearchState,
}: ReservationSearchBookingProps) {
  const t = useTranslations("Reservation");
  const { searchState, updateSearchState, isLoaded } = useCarSearchState(
    initialSearchState,
    { syncUrl: true },
  );

  if (!isLoaded) {
    return <Skeleton variant="rounded" height={600} />;
  }

  if (!searchState) {
    return <Alert severity="warning">{t("searchStateMissing")}</Alert>;
  }

  const pickupLocation = locations.find(
    (location) => String(location.locationId) === searchState.pickUpLocationId,
  );
  const returnLocation = locations.find(
    (location) => String(location.locationId) === searchState.returnLocationId,
  );

  if (
    !pickupLocation ||
    !returnLocation ||
    !isValidDateRange(searchState.pickupAt, searchState.returnAt)
  ) {
    return <Alert severity="warning">{t("searchStateMissing")}</Alert>;
  }

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
    <ReservationForm
      mode="new"
      locale={locale}
      locations={locations}
      reservation={reservationWithSearchState}
      options={options}
      searchHref={{ pathname: "/cars", query: carSearchStateQuery(searchState) }}
      searchState={searchState}
      onSearchStateChange={updateSearchState}
    />
  );
}
