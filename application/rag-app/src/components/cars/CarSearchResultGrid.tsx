"use client";

import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
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
          <TextField
            fullWidth
            select
            label={content.ageFilter}
            value={age}
            onChange={(event) => setAge(event.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
              select: { MenuProps: { disableScrollLock: true } },
            }}
          >
            <MenuItem value="">{content.allAges}</MenuItem>
            <MenuItem value="18">18</MenuItem>
            <MenuItem value="21">21</MenuItem>
            <MenuItem value="25">25</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            select
            label={content.sort}
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value as CarSortOrder)
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                ),
              },
              select: { MenuProps: { disableScrollLock: true } },
            }}
          >
            <MenuItem value="default">{content.sortDefault}</MenuItem>
            <MenuItem value="priceAscending">{content.priceAscending}</MenuItem>
            <MenuItem value="priceDescending">
              {content.priceDescending}
            </MenuItem>
          </TextField>
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
                    searchId={searchState.searchId}
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
