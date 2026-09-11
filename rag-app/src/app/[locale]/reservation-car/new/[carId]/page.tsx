import PageShell from "@/components/layout/PageShell";
import NewReservationPageContent from "@/components/reservation/new/NewReservationPageContent";

export default function NewReservationPage({
  params,
}: {
  params: Promise<{ locale: string; carId: string }>;
}) {
  return (
    <PageShell>
      <NewReservationPageContent params={params} />
    </PageShell>
  );
}
