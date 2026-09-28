"use client";

import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import { contentPadding } from "@/app/theme";
import ImageRender from "@/app/utils/imageRender";
import type { ReservationDTO } from "@/types/reservation";

type ReservationVehicleCardProps = {
  reservation: ReservationDTO;
};

export default function ReservationVehicleCard({
  reservation,
}: ReservationVehicleCardProps) {
  const t = useTranslations("Reservation");
  const format = useFormatter();

  const formatDateTime = (value: string) =>
    value
      ? format.dateTime(new Date(value), {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ px: contentPadding, pt: 3, paddingBottom: "50px" }}>
        <Typography variant="overline" color="text.secondary">
          {reservation.car.carType}
        </Typography>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 650 }}>
          {reservation.car.carCategory}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}
        >
          <LocationOnOutlined fontSize="small" />
          <Typography variant="body2">
            {reservation.pickupLocation.name} ·{" "}
            {t("minimumAge", { age: reservation.car.minimumAge })}
          </Typography>
        </Stack>
      </Box>

      {reservation.car.imageUrl ? (
        <Box sx={{ height: 300, margin: "auto" }}>
          <ImageRender
            key={reservation.car.imageUrl}
            src={reservation.car.imageUrl}
            alt={reservation.car.carCategory}
            width="100%"
            height={300}
            loading="eager"
            objectFit="contain"
            skeleton={false}
          />
        </Box>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 3,
          p: contentPadding,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t("pickup")}
          </Typography>
          <Typography sx={{ fontWeight: 650 }}>
            {reservation.pickupLocation.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {formatDateTime(reservation.pickupAt)}
          </Typography>
        </Box>
        <Box>
          <Typography variant="overline" color="text.secondary">
            {t("return")}
          </Typography>
          <Typography sx={{ fontWeight: 650 }}>
            {reservation.returnLocation.name}
          </Typography>
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {formatDateTime(reservation.returnAt)}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}
