import PageShell from "@/components/layout/PageShell";
import ReservationPageContent from "@/components/reservation/reserved/ReservationPageContent";

export default function ReservationPage({
  params,
}: {
  params: Promise<{ locale: string; reservationId: string }>;
}) {
  return (
    <PageShell>
      <ReservationPageContent params={params} />
    </PageShell>
  );
}
