import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import type { LocationDTO } from "@/types/location";

type LocationSelectProps = {
  disabled?: boolean;
  label: string;
  name: string;
  value: string;
  locations: LocationDTO[];
  onChange: (value: string) => void;
  error: boolean;
  helperText: string;
};

export default function LocationSelect(props: LocationSelectProps) {
  const {
    disabled = false,
    label,
    name,
    value,
    locations,
    onChange,
    error,
    helperText,
  } = props;

  function handleChange(event: SelectChangeEvent<string>) {
    onChange(event.target.value);
  }

  return (
    <Box sx={{ position: "relative", minWidth: 120 }}>
      <FormControl fullWidth required error={error}>
        <LocationOnRoundedIcon
          sx={{
            position: "absolute",
            zIndex: 1,
            top: 28,
            left: 16,
            color: "text.secondary",
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />
        <Select
          disabled={disabled}
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
          sx={{
            height: 56,
            color: "text.primary",
            backgroundColor: "background.default",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            "& .MuiSelect-select": {
              px: 2,
              pl: 5.5,
              display: "flex",
              alignItems: "center",
            },
            "& .MuiSelect-icon": { color: "text.secondary" },
            "&:hover": { borderColor: "text.secondary" },
            "&.Mui-focused": { borderColor: "primary.main" },
          }}
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
        {error ? (
          <FormHelperText
            sx={{
              backgroundColor: "transparent",
              color: "text.primary",
              "&.Mui-error": {
                color: "text.primary",
                fontWeight: 700,
              },
            }}
          >
            {helperText}
          </FormHelperText>
        ) : null}
      </FormControl>
    </Box>
  );
}
