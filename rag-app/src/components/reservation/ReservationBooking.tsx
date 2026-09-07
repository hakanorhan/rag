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
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { saveReservationOptions } from "@/lib/actions";
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

const initialState: ReservationOptionsState = { status: "idle" };

type ReservationBookingProps = {
  reservation: ReservationDTO;
  options: ReservationOptions;
  searchHref: CarSearchHref;
};

export default function ReservationBooking({
  reservation,
  options,
  searchHref,
}: ReservationBookingProps) {
  const t = useTranslations("Reservation");
  const [state, formAction, pending] = useActionState(
    saveReservationOptions.bind(null, reservation.reservationId),
    initialState,
  );
  const saved = state.reservation ?? reservation;
  const [mileageId, setMileageId] = useState(
    String(reservation.mileagePackageId),
  );
  const [extraIds, setExtraIds] = useState(
    reservation.extras.map((extra) => extra.id),
  );
  const editable = saved.status === "RESERVED";
  const changed =
    Number(mileageId) !== saved.mileagePackageId ||
    extraIds.length !== saved.extras.length ||
    extraIds.some((id) => !saved.extras.some((extra) => extra.id === id));

  const mileagePackages = options.mileagePackages.map((option) =>
    option.id === saved.mileagePackageId
      ? {
          ...option,
          pricePerDay: saved.mileagePricePerDay,
          includedKmPerDay: saved.includedKmPerDay,
        }
      : option,
  );
  const extras = options.extras.map(
    (extra) =>
      saved.extras.find((selected) => selected.id === extra.id) ?? extra,
  );
  const mileage = mileagePackages.find(
    (option) => String(option.id) === mileageId,
  );
  const selectedExtras = extras.filter((extra) => extraIds.includes(extra.id));
  const disabled = !editable || pending;

  function toggleExtra(extraId: number, selected: boolean) {
    setExtraIds((current) =>
      selected ? [...current, extraId] : current.filter((id) => id !== extraId),
    );
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
          <Typography
            variant="overline"
            color="primary"
            sx={{ letterSpacing: 2 }}
          >
            {t("reference", { id: saved.reservationId })}
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
          label={t(`status.${saved.status}`)}
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
          <ReservationVehicleCard reservation={saved} />
          {!editable ? <Alert severity="info">{t("notEditable")}</Alert> : null}
          <MileagePackageField
            disabled={disabled}
            mileageId={mileageId}
            options={mileagePackages}
            rentalDays={saved.rentalDays}
            onChange={setMileageId}
          />
          <ExtrasField
            disabled={disabled}
            extras={extras}
            selectedIds={extraIds}
            onToggle={toggleExtra}
          />
        </Stack>

        <ReservationSummary
          changed={changed}
          editable={editable}
          mileage={mileage}
          pending={pending}
          reservation={saved}
          selectedExtras={selectedExtras}
          state={state}
        />
      </Box>
    </>
  );
}
