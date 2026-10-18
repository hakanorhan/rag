import type { Metadata } from "next";
import { Suspense } from "react";
import { metadata as noIndexMetadata } from "@/app/utils/robotsNoIndex";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import AiConfigurationPageContent from "@/components/admin/AiConfigurationPageContent";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = noIndexMetadata;

export default async function AiConfigurationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <Suspense fallback={<AdminPageLoading locale={locale} />}>
        <AiConfigurationPageContent params={params} />
      </Suspense>
    </PageShell>
  );
}
