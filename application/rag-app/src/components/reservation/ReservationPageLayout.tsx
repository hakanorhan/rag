import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { type ReactNode, Suspense } from "react";

type Props = {
  children: ReactNode;
  fallback: ReactNode;
};

export default async function ReservationPageLayout({
  children,
  fallback,
}: Props) {
  const t = await getTranslations("Reservation");

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h1">{t("bookingTitle")}</Typography>
        <Typography color="text.secondary">
          {t("bookingDescription")}
        </Typography>
      </Box>
      <Suspense fallback={fallback}>{children}</Suspense>
    </Container>
  );
}
