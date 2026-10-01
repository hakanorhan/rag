import type { Metadata } from "next";
import { metadata as noIndexMetadata } from "@/app/utils/robotsNoIndex";
import PageShell from "@/components/layout/PageShell";
import MyReservationsPageContent from "@/components/pages/MyReservationsPageContent";

export const metadata: Metadata = noIndexMetadata;

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
