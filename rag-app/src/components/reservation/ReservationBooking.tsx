"use client";

import ArrowBackRounded from "@mui/icons-material/ArrowBackRounded";
import CheckCircleOutlineRounded from "@mui/icons-material/CheckCircleOutlineRounded";
import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import { type ComponentProps, useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { saveReservationOptions } from "@/lib/actions";
import { TIME_ZONE } from "@/lib/dateTime";
import type {
  ReservationDTO,
  ReservationOptions,
  ReservationOptionsState,
} from "@/types/reservation";

const initialState: ReservationOptionsState = { status: "idle" };
const panel = { p: { xs: 2.5, md: 3.5 }, borderRadius: 3 };

export default function ReservationBooking({
  reservation,
  options,
  searchHref,
}: {
  reservation: ReservationDTO;
  options: ReservationOptions;
  searchHref: ComponentProps<typeof Link>["href"];
}) {
  const t = useTranslations("Reservation");
  const format = useFormatter();
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

  // Keep the booked prices for options that are already part of the reservation.
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
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });
  const basePrice = saved.dailyRate * saved.rentalDays;
  const mileagePrice = (mileage?.pricePerDay ?? 0) * saved.rentalDays;
  const extrasPrice = selectedExtras.reduce(
    (sum, extra) => sum + extra.pricePerDay * saved.rentalDays,
    0,
  );
  const total = changed
    ? basePrice + mileagePrice + extrasPrice
    : saved.totalPrice;
  const date = (value: string) =>
    format.dateTime(new Date(value), {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: TIME_ZONE,
    });
  const time = (value: string) =>
    format.dateTime(new Date(value), {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: TIME_ZONE,
    });

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
          <Paper
            variant="outlined"
            sx={{ borderRadius: 3, overflow: "hidden" }}
          >
            <Box sx={{ px: { xs: 2.5, md: 3.5 }, pt: 3 }}>
              <Typography variant="overline" color="text.secondary">
                {saved.car.carType}
              </Typography>
              <Typography variant="h4" component="h2" sx={{ fontWeight: 650 }}>
                {saved.car.brand} {saved.car.model}
              </Typography>
              <Stack
                direction="row"
                spacing={0.5}
                sx={{
                  alignItems: "center",
                  mt: 1,
                  color: "text.secondary",
                }}
              >
                <LocationOnOutlined fontSize="small" />
                <Typography variant="body2">
                  {saved.pickupLocation.name} ·{" "}
                  {t("minimumAge", { age: saved.car.minimumAge })}
                </Typography>
              </Stack>
            </Box>
            {saved.car.imageUrl ? (
              <Box
                component="img"
                src={saved.car.imageUrl}
                alt={`${saved.car.brand} ${saved.car.model}`}
                sx={{
                  display: "block",
                  width: "100%",
                  height: { xs: 220, sm: 280 },
                  objectFit: "contain",
                  bgcolor: "#fff",
                  px: 2,
                  py: 1,
                }}
              />
            ) : null}
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
                gap: 3,
                p: { xs: 2.5, md: 3.5 },
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              {[
                {
                  label: t("pickup"),
                  location: saved.pickupLocation.name,
                  at: saved.pickupAt,
                },
                {
                  label: t("return"),
                  location: saved.returnLocation.name,
                  at: saved.returnAt,
                },
              ].map((stop) => (
                <Box key={stop.label}>
                  <Typography variant="overline" color="text.secondary">
                    {stop.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 650 }}>
                    {stop.location}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {date(stop.at)} · {time(stop.at)}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {!editable ? <Alert severity="info">{t("notEditable")}</Alert> : null}
          <Paper
            component="section"
            variant="outlined"
            aria-labelledby="mileage-title"
            sx={panel}
          >
            <Typography variant="overline" color="primary">
              {t("stepMileage")}
            </Typography>
            <Typography
              component="h2"
              variant="h5"
              id="mileage-title"
              sx={{ fontWeight: 650 }}
            >
              {t("mileageTitle")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 2.5 }}
            >
              {t("mileageDescription")}
            </Typography>
            <RadioGroup
              name="mileagePackageId"
              value={mileageId}
              onChange={(event) => setMileageId(event.target.value)}
              aria-labelledby="mileage-title"
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(3, minmax(0, 1fr))",
                },
                gap: 1.5,
              }}
            >
              {mileagePackages.map((option) => {
                const selected = String(option.id) === mileageId;
                return (
                  <Box
                    key={option.id}
                    component="label"
                    sx={{
                      border: 1,
                      borderColor: selected ? "primary.main" : "divider",
                      bgcolor: selected ? "action.selected" : "transparent",
                      borderRadius: 2,
                      p: 2,
                      cursor: editable && !pending ? "pointer" : "default",
                      transition: "border-color 150ms",
                    }}
                  >
                    <Stack
                      direction="row"
                      sx={{
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {option.name}
                      </Typography>
                      <Radio
                        value={String(option.id)}
                        disabled={!editable || pending}
                        size="small"
                        sx={{ p: 0.5 }}
                      />
                    </Stack>
                    <Typography sx={{ fontWeight: 700, mt: 1.5 }}>
                      {option.includedKmPerDay === null
                        ? t("unlimited")
                        : t("kmPerDay", { km: option.includedKmPerDay })}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.includedKmPerDay === null
                        ? t("noMileageLimit")
                        : t("kmTotal", {
                            km: option.includedKmPerDay * saved.rentalDays,
                          })}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 650, mt: 2 }}>
                      {option.pricePerDay === 0
                        ? t("included")
                        : t("pricePerDay", {
                            price: money(option.pricePerDay),
                          })}
                    </Typography>
                  </Box>
                );
              })}
            </RadioGroup>
          </Paper>

          <Paper
            component="section"
            variant="outlined"
            aria-labelledby="extras-title"
            sx={panel}
          >
            <Typography variant="overline" color="primary">
              {t("stepExtras")}
            </Typography>
            <Typography
              component="h2"
              variant="h5"
              id="extras-title"
              sx={{ fontWeight: 650 }}
            >
              {t("extrasTitle")}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1, mb: 2.5 }}
            >
              {t("extrasDescription")}
            </Typography>
            <Stack spacing={1.5}>
              {extras.map((extra) => (
                <FormControlLabel
                  key={extra.id}
                  sx={{
                    m: 0,
                    p: 1.5,
                    border: 1,
                    borderRadius: 2,
                    borderColor: extraIds.includes(extra.id)
                      ? "primary.main"
                      : "divider",
                    alignItems: "flex-start",
                    "& .MuiFormControlLabel-label": { width: "100%" },
                  }}
                  control={
                    <Checkbox
                      name="extraIds"
                      value={extra.id}
                      checked={extraIds.includes(extra.id)}
                      disabled={!editable || pending}
                      onChange={(event) =>
                        setExtraIds(
                          event.target.checked
                            ? [...extraIds, extra.id]
                            : extraIds.filter((id) => id !== extra.id),
                        )
                      }
                    />
                  }
                  label={
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      sx={{
                        gap: 1,
                        justifyContent: "space-between",
                        py: 0.8,
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontWeight: 650 }}>
                          {extra.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {extra.description}
                        </Typography>
                      </Box>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 650, whiteSpace: "nowrap" }}
                      >
                        {t("pricePerDay", { price: money(extra.pricePerDay) })}
                      </Typography>
                    </Stack>
                  }
                />
              ))}
              {extras.length === 0 ? (
                <Typography color="text.secondary">{t("noExtras")}</Typography>
              ) : null}
            </Stack>
          </Paper>
        </Stack>

        <Paper
          component="aside"
          variant="outlined"
          aria-labelledby="summary-title"
          sx={{
            ...panel,
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, mb: 3 }}
          >
            {t("rentalDays", { days: saved.rentalDays })} · {saved.car.brand}{" "}
            {saved.car.model}
          </Typography>
          <Stack spacing={2}>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
              <Box>
                <Typography variant="body2">{t("vehicleRental")}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {saved.rentalDays} × {money(saved.dailyRate)}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>
                {money(basePrice)}
              </Typography>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", gap: 2 }}
            >
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
                  {money(extra.pricePerDay * saved.rentalDays)}
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
              disabled={pending || !changed}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 650,
              }}
            >
              {pending ? t("saving") : t("saveOptions")}
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
      </Box>
    </>
  );
}
