import PageShell from "@/components/layout/PageShell";
import RagEditPageContent from "@/components/pages/RagEditPageContent";

export default function RagEditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <PageShell>
      <RagEditPageContent params={params} />
    </PageShell>
  );
}
