"use client";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import { type ReactNode, useId } from "react";
import { popupSurfaceSx } from "@/app/theme";

type AppSelectProps = {
  ariaLabel?: string;
  backgroundColor?: string;
  children: ReactNode;
  defaultValue?: string;
  disabled?: boolean;
  displayEmpty?: boolean;
  error?: boolean;
  helperText?: string;
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  renderValue?: (selected: string) => ReactNode;
  required?: boolean;
  startAdornment?: ReactNode;
  value?: string;
};

export default function AppSelect({
  ariaLabel,
  backgroundColor = "background.paper",
  children,
  defaultValue,
  disabled = false,
  displayEmpty = false,
  error = false,
  helperText,
  label,
  name,
  onChange,
  readOnly = false,
  renderValue,
  required = false,
  startAdornment,
  value,
}: AppSelectProps) {
  const selectId = useId();
  const labelId = label ? `${selectId}-label` : undefined;

  return (
    <FormControl
      fullWidth
      disabled={disabled}
      error={error}
      required={required}
    >
      {label ? <InputLabel id={labelId}>{label}</InputLabel> : null}
      <Select<string>
        id={selectId}
        labelId={labelId}
        label={label}
        name={name}
        startAdornment={startAdornment}
        value={value}
        defaultValue={defaultValue}
        disabled={disabled}
        error={error}
        required={required}
        readOnly={readOnly}
        displayEmpty={displayEmpty}
        renderValue={renderValue}
        sx={{ ...popupSurfaceSx, bgcolor: backgroundColor }}
        MenuProps={{
          disableScrollLock: true,
          slotProps: {
            paper: { sx: popupSurfaceSx },
          },
        }}
        onChange={(event) => onChange?.(event.target.value)}
        inputProps={ariaLabel ? { "aria-label": ariaLabel } : undefined}
      >
        {children}
      </Select>
      {helperText ? <FormHelperText>{helperText}</FormHelperText> : null}
    </FormControl>
  );
}
