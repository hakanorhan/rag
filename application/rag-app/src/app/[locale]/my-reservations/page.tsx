import type { Metadata } from "next";
import { metadata as noIndexMetadata } from "@/app/utils/robotsNoIndex";
import PageShell from "@/components/layout/PageShell";
import MyReservationsPageContent from "@/components/reservation/MyReservationsPageContent";

export const metadata: Metadata = noIndexMetadata;

export default function MyReservationsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  return (
    <PageShell>
      <MyReservationsPageContent params={params} searchParams={searchParams} />
    </PageShell>
  );
}
