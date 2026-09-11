import PageShell from "@/components/layout/PageShell";
import NewReservationPageContent from "@/components/reservation/new/NewReservationPageContent";

export default function NewReservationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; carId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <PageShell>
      <NewReservationPageContent params={params} searchParams={searchParams} />
    </PageShell>
  );
}
