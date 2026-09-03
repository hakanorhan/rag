"use client";

import Grid from "@mui/material/Grid";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import dayjs, { type Dayjs } from "dayjs";
import { useState } from "react";

import DateLocalizationProvider from "@/components/providers/DateLocalizationProvider";

import type { CarSearchDateTimeFieldsProps } from "./CarSearchForm";

const TIME_ZONE = "Europe/Berlin";

function parseDateTime(value: string): Dayjs | null {
    return value
        ? dayjs(value).tz(TIME_ZONE)
        : null;
}

export default function CarSearchDateTimeFields({
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
                                                }: CarSearchDateTimeFieldsProps) {
    const [pickupValue, setPickupValue] =
        useState<Dayjs | null>(() =>
            parseDateTime(pickupAt),
        );

    const [returnValue, setReturnValue] =
        useState<Dayjs | null>(() =>
            parseDateTime(returnAt),
        );

    const [pickupHasError, setPickupHasError] =
        useState(false);

    const [returnHasError, setReturnHasError] =
        useState(false);

    const hasPickupAt = pickupValue !== null;
    const hasReturnAt = returnValue !== null;

    const hasIncompleteDateRange =
        hasPickupAt !== hasReturnAt;

    const hasInvalidDateRange =
        pickupValue !== null &&
        returnValue !== null &&
        pickupValue.isValid() &&
        returnValue.isValid() &&
        !pickupValue.isBefore(returnValue);

    const dateErrorMessage = hasIncompleteDateRange
        ? incompleteDateRange
        : pickupHasError ||
        returnHasError ||
        hasInvalidDateRange
            ? invalidDateRange
            : undefined;

    const handlePickupChange = (
        value: Dayjs | null,
    ) => {
        setPickupValue(value);

        if (value === null) {
            onPickupAtChange("");
            return;
        }

        if (value.isValid()) {
            onPickupAtChange(value.toISOString());
        }
    };

    const handleReturnChange = (
        value: Dayjs | null,
    ) => {
        setReturnValue(value);

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
                <Grid size={{ xs: 12, sm: 6 }}>
                    <DateTimePicker
                        open={openPicker === "pickup"}
                        onOpen={() =>
                            onOpenPickerChange("pickup")
                        }
                        onClose={() =>
                            onOpenPickerChange(null)
                        }
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
                            textField: {
                                error:
                                    pickupHasError ||
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
                        open={openPicker === "return"}
                        onOpen={() =>
                            onOpenPickerChange("return")
                        }
                        onClose={() =>
                            onOpenPickerChange(null)
                        }
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
                            textField: {
                                error:
                                    returnHasError ||
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
        </DateLocalizationProvider>
    );
}