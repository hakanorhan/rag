"use client";

import Grid from "@mui/material/Grid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";
import { isValidDateRange, TIME_ZONE } from "@/lib/dateTime";

import type { CarSearchDateTimeFieldsProps } from "./CarSearchForm";

function parseDateTime(value: string): Dayjs | null {
  return value ? dayjs(value).tz(TIME_ZONE) : null;
}

export default function CarSearchDateTimeFields(
  props: CarSearchDateTimeFieldsProps,
) {
  const {
    pickupAt,
    returnAt,
    pickupDateLabel,
    returnDateLabel,
    incompleteDateRange,
    invalidDateRange,
    openPicker,
    onOpenPickerChange,
    onPickupAtChange,
    onReturnAtChange,
    onPickupErrorChange,
    onReturnErrorChange,
    showRequiredErrors,
  } = props;
  const pickupValue = parseDateTime(pickupAt);
  const returnValue = parseDateTime(returnAt);

  const [pickupHasError, setPickupHasError] = useState(false);

  const [returnHasError, setReturnHasError] = useState(false);

  const hasPickupAt = pickupValue !== null;
  const hasReturnAt = returnValue !== null;

  const hasIncompleteDateRange = hasPickupAt !== hasReturnAt;
  const showMissingDateRangeError =
    showRequiredErrors && (!hasPickupAt || !hasReturnAt);
  const hasInvalidDateRange =
    pickupValue !== null &&
    returnValue !== null &&
    pickupValue.isValid() &&
    returnValue.isValid() &&
    !isValidDateRange(pickupValue.toISOString(), returnValue.toISOString());

  const dateErrorMessage =
    hasIncompleteDateRange || showMissingDateRangeError
      ? incompleteDateRange
      : pickupHasError || returnHasError || hasInvalidDateRange
        ? invalidDateRange
        : undefined;

  const handlePickupChange = (value: Dayjs | null) => {
    if (value === null) {
      onPickupAtChange("");
      return;
    }

    if (value.isValid()) {
      onPickupAtChange(value.toISOString());
    }
  };

  const handleReturnChange = (value: Dayjs | null) => {
    if (value === null) {
      onReturnAtChange("");
      return;
    }

    if (value.isValid()) {
      onReturnAtChange(value.toISOString());
    }
  };

  return (
    <DateLocalizationProvider>
      <Grid container spacing={1}>
        <Grid size={{ xs: 6 }}>
          <DateTimePicker
            open={openPicker === "pickup"}
            onOpen={() => onOpenPickerChange("pickup")}
            onClose={() => onOpenPickerChange(null)}
            disablePast
            timezone={TIME_ZONE}
            label={pickupDateLabel}
            value={pickupValue}
            onChange={handlePickupChange}
            onError={(error) => {
              const hasError = error !== null;

              setPickupHasError(hasError);
              onPickupErrorChange(hasError);
            }}
            slotProps={{
              openPickerIcon: { sx: { color: "text.primary" } },
              textField: {
                error:
                  pickupHasError ||
                  hasIncompleteDateRange ||
                  showMissingDateRangeError ||
                  hasInvalidDateRange,
                fullWidth: true,
                required: true,
                sx: {
                  "& .MuiPickersInputBase-root": {
                    backgroundColor: "background.paper",
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                },
              },
            }}
          />
        </Grid>

        <Grid size={{ xs: 6 }}>
          <DateTimePicker
            open={openPicker === "return"}
            onOpen={() => onOpenPickerChange("return")}
            onClose={() => onOpenPickerChange(null)}
            disablePast
            timezone={TIME_ZONE}
            label={returnDateLabel}
            minDateTime={pickupValue ?? undefined}
            value={returnValue}
            onChange={handleReturnChange}
            onError={(error) => {
              const hasError = error !== null;

              setReturnHasError(hasError);
              onReturnErrorChange(hasError);
            }}
            slotProps={{
              openPickerIcon: { sx: { color: "text.primary" } },
              textField: {
                error:
                  returnHasError ||
                  hasIncompleteDateRange ||
                  showMissingDateRangeError ||
                  hasInvalidDateRange,
                fullWidth: true,
                helperText: dateErrorMessage,
                required: true,
                sx: {
                  "& .MuiPickersInputBase-root": {
                    backgroundColor: "background.paper",
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </DateLocalizationProvider>
  );
}
