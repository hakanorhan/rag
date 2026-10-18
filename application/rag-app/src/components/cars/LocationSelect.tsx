import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import AppSelect from "@/components/ui/AppSelect";
import type { LocationDTO } from "@/types/location";

export type LocationSelectProps = {
  backgroundColor?: string;
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
    backgroundColor,
    disabled = false,
    label,
    name,
    value,
    locations,
    onChange,
    error,
    helperText,
  } = props;

  return (
    <AppSelect
      ariaLabel={label}
      backgroundColor={backgroundColor}
      disabled={disabled}
      name={name}
      value={locations.length === 0 ? "" : value}
      onChange={onChange}
      startAdornment={
        <InputAdornment position="start">
          <LocationOnRoundedIcon fontSize="small" />
        </InputAdornment>
      }
      displayEmpty
      renderValue={(selected) =>
        locations.find((location) => String(location.locationId) === selected)
          ?.name ?? label
      }
      required
      error={error}
      helperText={error ? helperText : undefined}
    >
      {locations.map((location) => (
        <MenuItem key={location.locationId} value={String(location.locationId)}>
          {location.name}
        </MenuItem>
      ))}
    </AppSelect>
  );
}
