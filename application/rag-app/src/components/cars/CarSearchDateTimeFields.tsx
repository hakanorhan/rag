"use client";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import dynamic from "next/dynamic";
import { useLocale } from "next-intl";
import { useState } from "react";
import { isValidDateRange, TIME_ZONE } from "@/lib/dateTime";
import type { CarSearchDateTimeFieldsProps } from "./CarSearchForm.types";

const DateTimeFieldsPicker = dynamic(
  () => import("./CarSearchDateTimeFieldsPicker"),
  {
    ssr: false,
    loading: () => (
      <Box sx={{ minHeight: 56, display: "flex", alignItems: "center" }}>
        <CircularProgress size={24} />
      </Box>
    ),
  },
);

export default function CarSearchDateTimeFields(
  props: CarSearchDateTimeFieldsProps,
) {
  const locale = useLocale();
  const [activated, setActivated] = useState(false);

  if (activated) return <DateTimeFieldsPicker {...props} />;

  const incomplete = Boolean(props.pickupAt) !== Boolean(props.returnAt);
  const invalid =
    Boolean(props.pickupAt && props.returnAt) &&
    !isValidDateRange(props.pickupAt, props.returnAt);
  const missing =
    props.showRequiredErrors && (!props.pickupAt || !props.returnAt);
  const error = incomplete || invalid || missing;
  const helperText =
    incomplete || missing
      ? props.incompleteDateRange
      : invalid
        ? props.invalidDateRange
        : undefined;

  return (
    <Grid container spacing={1}>
      {(
        [
          {
            target: "pickup",
            label: props.pickupDateLabel,
            value: props.pickupAt,
          },
          {
            target: "return",
            label: props.returnDateLabel,
            value: props.returnAt,
          },
        ] as const
      ).map(({ target, label, value }) => (
        <Grid key={target} size={{ xs: 6 }}>
          <TextField
            label={label}
            value={
              value
                ? new Intl.DateTimeFormat(locale, {
                    dateStyle: "short",
                    timeStyle: "short",
                    timeZone: TIME_ZONE,
                  }).format(new Date(value))
                : ""
            }
            fullWidth
            required
            error={error}
            helperText={target === "return" ? helperText : undefined}
            onFocus={() => {
              props.onOpenPickerChange(target);
              setActivated(true);
            }}
            onClick={() => {
              props.onOpenPickerChange(target);
              setActivated(true);
            }}
            slotProps={{ htmlInput: { readOnly: true } }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
