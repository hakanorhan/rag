import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { notFound, redirect } from "next/navigation";
import { getFormatter, getTranslations } from "next-intl/server";
import { type ComponentProps, Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import RelatedCars from "@/components/reservation/RelatedCars";
import ReservationBooking from "@/components/reservation/ReservationBooking";
import { getPathname, type Link } from "@/i18n/navigation";
import { buildReservationSearchHref } from "@/lib/carSearch";
import { getRelatedCars } from "@/lib/cars";
import { requirePageAccess } from "@/lib/pageAuth";
import { getReservationPage } from "@/lib/reservations";
import { reservationIdSchema } from "@/lib/validation/reservation";
import type { ReservationDTO } from "@/types/reservation";

type ReservationPageProps = {
  params: Promise<{ locale: string; reservationId: string }>;
};

async function RelatedCarsSection(input: {
  reservation: ReservationDTO;
  searchHref: ComponentProps<typeof Link>["href"];
}) {
  const { reservation, searchHref } = input;
  const [t, format, cars] = await Promise.all([
    getTranslations("Reservation"),
    getFormatter(),
    getRelatedCars(reservation).catch(() => null),
  ]);
  return (
    <RelatedCars
      data={{
        searchHref,
        title: t("relatedTitle"),
        description: reservation.searchQuery
          ? t("relatedQuery", { query: reservation.searchQuery })
          : t("relatedCriteria", { location: reservation.pickupLocation.name }),
        allResults: t("allResults"),
        noRelated: t("noRelated"),
        error: t("relatedError"),
        cars:
          cars?.map((car) => ({
            car,
            minimumAge: t("minimumAge", { age: car.minimumAge }),
            price: t("pricePerDay", {
              price: format.number(car.dailyRate, {
                style: "currency",
                currency: "EUR",
              }),
            }),
          })) ?? null,
      }}
    />
  );
}

async function ReservationContent(input: {
  reservationId: string;
  locale: string;
}) {
  const { reservationId, locale } = input;
  const validatedId = reservationIdSchema.safeParse(reservationId);
  if (!validatedId.success) notFound();

  const returnTo = getPathname({
    locale,
    href: {
      pathname: "/reservation-car/[reservationId]",
      params: { reservationId: String(validatedId.data) },
    },
  });
  const { accessToken, loginUrl } = await requirePageAccess({ returnTo });

  const [t, data] = await Promise.all([
    getTranslations("Reservation"),
    getReservationPage({
      reservationId: validatedId.data,
      accessToken,
    }).catch(() => ({ status: "error" as const })),
  ]);
  if (data.status === "unauthorized") redirect(loginUrl);
  if (data.status === "not-found") notFound();
  if (data.status !== "success") {
    return <Alert severity="error">{t("requestError")}</Alert>;
  }
  const { reservation, options } = data;
  const searchHref = buildReservationSearchHref(reservation);

  return (
    <>
      <ReservationBooking
        reservation={reservation}
        options={options}
        searchHref={searchHref}
      />
      <Suspense
        fallback={<Skeleton variant="rounded" height={300} sx={{ mt: 7 }} />}
      >
        <RelatedCarsSection reservation={reservation} searchHref={searchHref} />
      </Suspense>
    </>
  );
}

export default async function ReservationPage(props: ReservationPageProps) {
  const params = await props.params;
  return (
    <PageShell>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 3, md: 5 }, minHeight: 640 }}
      >
        <Suspense
          fallback={
            <Box>
              <Skeleton width="50%" height={80} />
              <Skeleton variant="rounded" height={600} />
            </Box>
          }
        >
          <ReservationContent {...params} />
        </Suspense>
      </Container>
    </PageShell>
  );
}
