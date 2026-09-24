"use client";

import LocationOnOutlined from "@mui/icons-material/LocationOnOutlined";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useFormatter, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
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
  const [visibleCarId, setVisibleCarId] = useState<number | null>(null);
  const showVehicleDetails = visibleCarId === reservation.car.id;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setVisibleCarId(reservation.car.id);
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [reservation.car.id]);

  const formatDateTime = (value: string) =>
    value
      ? format.dateTime(new Date(value), {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "-";

  return (
    <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
      <Box sx={{ px: { xs: 2.5, md: 3.5 }, pt: 3, paddingBottom:'50px' }}>
        <Typography variant="overline" color="text.secondary">
          {showVehicleDetails ? (
            reservation.car.carType
          ) : (
            <Skeleton width={100} />
          )}
        </Typography>
        <Typography variant="h4" component="h2" sx={{ fontWeight: 650 }}>
          {showVehicleDetails ? (
            reservation.car.carCategory
          ) : (
            <Skeleton width="55%" />
          )}
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "center", mt: 1, color: "text.secondary" }}
        >
          {showVehicleDetails ? (
            <LocationOnOutlined fontSize="small" />
          ) : (
            <Skeleton variant="circular" width={20} height={20} />
          )}
          <Typography variant="body2">
            {showVehicleDetails ? (
              <>
                {reservation.pickupLocation.name} ·{" "}
                {t("minimumAge", { age: reservation.car.minimumAge })}
              </>
            ) : (
              <Skeleton width={220} />
            )}
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
            skeletonDurationMs={1200}
          />
        </Box>
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
