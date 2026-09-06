"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import * as React from "react";
import type { LocationDTO } from "@/types/location";

type SelectFieldProps = {
  label: string;
  name: string;
  value: string;
  locations: LocationDTO[];
  onChange: (value: string) => void;
};

export default function SelectField(props: SelectFieldProps) {
  const { label, name, value, locations, onChange } = props;
  const id = React.useId();

  function handleChange(event: SelectChangeEvent<string>) {
    onChange(event.target.value);
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required>
        <Select
          id={id}
          name={name}
          value={value}
          onChange={handleChange}
          variant="standard"
          disableUnderline
          displayEmpty
          inputProps={{ "aria-label": label }}
          renderValue={(selected) =>
            locations.find(
              (location) => String(location.locationId) === selected,
            )?.name ?? label
          }
          sx={{ backgroundColor: "white", px: 1.75, height: 56 }}
        >
          {locations.map((location) => (
            <MenuItem
              key={location.locationId}
              value={String(location.locationId)}
            >
              {location.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
