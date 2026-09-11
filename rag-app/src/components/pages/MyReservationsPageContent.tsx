import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { getPathname, Link } from "@/i18n/navigation";
import { requirePageAccess } from "@/lib/pageAuth";
import { getReservations } from "@/lib/reservations";

export default async function MyReservationsPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const returnTo = getPathname({ locale, href: "/my-reservations" });
  const { accessToken, loginUrl } = await requirePageAccess({ returnTo });

  const [t, reservationT, format, result] = await Promise.all([
    getTranslations("MyReservations"),
    getTranslations("Reservation"),
    getFormatter(),
    getReservations(accessToken).catch(() => ({ status: "error" as const })),
  ]);
  if (result.status === "unauthorized") redirect(loginUrl);

  return (
    <>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        <Typography component="h1" variant="h3" sx={{ mb: 1 }}>
          {t("title")}  
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {t("description")}
        </Typography>

        {result.status === "forbidden" ? (
          <Alert severity="error">{t("forbidden")}</Alert>
        ) : null}
        {result.status === "error" ? (
          <Alert severity="error">{t("requestError")}</Alert>
        ) : null}
        {result.status === "success" && result.reservations.length === 0 ? (
          <Typography color="text.secondary">{t("empty")}</Typography>
        ) : null}

        {result.status === "success" && result.reservations.length > 0 ? (
          <Stack spacing={3}>
            {result.reservations.map((reservation) => (
              <Card
                key={reservation.reservationId}
                variant="outlined"
                sx={{ borderRadius: 3 }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={3}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {t("reference", { id: reservation.reservationId })}
                      </Typography>
                      <Typography
                        component="h2"
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {reservation.car.carCategory}
                      </Typography>
                      <Chip
                        size="small"
                        label={reservationT(`status.${reservation.status}`)}
                        sx={{ mt: 1.5 }}
                      />
                    </Box>
                    <Box sx={{ minWidth: { sm: 330 } }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("pickup")}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }}>
                        {reservation.pickupLocation.name} ·{" "}
                        {format.dateTime(new Date(reservation.pickupAt), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {t("return")}
                      </Typography>
                      <Typography>
                        {reservation.returnLocation.name} ·{" "}
                        {format.dateTime(new Date(reservation.returnAt), {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </Typography>
                    </Box>
                    <Stack sx={{ alignItems: { xs: "start", sm: "end" } }}>
                      <Typography variant="body2" color="text.secondary">
                        {t("total")}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {format.number(reservation.totalPrice, {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </Typography>
                      <Link
                        href={{
                          pathname: "/reservation-car/[reservationId]",
                          params: {
                            reservationId: String(reservation.reservationId),
                          },
                        }}
                      >
                        <Button component="span" sx={{ mt: 1.5 }}>
                          {t("details")}
                        </Button>
                      </Link>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Stack>
        ) : null}
      </Container>
    </>
  );
}
