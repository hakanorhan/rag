"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import type {
  ExtraOption,
  MileageOption,
  ReservationDTO,
  ReservationOptionsState,
} from "@/types/reservation";

type ReservationSummaryProps = {
  changed: boolean;
  editable: boolean;
  mileage: MileageOption | undefined;
  pending: boolean;
  reservation: ReservationDTO;
  selectedExtras: ExtraOption[];
  state: ReservationOptionsState;
  submitLabel?: string;
  submitUnchanged?: boolean;
};

export default function ReservationSummary({
  changed,
  editable,
  mileage,
  pending,
  reservation,
  selectedExtras,
  state,
  submitLabel,
  submitUnchanged,
}: ReservationSummaryProps) {
  const t = useTranslations("Reservation");
  const format = useFormatter();
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });
  const basePrice = reservation.dailyRate * reservation.rentalDays;
  const mileagePrice = (mileage?.pricePerDay ?? 0) * reservation.rentalDays;
  const extrasPrice = selectedExtras.reduce(
    (sum, extra) => sum + extra.pricePerDay * reservation.rentalDays,
    0,
  );
  const total = basePrice + mileagePrice + extrasPrice;

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
        <Typography variant="body2" color="text.secondary">
          {changed ? t("estimatedTotal") : t("totalPrice")}
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
          disabled={pending || (!changed && !submitUnchanged)}
          sx={{
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: 650,
          }}
        >
          {pending ? t("saving") : (submitLabel ?? t("saveOptions"))}
        </Button>
      ) : null}
      {state.status === "success" && !changed ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t("saved")}
        </Alert>
      ) : null}
      {state.status === "error" ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {t(state.error ?? "saveError")}
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
      <Divider sx={{ my: 3 }} />
      <Button
        variant="outlined"
        disabled
        fullWidth
        sx={{ borderRadius: 2, textTransform: "none" }}
      >
        {t("pay")}
      </Button>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1.5 }}
      >
        {t("paymentUnavailable")}
      </Typography>
    </Paper>
  );
}
