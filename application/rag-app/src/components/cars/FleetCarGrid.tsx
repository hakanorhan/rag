"use client";

import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import Typography from "@mui/material/Typography";
import { useMemo, useState } from "react";
import SelectComponent from "@/components/SelectComponent";
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
  loading?: boolean;
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

export default function FleetCarGrid({
  cars,
  labels,
  loading = false,
}: FleetCarGridProps) {
  const [age, setAge] = useState("all");
  const [sortOrder, setSortOrder] = useState<CarSortOrder>("default");
  const visibleCars = useMemo(
    () => filterAndSortCars(cars, age, sortOrder),
    [age, cars, sortOrder],
  );

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectComponent
            label={labels.ageFilter}
            value={age}
            onChange={setAge}
            readOnly={loading}
          >
            <MenuItem value="all">{labels.allAges}</MenuItem>
            <MenuItem value="21">&lt;= 21</MenuItem>
            <MenuItem value="25">&lt;= 25</MenuItem>
            <MenuItem value="30">&lt;= 30</MenuItem>
          </SelectComponent>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <SelectComponent
            label={labels.sort}
            value={sortOrder}
            onChange={(value) => setSortOrder(value as CarSortOrder)}
            readOnly={loading}
          >
            <MenuItem value="default">{labels.sortDefault}</MenuItem>
            <MenuItem value="priceAscending">{labels.priceAscending}</MenuItem>
            <MenuItem value="priceDescending">
              {labels.priceDescending}
            </MenuItem>
          </SelectComponent>
        </Grid>
      </Grid>

      {loading ? (
        <Grid container spacing={3}>
          {[0, 1, 2].map((index) => (
            <Grid
              key={index}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ "& > .MuiCard-root": { height: "100%" } }}
            >
              <CarCard
                car={{ imageUrl: null }}
                eyebrow={
                  <Skeleton
                    variant="text"
                    width="35%"
                    sx={{ fontSize: "1rem" }}
                  />
                }
                title={<Skeleton variant="text" width="70%" />}
                details={[
                  {
                    id: "location",
                    text: <Skeleton variant="text" width="80%" />,
                  },
                  {
                    id: "minimum-age",
                    text: <Skeleton variant="text" width="80%" />,
                  },
                  {
                    id: "since",
                    text: <Skeleton variant="text" width="80%" />,
                  },
                ]}
                price={<Skeleton variant="text" width="55%" />}
                actions={
                  <Skeleton variant="rounded" width="100%" height={36} />
                }
                loading
              />
            </Grid>
          ))}
        </Grid>
      ) : visibleCars.length === 0 ? (
        <Typography color="text.secondary">{labels.noFilterResults}</Typography>
      ) : (
        <Grid container spacing={3}>
          {visibleCars.map((fleetCar, index) => (
            <Grid
              key={fleetCar.car.id}
              size={{ xs: 12, sm: 6, md: 4 }}
              sx={{ "& > .MuiCard-root": { height: "100%" } }}
            >
              <CarCard
                car={fleetCar.car}
                imageLoading={index === 0 ? "eager" : "lazy"}
                imageFetchPriority={index === 0 ? "high" : "auto"}
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
