"use client";

import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Suspense } from "react";
import DateTimeFieldsPicker from "./CarSearchDateTimeFieldsPicker";
import type { CarSearchDateTimeFieldsProps } from "./CarSearchForm.types";

export default function CarSearchDateTimeFields(
  props: CarSearchDateTimeFieldsProps,
) {
  return (
    <Suspense
      fallback={
        <Grid container spacing={1}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label={props.pickupDateLabel}
              value=""
              fullWidth
              required
              slotProps={{
                htmlInput: { readOnly: true },
                input: { sx: { borderRadius: "8px" } },
              }}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label={props.returnDateLabel}
              value=""
              fullWidth
              required
              slotProps={{
                htmlInput: { readOnly: true },
                input: { sx: { borderRadius: "8px" } },
              }}
            />
          </Grid>
        </Grid>
      }
    >
      <DateTimeFieldsPicker {...props} />
    </Suspense>
  );
}
