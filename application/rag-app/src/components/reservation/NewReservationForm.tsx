"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import {
  useActionState,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { reservationCar } from "@/app/actions/reservations";
import CarSearchDateTimeFields from "@/components/cars/CarSearchDateTimeFields";
import type { PickerTarget } from "@/components/cars/CarSearchForm.types";
import LocationSelect from "@/components/cars/LocationSelect";
import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";
import type {
  ReservationDTO,
  ReservationOptions,
  ReservationOptionsState,
} from "@/types/reservation";
import ExtrasField from "./ExtrasField";
import MileagePackageField from "./MileagePackageField";
import ReservationSummary from "./ReservationSummary";
import ReservationVehicleCard from "./ReservationVehicleCard";

const INITIAL_STATE: ReservationOptionsState = { status: "idle" };

type Props = {
  reservation: ReservationDTO;
  options: ReservationOptions;
  paypalClientId: string;
  locale: string;
  locations: LocationDTO[];
  searchState: CarSearchState;
  onSearchStateChange: (values: Partial<CarSearchState>) => void;
};

export default function NewReservationForm({
  reservation,
  options,
  paypalClientId,
  locale,
  locations,
  searchState,
  onSearchStateChange,
}: Props) {
  const t = useTranslations("Reservation");
  const reserveAction = reservationCar.bind(null, {
    carId: reservation.car.id,
    locale,
  });
  const [state, formAction, pending] = useActionState(
    reserveAction,
    INITIAL_STATE,
  );
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const createdReservationId =
    state.status === "success" ? state.reservationId : undefined;
  const reservationForm = useRef<HTMLFormElement>(null);
  const [openPicker, setOpenPicker] = useState<PickerTarget | null>(null);
  const [, setPickupAtHasError] = useState(false);
  const [, setReturnAtHasError] = useState(false);

  useEffect(() => setIdempotencyKey(crypto.randomUUID()), []);

  const continueReservation = useCallback(() => {
    reservationForm.current?.requestSubmit();
  }, []);

  function updateSearchState(values: Partial<CarSearchState>) {
    if (createdReservationId) return;
    setIdempotencyKey(crypto.randomUUID());
    onSearchStateChange(values);
  }

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

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">{t("bookingTitle")}</Typography>
        <Typography color="text.secondary">
          {t("bookingDescription")}
        </Typography>
      </Box>
      <Box
        component="form"
        ref={reservationForm}
        action={formAction}
        onReset={(event) => event.preventDefault()}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <input type="hidden" name="idempotencyKey" value={idempotencyKey} />
        <input
          type="hidden"
          name="pickupAt"
          value={displayedReservation.pickupAt}
        />
        <input
          type="hidden"
          name="returnAt"
          value={displayedReservation.returnAt}
        />
        <input
          type="hidden"
          name="searchQuery"
          value={displayedReservation.searchQuery ?? ""}
        />
        <input
          type="hidden"
          name="pickUpLocationId"
          value={searchState.pickUpLocationId}
        />
        <Stack
          component="fieldset"
          disabled={Boolean(createdReservationId)}
          spacing={3}
          sx={{ minWidth: 0, border: 0, m: 0, p: 0 }}
        >
          <ReservationVehicleCard reservation={displayedReservation} />
          <Paper component="section" variant="outlined">
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocationSelect
                  disabled
                  label={t("pickup")}
                  name="pickUpLocationId"
                  value={searchState.pickUpLocationId}
                  locations={locations}
                  onChange={(value) =>
                    onSearchStateChange({ pickUpLocationId: value })
                  }
                  error={false}
                  helperText=""
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <LocationSelect
                  label={t("return")}
                  name="returnLocationId"
                  value={searchState.returnLocationId}
                  locations={locations}
                  onChange={(value) =>
                    updateSearchState({ returnLocationId: value })
                  }
                  error={false}
                  helperText=""
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <CarSearchDateTimeFields
                  pickupAt={searchState.pickupAt}
                  returnAt={searchState.returnAt}
                  pickupDateLabel={t("pickup")}
                  returnDateLabel={t("return")}
                  incompleteDateRange={t("invalid")}
                  invalidDateRange={t("invalid")}
                  openPicker={openPicker}
                  onOpenPickerChange={setOpenPicker}
                  onPickupAtChange={(value) =>
                    updateSearchState({ pickupAt: value })
                  }
                  onReturnAtChange={(value) =>
                    updateSearchState({ returnAt: value })
                  }
                  onPickupErrorChange={setPickupAtHasError}
                  onReturnErrorChange={setReturnAtHasError}
                  showRequiredErrors={false}
                />
              </Grid>
            </Grid>
          </Paper>
          <MileagePackageField
            disabled={pending}
            mileageId={mileagePackageId}
            options={mileagePackages}
            rentalDays={displayedReservation.rentalDays}
            onChange={(value) => updateSearchState({ mileagePackageId: value })}
          />
          <ExtrasField
            disabled={pending}
            extras={options.extras}
            selectedIds={selectedExtraIds}
            onToggle={(extraId, selected) =>
              updateSearchState({
                extraIds: (selected
                  ? [...selectedExtraIds, extraId]
                  : selectedExtraIds.filter((id) => id !== extraId)
                ).join(","),
              })
            }
          />
        </Stack>
        <ReservationSummary
          changed={!createdReservationId && (optionsChanged || searchChanged)}
          mode="create"
          editable={!createdReservationId}
          mileage={selectedMileagePackage}
          pending={pending}
          reservation={{
            ...displayedReservation,
            reservationId:
              createdReservationId ?? displayedReservation.reservationId,
          }}
          selectedExtras={selectedExtras}
          state={state}
          submitDisabled={!idempotencyKey || !dateRangeValid}
          onDriverLicenseSaved={continueReservation}
          paypalClientId={createdReservationId ? paypalClientId : undefined}
        />
      </Box>
    </>
  );
}
