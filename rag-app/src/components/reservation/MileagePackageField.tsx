"use client";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import type { MileageOption } from "@/types/reservation";

type MileagePackageFieldProps = {
  disabled: boolean;
  mileageId: string;
  options: MileageOption[];
  rentalDays: number;
  onChange: (mileageId: string) => void;
};

export default function MileagePackageField({
  disabled,
  mileageId,
  options,
  rentalDays,
  onChange,
}: MileagePackageFieldProps) {
  const t = useTranslations("Reservation");
  const format = useFormatter();
  const money = (amount: number) =>
    format.number(amount, { style: "currency", currency: "EUR" });

  return (
    <Paper
      component="section"
      variant="outlined"
      aria-labelledby="mileage-title"
      sx={{ p: { xs: 2.5, md: 3.5 }, borderRadius: 3 }}
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
        onChange={(event) => onChange(event.target.value)}
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
        {options.map((option) => {
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
                cursor: disabled ? "default" : "pointer",
                transition: "border-color 150ms",
              }}
            >
              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <Typography variant="body2" color="text.secondary">
                  {option.name}
                </Typography>
                <Radio
                  value={String(option.id)}
                  disabled={disabled}
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
                      km: option.includedKmPerDay * rentalDays,
                    })}
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 650, mt: 2 }}>
                {option.pricePerDay === 0
                  ? t("included")
                  : t("pricePerDay", { price: money(option.pricePerDay) })}
              </Typography>
            </Box>
          );
        })}
      </RadioGroup>
    </Paper>
  );
}
