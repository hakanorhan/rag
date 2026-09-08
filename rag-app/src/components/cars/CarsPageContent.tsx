import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";
import type { CarSearch } from "@/lib/carSearch";
import type { CarDTO } from "@/types/car";
import type { LocationDTO } from "@/types/location";
import type { CarsInterface } from "../../../messages/interfaces";
import CarCard from "./CarCard";
import CarGrid from "./CarGrid";

type CarsContent = CarsInterface["content"];
type CarResultsProps = {
  content: CarsContent;
  search: CarSearch;
  cars: { car: CarDTO; price: string }[];
};

export function CarResults(props: CarResultsProps) {
  const { content, search, cars } = props;
  const {
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    query,
    returnAt,
    searchType,
  } = search;
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
    rentNoCustomerAccount: content.rentNoCustomerAccount,
    rentNotAvailable: content.rentNotAvailable,
    years: content.years,
  };

  return (
    <CarGrid sx={{ mt: 4 }}>
      {cars.map(({ car, price }, index) => (
        <CarCard
          key={car.id}
          car={car}
          labels={labels}
          pickUpLocationId={pickUpLocationId || car.location.locationId}
          returnLocationId={returnLocationId || car.location.locationId}
          pickupAt={pickupAt}
          price={price}
          returnAt={returnAt}
          searchQuery={searchType === "freeText" ? query : undefined}
          imageLoading={index === 0 ? "eager" : "lazy"}
        />
      ))}
    </CarGrid>
  );
}

type CarsPageContentProps = {
  content: CarsContent;
  locations: LocationDTO[];
  search: CarSearch;
  children: ReactNode;
};

export default function CarsPageContent(props: CarsPageContentProps) {
  const { content, locations, search, children } = props;
  const { initialValues, pickupAt, returnAt, hasSearch, hasValidDateRange } =
    search;

  return (
    <Container component="main" maxWidth="lg" sx={{ py: 6, minHeight: 640 }}>
      <Typography variant="h3" component="h1" sx={{ mb: 1 }}>
        {content.title}
      </Typography>

      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {content.description}
      </Typography>

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

      {children}
    </Container>
  );
}
