import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CarsPageContent, { CarResults } from "@/components/cars/CarsPageContent";
import PageShell from "@/components/layout/PageShell";
import { buildCarSearch, type CarSearch } from "@/lib/carSearch";
import { searchCars, searchCarsByCriteria } from "@/lib/cars";
import { getLocations } from "@/lib/locations";
import type { CarsInterface } from "../../../../messages/interfaces";

// This route boundary streams the results; the view receives resolved data only.
async function SearchResults(input: {
  content: CarsInterface["content"];
  search: CarSearch;
}) {
  const { content, search } = input;
  try {
    const [cars, format] = await Promise.all([
      search.searchType === "freeText"
        ? searchCars(search.query)
        : searchCarsByCriteria({
            location: search.location,
            pickupAt: search.pickupAt,
            returnAt: search.returnAt,
          }),
      getFormatter(),
    ]);
    const results = cars.map((car) => ({
      car,
      price: format.number(car.dailyRate, {
        style: "currency",
        currency: "EUR",
      }),
    }));
    return <CarResults content={content} search={search} cars={results} />;
  } catch {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {content.requestError}
      </Typography>
    );
  }
}

export default async function CarsPage(props: PageProps<"/[locale]/cars">) {
  const params = await props.searchParams;
  const [translation, locations] = await Promise.all([
    getTranslations("Cars"),
    getLocations(),
  ]);
  const content: CarsInterface["content"] = translation.raw("content");
  const search = buildCarSearch({ params, locations });
  return (
    <PageShell>
      <CarsPageContent content={content} locations={locations} search={search}>
        {search.hasSearch && search.hasValidDateRange && (
          <Suspense
            fallback={
              <Skeleton variant="rounded" height={220} sx={{ mt: 4 }} />
            }
          >
            <SearchResults content={content} search={search} />
          </Suspense>
        )}
      </CarsPageContent>
    </PageShell>
  );
}
