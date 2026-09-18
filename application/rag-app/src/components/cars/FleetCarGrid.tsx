"use client";

import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import { type CarSortOrder, filterAndSortCars } from "@/lib/carFilters";
import type { CarDTO } from "@/types/car";
import CarCard from "./CarCard";
import RentCarButton from "./RentCarButton";

type FleetCar = {
  car: CarDTO;
  location: string;
  minimumAge: string;
  price: string;
};

type FleetCarGridProps = {
  cars: FleetCar[];
  labels: {
    ageFilter: string;
    allAges: string;
    noFilterResults: string;
    perDay: string;
    priceAscending: string;
    priceDescending: string;
    rent: string;
    since: string;
    sort: string;
    sortDefault: string;
  };
};

export default function FleetCarGrid({ cars, labels }: FleetCarGridProps) {
  const [age, setAge] = useState("");
  const [sortOrder, setSortOrder] = useState<CarSortOrder>("default");
  const visibleCars = useMemo(
    () => filterAndSortCars(cars, age, sortOrder),
    [age, cars, sortOrder],
  );

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            select
            label={labels.ageFilter}
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
            <MenuItem value="">{labels.allAges}</MenuItem>
            <MenuItem value="21">21</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="30">30</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            select
            label={labels.sort}
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
            <MenuItem value="default">{labels.sortDefault}</MenuItem>
            <MenuItem value="priceAscending">{labels.priceAscending}</MenuItem>
            <MenuItem value="priceDescending">
              {labels.priceDescending}
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {visibleCars.length === 0 ? (
        <Typography color="text.secondary">{labels.noFilterResults}</Typography>
      ) : (
        <Grid container spacing={3}>
          {visibleCars.map((fleetCar) => (
            <Grid key={fleetCar.car.id} size={{ xs: 12, sm: 6, md: 4 }}>
              <CarCard
                car={fleetCar.car}
                eyebrow={fleetCar.car.carType}
                title={fleetCar.car.carCategory}
                details={[
                  { id: "location", text: fleetCar.location },
                  { id: "minimum-age", text: fleetCar.minimumAge },
                  { id: "since", text: labels.since },
                ]}
                price={`${fleetCar.price} ${labels.perDay}`}
                actions={
                  <RentCarButton
                    car={fleetCar.car}
                    pickUpLocationId={fleetCar.car.location.locationId}
                    returnLocationId={fleetCar.car.location.locationId}
                    pickupAt=""
                    returnAt=""
                    labels={{ rent: labels.rent }}
                  />
                }
              />
            </Grid>
          ))}
        </Grid>
      )}
    </>
  );
}
