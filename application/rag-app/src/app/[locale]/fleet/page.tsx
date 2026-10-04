import Skeleton from "@mui/material/Skeleton";
import { Suspense } from "react";
import PageShell from "@/components/layout/PageShell";
import FleetPageContent from "@/components/pages/FleetPageContent";

export default function FleetPage() {
  return (
    <PageShell>
      <Suspense fallback={<Skeleton variant="rectangular" height={400} />}>
        <FleetPageContent />
      </Suspense>
    </PageShell>
  );
}
