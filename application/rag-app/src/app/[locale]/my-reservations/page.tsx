import PageShell from "@/components/layout/PageShell";
import MyReservationsPageContent from "@/components/pages/MyReservationsPageContent";

export default function MyReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <PageShell>
      <MyReservationsPageContent params={params} />
    </PageShell>
  );
}
