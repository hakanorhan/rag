import PageShell from "@/components/layout/PageShell";
import CarsPageContent from "@/components/pages/CarsPageContent";

export default function CarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <PageShell>
      <CarsPageContent searchParams={searchParams} />
    </PageShell>
  );
}
