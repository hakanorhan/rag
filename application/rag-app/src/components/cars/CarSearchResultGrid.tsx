"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import SelectComponent from "@/components/SelectComponent";
import { type CarSortOrder, filterAndSortCars } from "@/lib/carFilters";
import type { CarSearchState } from "@/lib/carSearchState";
import type { CarDTO } from "@/types/car";
import type { CarsInterface } from "../../../messages/interfaces";
import CarCard from "./CarCard";
import RentCarButton from "./RentCarButton";

type SearchCar = {
  car: CarDTO;
  price: string;
};

type CarSearchResultGridProps = {
  cars: SearchCar[];
  content: CarsInterface["content"];
  searchState: CarSearchState;
};

export default function CarSearchResultGrid({
  cars,
  content,
  searchState,
}: CarSearchResultGridProps) {
  const [age, setAge] = useState("");
  const [sortOrder, setSortOrder] = useState<CarSortOrder>("default");
  const visibleCars = useMemo(
    () => filterAndSortCars(cars, age, sortOrder),
    [age, cars, sortOrder],
  );

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectComponent
            label={content.ageFilter}
            value={age}
            onChange={setAge}
          >
            <MenuItem value="">{content.allAges}</MenuItem>
            <MenuItem value="21">&lt;= 21</MenuItem>
            <MenuItem value="25">&lt;= 25</MenuItem>
            <MenuItem value="30">&lt;= 30</MenuItem>
          </SelectComponent>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectComponent
            label={content.sort}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as CarSortOrder)}
          >
            <MenuItem value="default">{content.sortDefault}</MenuItem>
            <MenuItem value="priceAscending">{content.priceAscending}</MenuItem>
            <MenuItem value="priceDescending">
              {content.priceDescending}
            </MenuItem>
          </SelectComponent>
        </Grid>
      </Grid>

      {visibleCars.length === 0 ? (
        <Typography color="text.secondary">
          {content.noFilterResults}
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {visibleCars.map(({ car, price }) => (
            <Grid key={car.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CarCard
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
                price={`${price} ${content.perDay}`}
                actions={
                  <RentCarButton
                    car={car}
                    pickUpLocationId={
                      Number(searchState.pickUpLocationId) ||
                      car.location.locationId
                    }
                    returnLocationId={
                      Number(searchState.returnLocationId) ||
                      car.location.locationId
                    }
                    pickupAt={searchState.pickupAt}
                    returnAt={searchState.returnAt}
                    searchQuery={
                      searchState.searchType === "freeText"
                        ? searchState.query
                        : undefined
                    }
                    mileagePackageId={searchState.mileagePackageId}
                    extraIds={searchState.extraIds}
                    labels={{ rent: content.rent }}
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}
