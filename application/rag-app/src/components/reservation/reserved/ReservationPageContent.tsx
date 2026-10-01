import Alert from "@mui/material/Alert";
import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { getPathname } from "@/i18n/navigation";
import { getProblemMessage } from "@/lib/problemDetails";
import { getReservationPage } from "@/lib/services/car";
import { reservationIdSchema } from "@/lib/validation/reservation";
import ReservationOptionsForm, {
  ReservationOptionsFormLoading,
} from "../ReservationOptionsForm";
import ReservationPageLayout from "../ReservationPageLayout";

type ReservationPageProps = {
  params: Promise<{ locale: string; reservationId: string }>;
};

async function ReservationContent({ params }: ReservationPageProps) {
  const { reservationId, locale } = await params;
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
    />
  );
}

export default function ReservationPageContent(props: ReservationPageProps) {
  return (
    <ReservationPageLayout fallback={<ReservationOptionsFormLoading />}>
      <ReservationContent params={props.params} />
    </ReservationPageLayout>
  );
}
