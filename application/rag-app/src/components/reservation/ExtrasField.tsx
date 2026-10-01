"use client";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import type { ExtraOption } from "@/types/reservation";

type ExtrasFieldProps = {
  disabled: boolean;
  extras: ExtraOption[];
  selectedIds: number[];
  onToggle: (extraId: number, selected: boolean) => void;
  loading?: boolean;
};

export default function ExtrasField({
  disabled,
  extras,
  selectedIds,
  onToggle,
  loading = false,
}: ExtrasFieldProps) {
  const t = useTranslations("Reservation");
  const format = useFormatter();
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="extras-title"
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
        {loading
          ? [0, 1].map((item) => (
              <Box
                key={item}
                sx={{
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.5,
                }}
              >
                <Skeleton width="40%" height={28} />
                <Skeleton width="75%" />
              </Box>
            ))
          : null}
        {extras.map((extra) => {
          const selected = selectedIds.includes(extra.id);
          return (
            <FormControlLabel
              key={extra.id}
              sx={{
                m: 0,
                p: 1.5,
                border: 1,
                borderRadius: 2,
                borderColor: selected ? "primary.main" : "divider",
                alignItems: "flex-start",
                "& .MuiFormControlLabel-label": { width: "100%" },
              }}
              control={
                <Checkbox
                  name="extraIds"
                  value={extra.id}
                  checked={selected}
                  disabled={disabled}
                  onChange={(event) => onToggle(extra.id, event.target.checked)}
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
          );
        })}
        {!loading && extras.length === 0 ? (
          <Typography color="text.secondary">{t("noExtras")}</Typography>
        ) : null}
      </Stack>
    </Paper>
  );
}
