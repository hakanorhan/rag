"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Form from "next/form";
import { useLocale } from "next-intl";
import {
  type ComponentType,
  useMemo,
  useState,
} from "react";

import { getPathname } from "@/i18n/navigation";

const TIME_ZONE = "Europe/Berlin";

type PickerTarget = "pickup" | "return";

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

export type CarSearchDateTimeFieldsProps = {
  pickupAt: string;
  returnAt: string;
  pickupDateLabel: string;
  returnDateLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  openPicker: PickerTarget | null;
  onOpenPickerChange: (target: PickerTarget | null) => void;
  onPickupAtChange: (value: string) => void;
  onReturnAtChange: (value: string) => void;
  onPickupErrorChange: (hasError: boolean) => void;
  onReturnErrorChange: (hasError: boolean) => void;
};

type DateTimeFieldsComponent = ComponentType<CarSearchDateTimeFieldsProps>;

let dateTimeFieldsPromise:
    | Promise<typeof import("./CarSearchDateTimeFields")>
    | undefined;

function loadDateTimeFields() {
  dateTimeFieldsPromise ??= import("./CarSearchDateTimeFields");

  return dateTimeFieldsPromise;
}

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
  const [pickupAt, setPickupAt] = useState(initialPickupAt);
  const [returnAt, setReturnAt] = useState(initialReturnAt);
  const [query, setQuery] = useState(initialQuery);

  const [pickupAtHasError, setPickupAtHasError] = useState(false);
  const [returnAtHasError, setReturnAtHasError] = useState(false);

  const [DateTimeFields, setDateTimeFields] =
      useState<DateTimeFieldsComponent | null>(null);

  const [openPicker, setOpenPicker] =
      useState<PickerTarget | null>(null);

  const dateTimeFormatter = useMemo(
      () =>
          new Intl.DateTimeFormat(locale, {
            dateStyle: "short",
            timeStyle: "short",
            timeZone: TIME_ZONE,
          }),
      [locale],
  );

  const formatDateTime = (value: string) => {
    if (!value) {
      return "";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return dateTimeFormatter.format(date);
  };

  const openDateTimePicker = async (target: PickerTarget) => {
    /*
     * Wichtig:
     * Der Import startet erst durch diesen Klick.
     */
    setOpenPicker(target);

    if (DateTimeFields) {
      return;
    }

    try {
      const module = await loadDateTimeFields();

      setDateTimeFields(() => module.default);
    } catch (error) {
      setOpenPicker(null);
      console.error(
          "DateTimePicker konnte nicht geladen werden.",
          error,
      );
    }
  };

  const hasPickupAt = Boolean(pickupAt);
  const hasReturnAt = Boolean(returnAt);
  const hasDateRange = hasPickupAt && hasReturnAt;
  const hasIncompleteDateRange = hasPickupAt !== hasReturnAt;

  const pickupTimestamp = pickupAt
      ? Date.parse(pickupAt)
      : Number.NaN;

  const returnTimestamp = returnAt
      ? Date.parse(returnAt)
      : Number.NaN;

  const hasInvalidDateRange =
      hasDateRange &&
      (!Number.isFinite(pickupTimestamp) ||
          !Number.isFinite(returnTimestamp) ||
          pickupTimestamp >= returnTimestamp);

  const dateErrorMessage = hasIncompleteDateRange
      ? incompleteDateRange
      : pickupAtHasError ||
      returnAtHasError ||
      hasInvalidDateRange
          ? invalidDateRange
          : undefined;

  const canSubmitCriteria =
      Boolean(location.trim() || hasDateRange) &&
      !dateErrorMessage;

  const canSubmitFreeText = Boolean(query.trim());

  const action = getPathname({
    href: "/cars",
    locale,
  });

  return (
      <>
        <Form
            action={action}
            onSubmit={(event) => {
              if (!canSubmitCriteria) {
                event.preventDefault();
              }
            }}
        >
          <input
              type="hidden"
              name="searchType"
              value="criteria"
          />

          <input
              type="hidden"
              name="pickupAt"
              value={pickupAt}
              disabled={!pickupAt}
          />

          <input
              type="hidden"
              name="returnAt"
              value={returnAt}
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
                  onChange={(event) =>
                      setLocation(event.target.value)
                  }
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
              {DateTimeFields ? (
                  <DateTimeFields
                      pickupAt={pickupAt}
                      returnAt={returnAt}
                      pickupDateLabel={pickupDateLabel}
                      returnDateLabel={returnDateLabel}
                      incompleteDateRange={incompleteDateRange}
                      invalidDateRange={invalidDateRange}
                      openPicker={openPicker}
                      onOpenPickerChange={setOpenPicker}
                      onPickupAtChange={setPickupAt}
                      onReturnAtChange={setReturnAt}
                      onPickupErrorChange={setPickupAtHasError}
                      onReturnErrorChange={setReturnAtHasError}
                  />
              ) : (
                  <Grid container spacing={1}>
                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                          fullWidth
                          label={pickupDateLabel}
                          value={formatDateTime(pickupAt)}
                          error={
                              pickupAtHasError ||
                              hasIncompleteDateRange ||
                              hasInvalidDateRange
                          }
                          required={hasReturnAt}
                          slotProps={{
                            input: {
                              readOnly: true,
                              endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label={pickupDateLabel}
                                        onClick={() => {
                                          void openDateTimePicker(
                                              "pickup",
                                          );
                                        }}
                                    >
                                      <CalendarMonthRoundedIcon />
                                    </IconButton>
                                  </InputAdornment>
                              ),
                            },
                          }}
                      />
                    </Grid>

                    <Grid size={{ xs: 12, sm: 6 }}>
                      <TextField
                          fullWidth
                          label={returnDateLabel}
                          value={formatDateTime(returnAt)}
                          error={
                              returnAtHasError ||
                              hasIncompleteDateRange ||
                              hasInvalidDateRange
                          }
                          helperText={dateErrorMessage}
                          required={hasPickupAt}
                          slotProps={{
                            input: {
                              readOnly: true,
                              endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label={returnDateLabel}
                                        onClick={() => {
                                          void openDateTimePicker(
                                              "return",
                                          );
                                        }}
                                    >
                                      <CalendarMonthRoundedIcon />
                                    </IconButton>
                                  </InputAdornment>
                              ),
                            },
                          }}
                      />
                    </Grid>
                  </Grid>
              )}
            </Grid>
          </Grid>

          <Stack
              direction="row"
              sx={{
                justifyContent: "flex-end",
                mt: 1,
              }}
          >
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
          <input
              type="hidden"
              name="searchType"
              value="freeText"
          />

          <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                alignItems: {
                  sm: "flex-start",
                },
              }}
          >
            <TextField
                fullWidth
                label={label}
                name="query"
                placeholder={placeholder}
                helperText={helperText}
                value={query}
                onChange={(event) =>
                    setQuery(event.target.value)
                }
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
      </>
  );
}