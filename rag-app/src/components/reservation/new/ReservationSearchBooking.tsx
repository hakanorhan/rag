"use client";

import Alert from "@mui/material/Alert";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { carSearchStateQuery, parseCarSearchState } from "@/lib/carSearch";
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
};

export default function ReservationSearchBooking({
  locale,
  locations,
  reservation,
  options,
}: ReservationSearchBookingProps) {
  const t = useTranslations("Reservation");
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
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

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
