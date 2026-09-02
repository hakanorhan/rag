"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import Form from "next/form";
import { useLocale } from "next-intl";
import { useState } from "react";
import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";
import { getPathname } from "@/i18n/navigation";

const TIME_ZONE = "Europe/Berlin";

type CarSearchLabels = {
  button: string;
  freeTextHelper?: string;
  freeTextLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  locationLabel: string;
  locationPlaceholder: string;
  pickupDateLabel: string;
  placeholder: string;
  returnDateLabel: string;
};

type InitialCarSearchValues = {
  location?: string;
  pickupAt?: string;
  query?: string;
  returnAt?: string;
};

type CarSearchFormProps = {
  initialValues?: InitialCarSearchValues;
  labels: CarSearchLabels;
};

export default function CarSearchForm({
  initialValues = {},
  labels,
}: CarSearchFormProps) {
  const {
    button,
    freeTextHelper: helperText,
    freeTextLabel: label,
    incompleteDateRange,
    invalidDateRange,
    locationLabel,
    locationPlaceholder,
    pickupDateLabel,
    placeholder,
    returnDateLabel,
  } = labels;

  const {
    location: initialLocation = "",
    pickupAt: initialPickupAt = "",
    query: initialQuery = "",
    returnAt: initialReturnAt = "",
  } = initialValues;

  const locale = useLocale();

  const [location, setLocation] = useState(initialLocation);
  const [pickupAt, setPickupAt] = useState<Dayjs | null>(
    initialPickupAt ? dayjs(initialPickupAt).tz(TIME_ZONE) : null,
  );
  const [returnAt, setReturnAt] = useState<Dayjs | null>(
    initialReturnAt ? dayjs(initialReturnAt).tz(TIME_ZONE) : null,
  );
  const [query, setQuery] = useState(initialQuery);

  const [pickupAtHasError, setPickupAtHasError] = useState(false);
  const [returnAtHasError, setReturnAtHasError] = useState(false);

  const hasPickupAt = pickupAt !== null;
  const hasReturnAt = returnAt !== null;
  const hasDateRange = hasPickupAt && hasReturnAt;
  const hasIncompleteDateRange = hasPickupAt !== hasReturnAt;

  const hasInvalidDateRange =
    pickupAt !== null && returnAt !== null && !pickupAt.isBefore(returnAt);

  const dateErrorMessage = hasIncompleteDateRange
    ? incompleteDateRange
    : pickupAtHasError || returnAtHasError || hasInvalidDateRange
      ? invalidDateRange
      : undefined;

  const canSubmitCriteria =
    Boolean(location.trim() || hasDateRange) && !dateErrorMessage;
  const canSubmitFreeText = Boolean(query.trim());

  const action = getPathname({ href: "/cars", locale });

  return (
    <DateLocalizationProvider>
      <Form
        action={action}
        onSubmit={(event) => {
          if (!canSubmitCriteria) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="searchType" value="criteria" />

        <input
          type="hidden"
          name="pickupAt"
          value={pickupAt?.toISOString() ?? ""}
          disabled={!pickupAt}
        />

        <input
          type="hidden"
          name="returnAt"
          value={returnAt?.toISOString() ?? ""}
          disabled={!returnAt}
        />

        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label={locationLabel}
              name="location"
              placeholder={locationPlaceholder}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              autoComplete="address-level2"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOnRoundedIcon color="primary" />
                    </InputAdornment>
                  ),
                },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 8 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  disablePast
                  timezone={TIME_ZONE}
                  label={pickupDateLabel}
                  value={pickupAt}
                  onChange={setPickupAt}
                  onError={(error) => setPickupAtHasError(error !== null)}
                  slotProps={{
                    textField: {
                      error:
                        pickupAtHasError ||
                        hasIncompleteDateRange ||
                        hasInvalidDateRange,
                      fullWidth: true,
                      required: hasReturnAt,
                    },
                  }}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <DateTimePicker
                  disablePast
                  timezone={TIME_ZONE}
                  label={returnDateLabel}
                  minDateTime={pickupAt ?? undefined}
                  value={returnAt}
                  onChange={setReturnAt}
                  onError={(error) => setReturnAtHasError(error !== null)}
                  slotProps={{
                    textField: {
                      error:
                        returnAtHasError ||
                        hasIncompleteDateRange ||
                        hasInvalidDateRange,
                      fullWidth: true,
                      helperText: dateErrorMessage,
                      required: hasPickupAt,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Stack direction="row" sx={{ justifyContent: "flex-end", mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchRoundedIcon />}
            disabled={!canSubmitCriteria}
            sx={{
              minWidth: { sm: 160 },
              minHeight: 56,
              boxShadow: "none",
            }}
          >
            {button}
          </Button>
        </Stack>
      </Form>

      <Divider sx={{ my: 1.5 }} />

      <Form
        action={action}
        onSubmit={(event) => {
          if (!canSubmitFreeText) {
            event.preventDefault();
          }
        }}
      >
        <input type="hidden" name="searchType" value="freeText" />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ alignItems: { sm: "flex-start" } }}
        >
          <TextField
            fullWidth
            label={label}
            name="query"
            placeholder={placeholder}
            helperText={helperText}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <AutoAwesomeRoundedIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            startIcon={<SearchRoundedIcon />}
            disabled={!canSubmitFreeText}
            sx={{
              minWidth: { sm: 160 },
              minHeight: 56,
              boxShadow: "none",
            }}
          >
            {button}
          </Button>
        </Stack>
      </Form>
    </DateLocalizationProvider>
  );
}
