import PageShell from "@/components/layout/PageShell";
import AiConfigurationPageContent from "@/components/pages/AiConfigurationPageContent";

export default function AiConfigurationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <PageShell>
      <AiConfigurationPageContent params={params} />
    </PageShell>
  );
}
