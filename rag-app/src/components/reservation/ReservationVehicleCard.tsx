"use client";

import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
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
    format.dateTime(new Date(value), {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ px: { xs: 2.5, md: 3.5 }, pt: 3 }}>
        <Typography variant="overline" color="text.secondary">
          {reservation.car.carType}
        </Typography>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 650 }}>
          {reservation.car.brand} {reservation.car.model}
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
        <ImageWithSkeleton
          src={reservation.car.imageUrl}
          alt={`${reservation.car.brand} ${reservation.car.model}`}
          sx={{
            width: "100%",
            height: { xs: 220, sm: 280 },
            bgcolor: "#fff",
          }}
          sizes="(max-width: 900px) 100vw, 760px"
          loading="eager"
          style={{
            objectFit: "contain",
            padding: "8px 16px",
            backgroundColor: "#fff",
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
