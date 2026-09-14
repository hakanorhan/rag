import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import type { CarSearchResult } from "@/lib/carSearchState";
import { getProblemMessage } from "@/lib/problemDetails";
import type { CarsInterface } from "../../../messages/interfaces";
import CarSearchResultGrid from "./CarSearchResultGrid";

type CarSearchResultsProps = {
  content: CarsInterface["content"];
  result: CarSearchResult;
};

export default async function CarSearchResults({
  content,
  result,
}: CarSearchResultsProps) {
  const [format, problemT] = await Promise.all([
    getFormatter(),
    getTranslations("Problems"),
  ]);

  if (result.status === "error") {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {getProblemMessage(result.problem, problemT)}
      </Typography>
    );
  }

  if (result.cars.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ mt: 4 }}>
        {content.noResults}
      </Typography>
    );
  }

  const cars = result.cars.map((car) => ({
    car,
    price: format.number(car.dailyRate, {
      style: "currency",
      currency: "EUR",
    }),
  }));

  return (
    <CarSearchResultGrid
      cars={cars}
      content={content}
      searchState={result.searchState}
    />
  );
}
