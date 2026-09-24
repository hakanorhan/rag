import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getPathname } from "@/i18n/navigation";
import { buildReservationSearchHref } from "@/lib/carSearch";
import { getProblemMessage } from "@/lib/problemDetails";
import { getReservationPage } from "@/lib/services/car";
import { reservationIdSchema } from "@/lib/validation/reservation";
import ReservationOptionsForm from "../ReservationOptionsForm";

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
  const [problemT, result] = await Promise.all([
    getTranslations("Problems"),
    getReservationPage({ reservationId: validatedReservationId.data }),
  ]);

  if (
    result.status === "error" &&
    result.problem.code === "AUTHENTICATION_REQUIRED"
  ) {
    redirect(`/api/login?${new URLSearchParams({ returnTo })}`);
  }
  if (
    result.status === "error" &&
    (result.problem.code === "ACCESS_DENIED" ||
      result.problem.code === "RESERVATION_NOT_FOUND")
  ) {
    notFound();
  }
  if (result.status === "error") {
    return (
      <Alert severity="error">
        {getProblemMessage(result.problem, problemT)}
      </Alert>
    );
  }

  return (
    <ReservationOptionsForm
      reservation={result.reservation}
      options={result.options}
      paypalClientId={result.paypalClientId}
      paid={result.paid}
      searchHref={buildReservationSearchHref(result.reservation)}
    />
  );
}

export default async function ReservationPageContent(
  props: ReservationPageProps,
) {
  const params = await props.params;

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ pb: { xs: 3, md: 5 }, minHeight: 640 }}
    >
      <Suspense fallback={null}>
        <ReservationContent {...params} />
      </Suspense>
    </Container>
  );
}
