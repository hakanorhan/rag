import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getPathname } from "@/i18n/navigation";
import { buildReservationSearchHref } from "@/lib/carSearch";
import { requirePageAccess } from "@/lib/pageAuth";
import { getReservationPage } from "@/lib/reservations";
import { reservationIdSchema } from "@/lib/validation/reservation";
import ReservationForm from "../ReservationForm";

type ReservationPageProps = {
  params: Promise<{ locale: string; reservationId: string }>;
};

async function ReservationContent({
  reservationId,
  locale,
}: {
  reservationId: string;
  locale: string;
}) {
  const validatedReservationId = reservationIdSchema.safeParse(reservationId);
  if (!validatedReservationId.success) notFound();

  const returnTo = getPathname({
    locale,
    href: {
      pathname: "/reservation-car/[reservationId]",
      params: { reservationId: String(validatedReservationId.data) },
    },
  });
  const { accessToken, loginUrl } = await requirePageAccess({ returnTo });
  const [t, result] = await Promise.all([
    getTranslations("Reservation"),
    getReservationPage({
      reservationId: validatedReservationId.data,
      accessToken,
    }).catch(() => ({ status: "error" as const })),
  ]);

  if (result.status === "unauthorized") redirect(loginUrl);
  if (result.status === "not-found") notFound();
  if (result.status !== "success") {
    return <Alert severity="error">{t("requestError")}</Alert>;
  }

  return (
    <ReservationForm
      mode="reserved"
      reservation={result.reservation}
      options={result.options}
      searchHref={buildReservationSearchHref(result.reservation)}
    />
  );
}

export default async function ReservationPageContent(
  props: ReservationPageProps,
) {
  const params = await props.params;

  return (
    <>
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
    </>
  );
}
