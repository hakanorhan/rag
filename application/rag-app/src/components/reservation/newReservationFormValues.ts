import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";
import type { ReservationDTO, ReservationOptions } from "@/types/reservation";

export function getNewReservationFormValues(
  reservation: ReservationDTO,
  options: ReservationOptions,
  locations: LocationDTO[],
  searchState: CarSearchState,
) {
  const rentalDuration =
    Date.parse(searchState.returnAt) - Date.parse(searchState.pickupAt);
  const rentalDays =
    rentalDuration > 0 ? Math.ceil(rentalDuration / (24 * 60 * 60 * 1000)) : 0;
  const dateRangeValid = isValidDateRange(
    searchState.pickupAt,
    searchState.returnAt,
  );
  const displayedReservation = {
    ...reservation,
    pickupLocation:
      locations.find(
        (location) =>
          String(location.locationId) === searchState.pickUpLocationId,
      ) ?? reservation.pickupLocation,
    returnLocation:
      locations.find(
        (location) =>
          String(location.locationId) === searchState.returnLocationId,
      ) ?? reservation.returnLocation,
    pickupAt: searchState.pickupAt,
    returnAt: searchState.returnAt,
    rentalDays,
  };
  const mileagePackageId =
    searchState.mileagePackageId ?? String(reservation.mileagePackageId);
  const selectedExtraIds = (searchState.extraIds ?? "")
    .split(",")
    .filter(Boolean)
    .map(Number)
    .filter(Number.isInteger);
  const mileagePackages = options.mileagePackages.map((option) =>
    option.id === reservation.mileagePackageId
      ? {
          ...option,
          pricePerDay: reservation.mileagePricePerDay,
          includedKmPerDay: reservation.includedKmPerDay,
        }
      : option,
  );
  const selectedMileagePackage = mileagePackages.find(
    (option) => String(option.id) === mileagePackageId,
  );
  const selectedExtras = options.extras.filter((extra) =>
    selectedExtraIds.includes(extra.id),
  );
  const searchChanged =
    searchState.returnLocationId !==
      String(reservation.returnLocation.locationId) ||
    searchState.pickupAt !== reservation.pickupAt ||
    searchState.returnAt !== reservation.returnAt;
  const optionsChanged =
    Number(mileagePackageId) !== reservation.mileagePackageId ||
    selectedExtraIds.length !== reservation.extras.length ||
    selectedExtraIds.some(
      (id) => !reservation.extras.some((extra) => extra.id === id),
    );

  return {
    dateRangeValid,
    displayedReservation,
    mileagePackageId,
    mileagePackages,
    optionsChanged,
    searchChanged,
    selectedExtraIds,
    selectedExtras,
    selectedMileagePackage,
  };
}
