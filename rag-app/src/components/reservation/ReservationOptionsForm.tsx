"use client";

import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { saveReservationOptions } from "@/app/actions/reservations";
import { Link } from "@/i18n/navigation";
import type { CarSearchHref } from "@/lib/carSearch";
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
  searchHref: CarSearchHref;
};

export default function ReservationOptionsForm({
  reservation,
  options,
  searchHref,
}: Props) {
  const t = useTranslations("Reservation");
  const saveAction = saveReservationOptions.bind(
    null,
    reservation.reservationId,
  );
  const [state, formAction, pending] = useActionState(
    saveAction,
    INITIAL_STATE,
  );
  const savedReservation =
    state.status === "success"
      ? (state.reservation ?? reservation)
      : reservation;
  const [mileagePackageId, setMileagePackageId] = useState(
    String(reservation.mileagePackageId),
  );
  const [selectedExtraIds, setSelectedExtraIds] = useState(
    reservation.extras.map((extra) => extra.id),
  );
  const editable = savedReservation.status === "RESERVED";
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
  const changed =
    Number(mileagePackageId) !== savedReservation.mileagePackageId ||
    selectedExtraIds.length !== savedReservation.extras.length ||
    selectedExtraIds.some(
      (id) => !savedReservation.extras.some((extra) => extra.id === id),
    );

  useEffect(() => {
    if (
      !options.mileagePackages.some(
        (option) => option.id === Number(mileagePackageId),
      )
    )
      setMileagePackageId(String(reservation.mileagePackageId));
    const available = new Set(options.extras.map((extra) => extra.id));
    setSelectedExtraIds((ids) => ids.filter((id) => available.has(id)));
  }, [
    mileagePackageId,
    options.extras,
    options.mileagePackages,
    reservation.mileagePackageId,
  ]);

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
          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: 2 }}
          >
            {t("reference", { id: savedReservation.reservationId })}
          </Typography>
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
        <Chip
          icon={<CheckCircleOutlineRounded />}
          label={t(`status.${savedReservation.status}`)}
          color="primary"
          variant="outlined"
        />
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
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <ReservationVehicleCard reservation={savedReservation} />
          {!editable ? <Alert severity="info">{t("notEditable")}</Alert> : null}
          <MileagePackageField
            disabled={!editable || pending}
            mileageId={mileagePackageId}
            options={mileagePackages}
            rentalDays={savedReservation.rentalDays}
            onChange={setMileagePackageId}
          />
          <ExtrasField
            disabled={!editable || pending}
            extras={extras}
            selectedIds={selectedExtraIds}
            onToggle={(extraId, selected) =>
              setSelectedExtraIds((ids) =>
                selected
                  ? [...ids, extraId]
                  : ids.filter((id) => id !== extraId),
              )
            }
          />
        </Stack>
        <ReservationSummary
          changed={changed}
          editable={editable}
          mileage={selectedMileagePackage}
          pending={pending}
          reservation={savedReservation}
          selectedExtras={selectedExtras}
          state={state}
        />
      </Box>
    </>
  );
}
