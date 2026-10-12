import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import ButtonComponent from "@/components/ButtonComponent";
import PaginatedItems from "@/components/PaginatedItems";
import { getPathname, Link } from "@/i18n/navigation";
import { getProblemMessage } from "@/lib/problemDetails";
import { redirectIfAuthenticationRequired } from "@/lib/redirectIfAuthenticationRequired";
import { getReservations } from "@/lib/services/car";
import type { ReservationDTO } from "@/types/reservation";

export default async function MyReservationsPageContent({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const { locale } = await params;
  const returnTo = getPathname({ locale, href: "/my-reservations" });

  const [t, reservationT, format] = await Promise.all([
    getTranslations("MyReservations"),
    getTranslations("Reservation"),
    getFormatter(),
  ]);

  function reservationCards(
    reservations: (ReservationDTO & { paid: boolean })[],
  ) {
    return (
      <Stack spacing={3}>
        {reservations.map((reservation) => (
          <Card
            key={reservation.reservationId}
            variant="outlined"
            sx={{ borderRadius: 3 }}
          >
            <CardContent>
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
                  {reservation.paid ? (
                    <Chip
                      size="small"
                      color="success"
                      label={t("paid")}
                      sx={{ mt: 1.5, ml: 1 }}
                    />
                  ) : null}
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
                    <ButtonComponent
                      component="span"
                      size="medium"
                      variant="text"
                      sx={{ mt: 1.5 }}
                    >
                      {t("details")}
                    </ButtonComponent>
                  </Link>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  function reservationCardsSkeleton() {
    return (
      <Stack spacing={3}>
        {[0, 1].map((item) => (
          <Card key={item} variant="outlined" sx={{ borderRadius: 3 }}>
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={3}
                sx={{ justifyContent: "space-between" }}
              >
                <Box>
                  <Skeleton width={110} />
                  <Typography component="h2" variant="h5">
                    <Skeleton width={180} />
                  </Typography>
                  <Skeleton
                    variant="rounded"
                    width={90}
                    height={24}
                    sx={{ mt: 1.5 }}
                  />
                </Box>
                <Box sx={{ minWidth: { sm: 330 } }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("pickup")}
                  </Typography>
                  <Typography sx={{ mb: 1.5 }}>
                    <Skeleton width="80%" />
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t("return")}
                  </Typography>
                  <Typography>
                    <Skeleton width="80%" />
                  </Typography>
                </Box>
                <Stack sx={{ alignItems: { xs: "start", sm: "end" } }}>
                  <Typography variant="body2" color="text.secondary">
                    {t("total")}
                  </Typography>
                  <Typography variant="h6">
                    <Skeleton width={100} />
                  </Typography>
                  <ButtonComponent
                    disabled
                    size="medium"
                    variant="text"
                    sx={{ mt: 1.5 }}
                  >
                    {t("details")}
                  </ButtonComponent>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  async function Reservations() {
    const requestedPage = Number((await searchParams).page ?? 1);
    const page =
      Number.isInteger(requestedPage) && requestedPage > 0
        ? requestedPage - 1
        : 0;
    const [problemT, result] = await Promise.all([
      getTranslations("Problems"),
      getReservations(page),
    ]);
    redirectIfAuthenticationRequired(result, returnTo);
    if (result.status === "error") {
      return (
        <Alert severity="error">
          {getProblemMessage(result.problem, problemT)}
        </Alert>
      );
    }
    if (result.totalPages > 0 && page >= result.totalPages) {
      redirect(`${returnTo}?page=${result.totalPages}`);
    }
    if (result.reservations.length === 0) {
      return <Typography color="text.secondary">{t("empty")}</Typography>;
    }
    return (
      <>
        {reservationCards(result.reservations)}
        <PaginatedItems
          currentPage={page}
          pageCount={result.totalPages}
          previousLabel={t("previousPage")}
          nextLabel={t("nextPage")}
          navigationLabel={t("pages")}
        />
      </>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h1">{t("title")}</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {t("description")}
      </Typography>
      <Suspense fallback={reservationCardsSkeleton()}>
        <Reservations />
      </Suspense>
    </Container>
  );
}
