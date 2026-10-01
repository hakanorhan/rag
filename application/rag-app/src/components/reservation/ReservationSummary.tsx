"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
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

type ReservationSummaryProps =
  | { mode: "loading"; loadingMode?: "create" | "edit" }
  | (CommonProps &
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
      ));

export default function ReservationSummary(props: ReservationSummaryProps) {
  const data = props.mode === "loading" ? null : props;
  const changed = data?.changed ?? false;
  const editable = data?.editable ?? false;
  const pending = data?.pending ?? false;
  const reservation = data?.reservation;
  const selectedExtras = data?.selectedExtras ?? [];
  const state = data?.state;
  const t = useTranslations("Reservation");
  const problemT = useTranslations("Problems");
  const format = useFormatter();
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });
  const basePrice = reservation
    ? reservation.dailyRate * reservation.rentalDays
    : 0;
  const mileagePrice = reservation
    ? (data?.mileage?.pricePerDay ?? 0) * reservation.rentalDays
    : 0;
  const extrasPrice = selectedExtras.reduce(
    (sum, extra) => sum + extra.pricePerDay * (reservation?.rentalDays ?? 0),
    0,
  );
  const isCreate =
    props.mode === "create" ||
    (props.mode === "loading" && props.loadingMode !== "edit");
  const hideSubmit = !isCreate && !changed;
  const total =
    isCreate || changed
      ? basePrice + mileagePrice + extrasPrice
      : (reservation?.totalPrice ?? 0);
  const grossCents = Math.round(total * 100);
  const netCents = Math.round(grossCents / 1.19);
  const problem = state?.status === "error" ? state.problem : null;
  const licenseRequired = problem?.code === "DRIVER_LICENSE_REQUIRED";

  return (
    <Paper
      component="aside"
      variant="outlined"
      aria-labelledby="summary-title"
      sx={{
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
        {reservation ? (
          <>
            {t("rentalDays", { days: reservation.rentalDays })} ·{" "}
            {reservation.car.carCategory}
          </>
        ) : (
          <Skeleton width="70%" />
        )}
      </Typography>
      <Stack spacing={2}>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Box>
            <Typography variant="body2">{t("vehicleRental")}</Typography>
            <Typography variant="caption" color="text.secondary">
              {reservation ? (
                `${reservation.rentalDays} × ${money(reservation.dailyRate)}`
              ) : (
                <Skeleton width={100} />
              )}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {reservation ? money(basePrice) : <Skeleton width={65} />}
          </Typography>
        </Stack>
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography variant="body2">{t("mileagePackage")}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {reservation
              ? mileagePrice === 0
                ? t("included")
                : money(mileagePrice)
              : t("included")}
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
              {money(extra.pricePerDay * (reservation?.rentalDays ?? 0))}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Divider sx={{ my: 3 }} />
      <Box aria-live="polite" aria-atomic="true">
        <Stack direction="row" sx={{ justifyContent: "space-between", gap: 2 }}>
          <Typography variant="body2">{t("netPrice")}</Typography>
          <Typography variant="body2">
            {reservation ? money(netCents / 100) : <Skeleton width={65} />}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", gap: 2, mt: 1 }}
        >
          <Typography variant="body2">{t("vatIncluded")}</Typography>
          <Typography variant="body2">
            {reservation ? (
              money((grossCents - netCents) / 100)
            ) : (
              <Skeleton width={65} />
            )}
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary">
          {isCreate || changed ? t("estimatedTotal") : t("totalPrice")}
        </Typography>
        <Typography
          variant="h3"
          sx={{ fontWeight: 750, fontSize: 38, mt: 0.5, letterSpacing: -1 }}
        >
          {reservation ? money(total) : <Skeleton width="60%" height={48} />}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 1, mb: 3 }}
      >
        {t("billingNote")}
      </Typography>
      {!reservation ? (
        <Skeleton variant="rounded" height={48} />
      ) : editable ? (
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
          }}
        >
          {pending ? t("saving") : t(isCreate ? "reserve" : "saveOptions")}
        </Button>
      ) : null}
      {state?.status === "success" && !changed ? (
        <Alert severity="success" sx={{ mt: 2 }}>
          {t(isCreate ? "reservationCreated" : "saved")}
        </Alert>
      ) : null}
      {state?.status === "error" &&
      licenseRequired &&
      props.mode === "create" ? (
        <InlineDriverLicenseForm onSaved={props.onDriverLicenseSaved} />
      ) : null}
      {state?.status === "error" && !licenseRequired ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {getProblemMessage(state.problem, problemT)}
        </Alert>
      ) : null}
      {changed && state?.status !== "error" ? (
        <Typography
          role="status"
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mt: 1.5 }}
        >
          {t("unsaved")}
        </Typography>
      ) : null}
      {data && data.paypalClientId !== undefined ? (
        <>
          <Divider sx={{ my: 3 }} />
          <PaypalButton
            clientId={data.paypalClientId}
            reservationId={reservation?.reservationId ?? 0}
            disabled={isCreate ? false : changed || pending || !editable}
            paid={props.mode === "edit" ? props.paid : false}
          />
        </>
      ) : null}
    </Paper>
  );
}
