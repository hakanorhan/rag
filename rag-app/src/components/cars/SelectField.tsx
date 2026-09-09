"use client";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
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
  error: boolean;
  helperText: string;
};

export default function SelectField(props: SelectFieldProps) {
  const { label, name, value, locations, onChange, error, helperText } = props;
  const id = React.useId();

  function handleChange(event: SelectChangeEvent<string>) {
    onChange(event.target.value);
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required error={error}>
        <Select
          id={id}
          MenuProps={{ disableScrollLock: true }}
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
          sx={{ backgroundColor: "background.paper", px: 1.75, height: 56 }}
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
        {error ? <FormHelperText sx={{ backgroundColor: 'transparent'}}>{helperText}</FormHelperText> : null}
      </FormControl>
    </Box>
  );
}
