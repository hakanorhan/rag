"use client";

import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import CarSearchDateTimeFields from "@/components/cars/CarSearchDateTimeFields";
import {
  LocationSelect,
  type PickerTarget,
} from "@/components/cars/CarSearchForm";
import { Link } from "@/i18n/navigation";
import { reservationCar, saveReservationOptions } from "@/lib/actions";
import type { CarSearchHref } from "@/lib/carSearch";
import type { CarSearchState } from "@/lib/carSearchState";
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

type CommonReservationFormProps = {
  reservation: ReservationDTO;
  options: ReservationOptions;
  searchHref: CarSearchHref;
};

type NewReservationFormProps = CommonReservationFormProps & {
  mode: "new";
  locale: string;
  locations: LocationDTO[];
  searchState: CarSearchState;
  onSearchStateChange: (values: Partial<CarSearchState>) => void;
};

type ReservedReservationFormProps = CommonReservationFormProps & {
  mode: "reserved";
};

type ReservationFormProps =
  | NewReservationFormProps
  | ReservedReservationFormProps;

export default function ReservationForm(props: ReservationFormProps) {
  const { reservation, options, searchHref } = props;
  const t = useTranslations("Reservation");
  const serverAction =
    props.mode === "new"
      ? reservationCar.bind(null, {
          carId: reservation.car.id,
          locale: props.locale,
        })
      : saveReservationOptions.bind(null, reservation.reservationId);
  const [saveState, formAction, saving] = useActionState(
    serverAction,
    INITIAL_STATE,
  );
  const savedReservation = saveState.reservation ?? reservation;
  const initialMileagePackageId = String(reservation.mileagePackageId);
  const initialExtraIds =
    props.mode === "reserved" && reservation.extras.length
      ? reservation.extras.map((extra) => extra.id)
      : [];
  const [localMileagePackageId, setLocalMileagePackageId] = useState(
    initialMileagePackageId,
  );
  const [localSelectedExtraIds, setLocalSelectedExtraIds] = useState(
    initialExtraIds,
  );
  const mileagePackageId =
    props.mode === "new"
      ? props.searchState.mileagePackageId ?? String(reservation.mileagePackageId)
      : localMileagePackageId;
  const selectedExtraIds =
    props.mode === "new"
      ? (props.searchState.extraIds ?? "")
          .split(",")
          .filter(Boolean)
          .map(Number)
          .filter(Number.isInteger)
      : localSelectedExtraIds;

  useEffect(() => {
    if (props.mode !== "reserved") return;

    const mileagePackageIsAvailable = options.mileagePackages.some(
      (option) => option.id === Number(localMileagePackageId),
    );
    const availableExtraIds = new Set(options.extras.map((extra) => extra.id));
    if (!mileagePackageIsAvailable) {
      setLocalMileagePackageId(String(reservation.mileagePackageId));
    }
    setLocalSelectedExtraIds((ids) =>
      ids.filter((extraId) => availableExtraIds.has(extraId)),
    );
  }, [
    localMileagePackageId,
    options.extras,
    options.mileagePackages,
    props.mode,
    reservation.mileagePackageId,
  ]);
  const [, setPickupAtHasError] = useState(false);
  const [, setReturnAtHasError] = useState(false);
  const [openPicker, setOpenPicker] = useState<PickerTarget | null>(null);

  const editable =
    props.mode === "new" || savedReservation.status === "RESERVED";
  const mileagePackages = options.mileagePackages.map((option) =>
    option.id === savedReservation.mileagePackageId
      ? {
          ...option,
          pricePerDay: savedReservation.mileagePricePerDay,
          includedKmPerDay: savedReservation.includedKmPerDay,
        }
      : option,
  );
  const extras = options.extras.map(
    (extra) =>
      savedReservation.extras.find((selected) => selected.id === extra.id) ??
      extra,
  );
  const selectedMileagePackage = mileagePackages.find(
    (option) => String(option.id) === mileagePackageId,
  );
  const selectedExtras = extras.filter((extra) =>
    selectedExtraIds.includes(extra.id),
  );
  const optionsChanged =
    Number(mileagePackageId) !== savedReservation.mileagePackageId ||
    selectedExtraIds.length !== savedReservation.extras.length ||
    selectedExtraIds.some(
      (id) => !savedReservation.extras.some((extra) => extra.id === id),
    );

  let displayedReservation = savedReservation;
  let searchChanged = false;

  if (props.mode === "new") {
    const { pickUpLocationId, returnLocationId, pickupAt, returnAt } =
      props.searchState;
    const pickupLocation =
      props.locations.find(
        (location) => String(location.locationId) === pickUpLocationId,
      ) ?? savedReservation.pickupLocation;
    const returnLocation =
      props.locations.find(
        (location) => String(location.locationId) === returnLocationId,
      ) ?? savedReservation.returnLocation;
    const rentalDuration = Date.parse(returnAt) - Date.parse(pickupAt);
    const rentalDays =
      rentalDuration > 0
        ? Math.ceil(rentalDuration / (24 * 60 * 60 * 1000))
        : 0;

    displayedReservation = {
      ...savedReservation,
      pickupLocation,
      returnLocation,
      pickupAt,
      returnAt,
      rentalDays,
      totalPrice: savedReservation.dailyRate * rentalDays,
    };
    searchChanged =
      returnLocationId !== String(savedReservation.returnLocation.locationId) ||
      pickupAt !== savedReservation.pickupAt ||
      returnAt !== savedReservation.returnAt;
  }

  function toggleExtra(extraId: number, selected: boolean) {
    const nextIds = selected
      ? [...selectedExtraIds, extraId]
      : selectedExtraIds.filter((id) => id !== extraId);
    if (props.mode === "new") {
      props.onSearchStateChange({ extraIds: nextIds.join(",") });
    } else {
      setLocalSelectedExtraIds(nextIds);
    }
  }

  function changeMileagePackage(value: string) {
    if (props.mode === "new") {
      props.onSearchStateChange({ mileagePackageId: value });
    } else {
      setLocalMileagePackageId(value);
    }
  }

  return (
    <>
      <Link href={searchHref}>
        <Button
          component="span"
          startIcon={<ArrowBackRounded />}
          sx={{ mb: 3, px: 0 }}
        >
          {t("backToSearch")}
        </Button>
      </Link>

      <Stack
        direction="row"
        sx={{
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box>
          {props.mode === "reserved" ? (
            <Typography
              variant="overline"
              color="primary"
              sx={{ letterSpacing: 2 }}
            >
              {t("reference", { id: savedReservation.reservationId })}
            </Typography>
          ) : null}
          <Typography
            component="h1"
            variant="h3"
            sx={{
              fontSize: { xs: 30, md: 42 },
              fontWeight: 700,
              letterSpacing: -1,
            }}
          >
            {t("bookingTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t("bookingDescription")}
          </Typography>
        </Box>
        {props.mode === "reserved" ? (
          <Chip
            icon={<CheckCircleOutlineRounded />}
            label={t(`status.${savedReservation.status}`)}
            color="primary"
            variant="outlined"
          />
        ) : null}
      </Stack>

      <Box
        component="form"
        action={formAction}
        onReset={(event) => event.preventDefault()}
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        {props.mode === "new" ? (
          <>
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
              value={props.searchState.pickUpLocationId}
            />
          </>
        ) : null}

        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <ReservationVehicleCard reservation={displayedReservation} />
          {props.mode === "reserved" && !editable ? (
            <Alert severity="info">{t("notEditable")}</Alert>
          ) : null}
          {props.mode === "new" ? (
            <Paper
              component="section"
              variant="outlined"
              sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}
            >
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LocationSelect
                    disabled
                    label={t("pickup")}
                    name="pickUpLocationId"
                    value={props.searchState.pickUpLocationId}
                    locations={props.locations}
                    onChange={(value) =>
                      props.onSearchStateChange({ pickUpLocationId: value })
                    }
                    error={false}
                    helperText=""
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <LocationSelect
                    label={t("return")}
                    name="returnLocationId"
                    value={props.searchState.returnLocationId}
                    locations={props.locations}
                    onChange={(value) =>
                      props.onSearchStateChange({ returnLocationId: value })
                    }
                    error={false}
                    helperText=""
                  />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <CarSearchDateTimeFields
                    pickupAt={props.searchState.pickupAt}
                    returnAt={props.searchState.returnAt}
                    pickupDateLabel={t("pickup")}
                    returnDateLabel={t("return")}
                    incompleteDateRange={t("invalid")}
                    invalidDateRange={t("invalid")}
                    openPicker={openPicker}
                    onOpenPickerChange={setOpenPicker}
                    onPickupAtChange={(value) =>
                      props.onSearchStateChange({ pickupAt: value })
                    }
                    onReturnAtChange={(value) =>
                      props.onSearchStateChange({ returnAt: value })
                    }
                    onPickupErrorChange={setPickupAtHasError}
                    onReturnErrorChange={setReturnAtHasError}
                    showRequiredErrors={false}
                  />
                </Grid>
              </Grid>
            </Paper>
          ) : null}
          <MileagePackageField
            disabled={!editable || saving}
            mileageId={mileagePackageId}
            options={mileagePackages}
            rentalDays={displayedReservation.rentalDays}
            onChange={changeMileagePackage}
          />
          <ExtrasField
            disabled={!editable || saving}
            extras={extras}
            selectedIds={selectedExtraIds}
            onToggle={toggleExtra}
          />
        </Stack>

        <ReservationSummary
          changed={optionsChanged || searchChanged}
          editable={editable}
          mileage={selectedMileagePackage}
          pending={saving}
          reservation={displayedReservation}
          selectedExtras={selectedExtras}
          state={saveState}
          submitLabel={props.mode === "new" ? t("reserve") : undefined}
          submitUnchanged={props.mode === "new"}
        />
      </Box>
    </>
  );
}
