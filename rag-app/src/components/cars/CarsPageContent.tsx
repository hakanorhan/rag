import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import { Suspense } from "react";
import searchCars from "@/lib/searchCars";
import searchCarsByCriteria from "@/lib/searchCarsByCriteria";
import type { CarsInterface } from "../../../messages/interfaces";
import CarCard from "./CarCard";
import CarSearchForm from "./CarSearchForm";

type CarsContent = CarsInterface["content"];
type CarsSearchParams = PageProps<"/[locale]/cars">["searchParams"];

function getValue(value?: string | string[]) {
  return (Array.isArray(value) ? value[0] : value)?.trim() ?? "";
}

async function CarResults({
  content,
  location,
  pickupAt,
  query,
  returnAt,
  searchType,
}: {
  content: CarsContent;
  location: string;
  pickupAt: string;
  query: string;
  returnAt: string;
  searchType: "criteria" | "freeText";
}) {
  try {
    const [cars, format] = await Promise.all([
      searchType === "freeText"
        ? searchCars(query)
        : searchCarsByCriteria({ location, pickupAt, returnAt }),
      getFormatter(),
    ]);

    if (cars.length === 0) {
      return (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          {content.noResults}
        </Typography>
      );
    }

    const labels = {
      minimumAge: content.minimumAge,
      perDay: content.perDay,
      rent: content.rent,
      renting: content.renting,
      rentSuccess: content.rentSuccess,
      rentError: content.rentError,
      rentMissingDetails: content.rentMissingDetails,
      rentNotAuthenticated: content.rentNotAuthenticated,
      rentNotAvailable: content.rentNotAvailable,
      years: content.years,
    };

    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            md: "repeat(3, minmax(0, 1fr))",
          },
          gap: 3,
          mt: 4,
        }}
      >
        {cars.map((car) => (
          <CarCard
            key={car.id}
            car={car}
            labels={labels}
            pickupAt={pickupAt}
            price={format.number(car.dailyRate, {
              style: "currency",
              currency: "EUR",
            })}
            returnAt={returnAt}
          />
        ))}
      </Box>
    );
  } catch {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {content.requestError}
      </Typography>
    );
  }
}

export default async function CarsPageContent({
  searchParams,
}: {
  searchParams: CarsSearchParams;
}) {
  const [carsTranslation, params] = await Promise.all([
    getTranslations("Cars"),
    searchParams,
  ]);

  const content: CarsContent = carsTranslation.raw("content");

  const location = getValue(params.location);
  const pickupAt = getValue(params.pickupAt);
  const query = getValue(params.query);
  const returnAt = getValue(params.returnAt);
  const requestedSearchType = getValue(params.searchType);
  const searchType =
    requestedSearchType === "freeText" || (!requestedSearchType && query)
      ? "freeText"
      : "criteria";

  const hasSearch =
    searchType === "freeText"
      ? Boolean(query)
      : Boolean(location || pickupAt || returnAt);

  const pickupTimestamp = Date.parse(pickupAt);
  const returnTimestamp = Date.parse(returnAt);

  const hasValidDateRange =
    (!pickupAt && !returnAt) ||
    Boolean(
      pickupAt &&
        returnAt &&
        !Number.isNaN(pickupTimestamp) &&
        !Number.isNaN(returnTimestamp) &&
        pickupTimestamp < returnTimestamp,
    );

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6, minHeight: 640 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        {content.title}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {content.description}
      </Typography>

      <CarSearchForm
        labels={content}
        initialValues={{
          location,
          pickupAt,
          query,
          returnAt,
        }}
      />

      {hasSearch && !hasValidDateRange ? (
        <Typography color="error" sx={{ mt: 4 }}>
          {pickupAt && returnAt
            ? content.invalidDateRange
            : content.incompleteDateRange}
        </Typography>
      ) : null}

      {!hasSearch ? (
        <Typography color="text.secondary" sx={{ mt: 4 }}>
          {content.enterSearch}
        </Typography>
      ) : null}

      {hasSearch && hasValidDateRange ? (
        <Suspense
          fallback={
            <Box sx={{ mt: 4 }}>
              <Skeleton variant="rounded" height={220} />
            </Box>
          }
        >
          <CarResults
            content={content}
            location={location}
            pickupAt={pickupAt}
            query={query}
            returnAt={returnAt}
            searchType={searchType}
          />
        </Suspense>
      ) : null}
    </Container>
  );
}
