"use client";

import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { saveReservationOptions } from "@/app/actions/reservations";
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
  paid: boolean;
};

export default function ReservationOptionsForm({
  reservation,
  options,
  paid,
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
  const editable = savedReservation.status === "RESERVED" && !paid;
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
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Chip
          icon={<CheckCircleOutlineRounded />}
          label={t(`status.${savedReservation.status}`)}
          color="primary"
          variant="outlined"
        />
      </Box>
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
          mode="edit"
          editable={editable}
          mileage={selectedMileagePackage}
          pending={pending}
          reservation={savedReservation}
          selectedExtras={selectedExtras}
          state={state}
          paid={paid}
        />
      </Box>
    </>
  );
}

export function ReservationOptionsFormLoading() {
  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 4 }}>
        <Skeleton variant="rounded" width={120} height={32} />
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 360px" },
          gap: 3,
          alignItems: "start",
        }}
      >
        <Stack spacing={3} sx={{ minWidth: 0 }}>
          <ReservationVehicleCard />
          <MileagePackageField
            disabled
            mileageId=""
            options={[]}
            rentalDays={0}
            onChange={() => {}}
            loading
          />
          <ExtrasField
            disabled
            extras={[]}
            selectedIds={[]}
            onToggle={() => {}}
            loading
          />
        </Stack>
        <ReservationSummary mode="loading" loadingMode="edit" />
      </Box>
    </>
  );
}
