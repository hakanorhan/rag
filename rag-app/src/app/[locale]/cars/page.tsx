import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import CarsPageContent from "@/components/cars/CarsPageContent";
import PageShell from "@/components/layout/PageShell";

export default function CarsPage({
  searchParams,
}: PageProps<"/[locale]/cars">) {
  return (
    <PageShell
      fallback={
        <Container
          component="main"
          maxWidth="lg"
          sx={{ py: 6, minHeight: 640 }}
        >
          <Skeleton variant="text" width="40%" height={64} />
          <Skeleton variant="rounded" height={180} />
        </Container>
      }
    >
      <CarsPageContent searchParams={searchParams} />
    </PageShell>
  );
}
