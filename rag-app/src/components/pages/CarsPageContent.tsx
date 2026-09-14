import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { findCars } from "@/app/actions/carSearch";
import CarSearchResults from "@/components/cars/CarSearchResults";
import { parseCarSearchState } from "@/lib/carSearch";
import type { CarsInterface } from "../../../messages/interfaces";

export default async function CarsPageContent({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const translation = await getTranslations("Cars");
  const content: CarsInterface["content"] = translation.raw("content");
  const searchState = parseCarSearchState(await searchParams);
  const result = await findCars(searchState);

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6, minHeight: 640 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        {content.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {content.description}
      </Typography>
      <CarSearchResults content={content} result={result} />
    </Container>
  );
}
