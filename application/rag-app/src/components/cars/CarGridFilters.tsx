"use client";

import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import SelectComponent from "@/components/SelectComponent";
import type { CarSortOrder } from "@/lib/carFilters";

export type CarGridFilterLabels = {
  ageFilter: string;
  allAges: string;
  priceAscending: string;
  priceDescending: string;
  sort: string;
  sortDefault: string;
};

type CarGridFiltersProps = {
  age: string;
  labels: CarGridFilterLabels;
  onAgeChange: (age: string) => void;
  onSortOrderChange: (sortOrder: CarSortOrder) => void;
  readOnly?: boolean;
  sortOrder: CarSortOrder;
};

export default function CarGridFilters({
  age,
  labels,
  onAgeChange,
  onSortOrderChange,
  readOnly = false,
  sortOrder,
}: CarGridFiltersProps) {
  return (
    <Grid container spacing={2} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <SelectComponent
          label={labels.ageFilter}
          value={age}
          onChange={onAgeChange}
          readOnly={readOnly}
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
          onChange={(value) => onSortOrderChange(value as CarSortOrder)}
          readOnly={readOnly}
        >
          <MenuItem value="default">{labels.sortDefault}</MenuItem>
          <MenuItem value="priceAscending">{labels.priceAscending}</MenuItem>
          <MenuItem value="priceDescending">{labels.priceDescending}</MenuItem>
        </SelectComponent>
      </Grid>
    </Grid>
  );
}
