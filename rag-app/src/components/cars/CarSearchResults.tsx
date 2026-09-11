"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useFormatter } from "next-intl";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { findCars } from "@/lib/carSearchActions";
import { buildCarSearchResultHref } from "@/lib/carSearch";
import type { CarSearchResult, CarSearchState } from "@/lib/carSearchState";
import type { CarsInterface } from "../../../messages/interfaces";
import CarCard from "./CarCard";
import RentCarButton from "./RentCarButton";

type CarSearchResultsProps = {
  content: CarsInterface["content"];
  searchState: CarSearchState;
};

export default function CarSearchResults({ content, searchState }: CarSearchResultsProps) {
  const format = useFormatter();
  const router = useRouter();
  const [result, setResult] = useState<CarSearchResult>();

  useEffect(() => {
    let active = true;

    try {
      void findCars(searchState).then((value) => {
        if (!active) return;
        if (value.status === "success" && !searchState.searchId) {
          router.replace(buildCarSearchResultHref(value.searchState.searchId!));
        }
        setResult(value);
      });
    } catch {
      setResult({ status: "invalid" });
    }

    return () => {
      active = false;
    };
  }, [searchState]);

  if (!result) {
    return null;
  }

  if (result.status === "invalid") {
    return (
      <Typography color="text.secondary" sx={{ mt: 4 }}>
        {content.enterSearch}
      </Typography>
    );
  }

  if (result.status === "error") {
    return (
      <Typography color="error" sx={{ mt: 4 }}>
        {content.requestError}
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
      {result.cars.map((car) => (
        <CarCard
          key={car.id}
          car={car}
          eyebrow={car.carType}
          title={car.carCategory}
          subtitle={car.location.name}
          details={[
            {
              id: "minimum-age",
              text: `${content.minimumAge} ${car.minimumAge} ${content.years}`,
            },
          ]}
          price={`${format.number(car.dailyRate, {
            style: "currency",
            currency: "EUR",
          })} ${content.perDay}`}
          statusColor={car.status === "AVAILABLE" ? "success" : "default"}
          statusLabel={car.status}
          actions={
            <RentCarButton
              car={car}
              pickUpLocationId={
                Number(result.searchState.pickUpLocationId) ||
                car.location.locationId
              }
              returnLocationId={
                Number(result.searchState.returnLocationId) ||
                car.location.locationId
              }
              pickupAt={result.searchState.pickupAt}
              returnAt={result.searchState.returnAt}
              searchQuery={
                result.searchState.searchType === "freeText"
                  ? result.searchState.query
                  : undefined
              }
              searchId={result.searchState.searchId}
              mileagePackageId={result.searchState.mileagePackageId}
              extraIds={result.searchState.extraIds}
              labels={{ rent: content.rent }}
            />
          }
        />
      ))}
    </Box>
  );
}
