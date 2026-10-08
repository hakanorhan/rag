import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import FleetPageContent from "@/components/pages/FleetPageContent";
import FleetPageFallback from "@/components/pages/FleetPageFallback";

export default function FleetPage() {
  return (
    <PageShell>
      <Suspense fallback={<FleetPageFallback />}>
        <FleetPageContent />
      </Suspense>
    </PageShell>
  );
}
