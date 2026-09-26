"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import { getProblemMessage } from "@/lib/problemDetails";
import type {
  ExtraOption,
  MileageOption,
  ReservationDTO,
  ReservationOptionsState,
} from "@/types/reservation";
import InlineDriverLicenseForm from "./InlineDriverLicenseForm";
import PaypalButton from "./PaypalButton";

type CommonProps = {
  changed: boolean;
  editable: boolean;
  mileage: MileageOption | undefined;
  pending: boolean;
  reservation: ReservationDTO;
  selectedExtras: ExtraOption[];
  state: ReservationOptionsState;
};

type ReservationSummaryProps = CommonProps &
  (
    | {
        mode: "create";
        submitDisabled: boolean;
        onDriverLicenseSaved: () => void;
        paypalClientId?: string;
      }
    | {
        mode: "edit";
        paypalClientId: string;
        paid: boolean;
      }
  );

export default function ReservationSummary(props: ReservationSummaryProps) {
  const {
    changed,
    editable,
    mileage,
    pending,
    reservation,
    selectedExtras,
    state,
  } = props;
  const t = useTranslations("Reservation");
  const problemT = useTranslations("Problems");
  const format = useFormatter();
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });
  const basePrice = reservation.dailyRate * reservation.rentalDays;
  const mileagePrice = (mileage?.pricePerDay ?? 0) * reservation.rentalDays;
  const extrasPrice = selectedExtras.reduce(
    (sum, extra) => sum + extra.pricePerDay * reservation.rentalDays,
    0,
  );
  const isCreate = props.mode === "create";
  const hideSubmit = !isCreate && !changed;
  const total =
    isCreate || changed
      ? basePrice + mileagePrice + extrasPrice
      : reservation.totalPrice;
  const grossCents = Math.round(total * 100);
  const netCents = Math.round(grossCents / 1.19);
  const problem = state.status === "error" ? state.problem : null;
  const licenseRequired = problem?.code === "DRIVER_LICENSE_REQUIRED";

  return (
    <Paper
      component="aside"
      variant="outlined"
      aria-labelledby="summary-title"
      sx={{
        p: { xs: 2.5, md: 3.5 },
        borderRadius: 3,
        position: { md: "sticky" },
        top: 24,
        borderTop: 4,
        borderTopColor: "primary.main",
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        id="summary-title"
        sx={{ fontWeight: 700 }}
      >
        {t("summaryTitle")}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
        {t("rentalDays", { days: reservation.rentalDays })} ·{" "}
        {reservation.car.carCategory}
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="body2">{t("vehicleRental")}</Typography>
            <Typography variant="caption" color="text.secondary">
              {reservation.rentalDays} × {money(reservation.dailyRate)}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {money(basePrice)}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography variant="body2">{t("mileagePackage")}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {mileagePrice === 0 ? t("included") : money(mileagePrice)}
          </Typography>
        </Stack>
        {selectedExtras.map((extra) => (
          <Stack
            key={extra.id}
            direction="row"
            sx={{ justifyContent: "space-between", gap: 2 }}
          >
            <Typography variant="body2">{extra.name}</Typography>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {money(extra.pricePerDay * reservation.rentalDays)}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Box aria-live="polite" aria-atomic="true">
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography variant="body2">{t("netPrice")}</Typography>
          <Typography variant="body2">{money(netCents / 100)}</Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", gap: 2, mt: 1 }}
        >
          <Typography variant="body2">{t("vatIncluded")}</Typography>
          <Typography variant="body2">
            {money((grossCents - netCents) / 100)}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {isCreate || changed ? t("estimatedTotal") : t("totalPrice")}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 750, fontSize: 38, mt: 0.5, letterSpacing: -1 }}
        >
          {money(total)}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, mb: 3 }}
      >
        {t("billingNote")}
      </Typography>
      {editable ? (
        <Button
          type="submit"
          variant="contained"
          fullWidth
          size="large"
          disabled={
            hideSubmit ||
            pending ||
            (props.mode === "create" && props.submitDisabled) ||
            licenseRequired
          }
          sx={{
            display: hideSubmit ? "none" : "block",
            py: 1.5,
            borderRadius: 2,
            fontWeight: 650,
          }}
        >
          {pending ? t("saving") : t(isCreate ? "reserve" : "saveOptions")}
        </Button>
      ) : null}
      {state.status === "success" && !changed ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t(isCreate ? "reservationCreated" : "saved")}
        </Alert>
      ) : null}
      {state.status === "error" &&
      licenseRequired &&
      props.mode === "create" ? (
        <InlineDriverLicenseForm onSaved={props.onDriverLicenseSaved} />
      ) : null}
      {state.status === "error" && !licenseRequired ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getProblemMessage(state.problem, problemT)}
        </Alert>
      ) : null}
      {changed && state.status !== "error" ? (
        <Typography
          role="status"
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1.5 }}
        >
          {t("unsaved")}
        </Typography>
      ) : null}
      {props.paypalClientId !== undefined ? (
        <>
          <Divider sx={{ my: 3 }} />
          <PaypalButton
            clientId={props.paypalClientId}
            reservationId={reservation.reservationId}
            disabled={isCreate ? false : changed || pending || !editable}
            paid={props.mode === "edit" ? props.paid : false}
          />
        </>
      ) : null}
    </Paper>
  );
}
