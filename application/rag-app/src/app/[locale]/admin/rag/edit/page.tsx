import type { Metadata } from "next";
import { Suspense } from "react";
import { metadata as noIndexMetadata } from "@/app/utils/robotsNoIndex";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import RagEditPageContent from "@/components/admin/RagEditPageContent";
import PageShell from "@/components/layout/PageShell";

export const metadata: Metadata = noIndexMetadata;

export default async function RagEditPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <Suspense fallback={<AdminPageLoading locale={locale} />}>
        <RagEditPageContent params={params} />
      </Suspense>
    </PageShell>
  );
}
