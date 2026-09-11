"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import { useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { buildCarSearchHref } from "@/lib/carSearch";
import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";

import CarSearchDateTimeFields from "./CarSearchDateTimeFields";

export type PickerTarget = "pickup" | "return";
type SearchType = "criteria" | "freeText";

const EMPTY_CAR_SEARCH_STATE: CarSearchState = {
  pickUpLocationId: "",
  returnLocationId: "",
  pickupAt: "",
  returnAt: "",
  query: "",
  searchType: "criteria",
};

type CarSearchLabels = {
  button: string;
  criteriaModeLabel: string;
  freeTextHelper?: string;
  freeTextLabel: string;
  freeTextModeLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  locationLabel: string;
  locationRequired: string;
  returnLocationLabel: string;
  returnLocationRequired: string;
  pickupDateLabel: string;
  placeholder: string;
  returnDateLabel: string;
};

type CarSearchFormProps = {
  labels: CarSearchLabels;
  locations: LocationDTO[];
};

export type CarSearchDateTimeFieldsProps = {
  pickupAt: string;
  returnAt: string;
  pickupDateLabel: string;
  returnDateLabel: string;
  incompleteDateRange: string;
  invalidDateRange: string;
  openPicker: PickerTarget | null;
  onOpenPickerChange: (target: PickerTarget | null) => void;
  onPickupAtChange: (value: string) => void;
  onReturnAtChange: (value: string) => void;
  onPickupErrorChange: (hasError: boolean) => void;
  onReturnErrorChange: (hasError: boolean) => void;
  showRequiredErrors: boolean;
};

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

export function LocationSelect(props: LocationSelectProps) {
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
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required error={error}>
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
        {error ? (
          <FormHelperText sx={{ backgroundColor: "transparent" }}>
            {helperText}
          </FormHelperText>
        ) : null}
      </FormControl>
    </Box>
  );
}

export default function CarSearchForm({
  labels,
  locations,
}: CarSearchFormProps) {
  const {
    button,
    criteriaModeLabel,
    freeTextHelper: helperText,
    freeTextLabel: label,
    freeTextModeLabel,
    incompleteDateRange,
    invalidDateRange,
    locationLabel,
    locationRequired,
    returnLocationLabel,
    returnLocationRequired,
    pickupDateLabel,
    placeholder,
    returnDateLabel,
  } = labels;

  const router = useRouter();
  const [searchState, setSearchState] = useState(EMPTY_CAR_SEARCH_STATE);
  const updateSearchState = (values: Partial<CarSearchState>) => {
    setSearchState((current) => ({ ...current, ...values }));
  };
  const {
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    returnAt,
    query,
    searchType,
  } = searchState;

  const [pickupAtHasError, setPickupAtHasError] = useState(false);
  const [returnAtHasError, setReturnAtHasError] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [openPicker, setOpenPicker] = useState<PickerTarget | null>(null);

  const hasPickupAt = Boolean(pickupAt);
  const hasReturnAt = Boolean(returnAt);
  const hasDateRange = hasPickupAt && hasReturnAt;
  const hasIncompleteDateRange = hasPickupAt !== hasReturnAt;
  const hasInvalidDateRange =
    hasDateRange && !isValidDateRange(pickupAt, returnAt);

  const dateErrorMessage = hasIncompleteDateRange
    ? incompleteDateRange
    : pickupAtHasError || returnAtHasError || hasInvalidDateRange
      ? invalidDateRange
      : undefined;

  const canSubmitCriteria =
    Boolean(pickUpLocationId && returnLocationId && hasDateRange) &&
    !dateErrorMessage;
  const canSubmitFreeText = Boolean(query.trim());

  return (
    <Box
      component="section"
      sx={(theme) => ({
        position: "relative",
        overflow: "hidden",
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "background.default",
        borderRadius: { xs: 3, sm: 4 },
        boxShadow: theme.shadows[4],
        "&::before": {
          content: '""',
          position: "absolute",
          inset: "0 0 auto 0",
          height: 3,
          background: `linear-gradient(90deg, ${theme.palette.primary.light}, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          pointerEvents: "none",
        },
      })}
    >
      <Stack spacing={{ xs: 1.5, sm: 2 }}>
        <Tabs
          variant="fullWidth"
          value={searchType}
          aria-label={`${criteriaModeLabel} / ${freeTextModeLabel}`}
          onChange={(_, value: SearchType) => {
            updateSearchState({ searchType: value });
            setShowValidationErrors(false);
          }}
          sx={(theme) => ({
            minHeight: 52,
            p: 0.5,
            bgcolor: "background.default",
            border: "1px solid",
            borderColor: "background.default",
            borderRadius: 2.5,
            "& .MuiTab-root": {
              minHeight: 42,
              px: { xs: 1.25, sm: 2 },
              color: "text.secondary",
              borderRadius: 2,
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              fontWeight: 650,
              textTransform: "none",
              "&:hover": {
                color: "text.primary",
                bgcolor: "background.paper",
              },
              "&.Mui-selected": {
                color: "text.primary",
                bgcolor: "background.paper",
                boxShadow: theme.shadows[2],
                "&:hover": { bgcolor: "background.paper" },
              },
              "&.Mui-focusVisible": {
                outline: `2px solid ${theme.palette.primary.main}`,
                outlineOffset: -2,
              },
            },
          })}
        >
          <Tab disableRipple value="criteria" label={criteriaModeLabel} />
          <Tab disableRipple value="freeText" label={freeTextModeLabel} />
        </Tabs>

        <Box
          component="form"
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            const cannotSubmit =
              searchType === "criteria"
                ? !canSubmitCriteria
                : !canSubmitFreeText;

            if (cannotSubmit) {
              setShowValidationErrors(true);
              return;
            }

            router.push(buildCarSearchHref(searchState ?? EMPTY_CAR_SEARCH_STATE));
          }}
        >
          <input type="hidden" name="searchType" value={searchType} />

          {searchType === "criteria" ? (
            <>
              <input type="hidden" name="pickupAt" value={pickupAt} />
              <input type="hidden" name="returnAt" value={returnAt} />

              <Box
                sx={(theme) => ({
                  p: { xs: 1.25, sm: 1.5 },
                  bgcolor: "background.default",
                  border: "1px solid",
                  borderColor: "background.default",
                  borderRadius: 2.75,
                  "& .MuiOutlinedInput-root": {
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    transition: theme.transitions.create(
                      ["box-shadow", "background-color"],
                      { duration: theme.transitions.duration.shorter },
                    ),
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.disabled",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.secondary",
                    },
                    "&.Mui-focused": {
                      boxShadow: theme.shadows[1],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 1,
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "& .MuiFormLabel-root": {
                    fontWeight: 500,
                  },
                  "& .MuiFormHelperText-root": {
                    mx: 0.5,
                  },
                })}
              >
                <Grid container spacing={{ xs: 1.25, sm: 1.5 }}>
                  <Grid size={{ xs: 12, sm: 6 }}>
                    <LocationSelect
                      label={locationLabel}
                      name="pickUpLocationId"
                      value={pickUpLocationId}
                      locations={locations}
                      onChange={(value) =>
                        updateSearchState({ pickUpLocationId: value })
                      }
                      error={showValidationErrors && !pickUpLocationId}
                      helperText={locationRequired}
                    />
                  </Grid>

                  <Grid size={{ xs: 12, sm: 6 }}>
                    <LocationSelect
                      label={returnLocationLabel}
                      name="returnLocationId"
                      value={returnLocationId}
                      locations={locations}
                      onChange={(value) =>
                        updateSearchState({ returnLocationId: value })
                      }
                      error={showValidationErrors && !returnLocationId}
                      helperText={returnLocationRequired}
                    />
                  </Grid>

                  <Grid size={{ xs: 12 }}>
                    <CarSearchDateTimeFields
                      pickupAt={pickupAt}
                      returnAt={returnAt}
                      pickupDateLabel={pickupDateLabel}
                      returnDateLabel={returnDateLabel}
                      incompleteDateRange={incompleteDateRange}
                      invalidDateRange={invalidDateRange}
                      openPicker={openPicker}
                      onOpenPickerChange={setOpenPicker}
                      onPickupAtChange={(value) =>
                        updateSearchState({ pickupAt: value })
                      }
                      onReturnAtChange={(value) =>
                        updateSearchState({ returnAt: value })
                      }
                      onPickupErrorChange={setPickupAtHasError}
                      onReturnErrorChange={setReturnAtHasError}
                      showRequiredErrors={showValidationErrors}
                    />
                  </Grid>
                </Grid>
              </Box>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disableElevation
                startIcon={<SearchRoundedIcon />}
                sx={(theme) => ({
                  minHeight: 56,
                  mt: 1.5,
                  borderRadius: 2.25,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  textTransform: "none",
                  boxShadow: theme.shadows[3],
                  transition: theme.transitions.create(
                    ["transform", "box-shadow", "background-color"],
                    { duration: theme.transitions.duration.shorter },
                  ),
                  "&:hover": {
                    transform: "translateY(-1px)",
                    boxShadow: theme.shadows[6],
                  },
                  "&:active": {
                    transform: "translateY(0)",
                  },
                  "&.Mui-focusVisible": {
                    outline: `3px solid ${theme.palette.primary.light}`,
                    outlineOffset: 2,
                  },
                })}
              >
                {button}
              </Button>
            </>
          ) : (
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              sx={{ alignItems: { xs: "stretch", sm: "flex-start" } }}
            >
              <TextField
                fullWidth
                name="query"
                placeholder={placeholder}
                helperText={helperText}
                value={query}
                onChange={(event) =>
                  updateSearchState({ query: event.target.value })
                }
                error={showValidationErrors && !canSubmitFreeText}
                sx={(theme) => ({
                  "& .MuiOutlinedInput-root": {
                    minHeight: 56,
                    bgcolor: "background.paper",
                    borderRadius: 2.25,
                    transition: theme.transitions.create(
                      ["box-shadow", "background-color"],
                      { duration: theme.transitions.duration.shorter },
                    ),
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.disabled",
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "text.secondary",
                    },
                    "&.Mui-focused": {
                      boxShadow: theme.shadows[1],
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderWidth: 1,
                    },
                  },
                  "& .MuiFormHelperText-root": {
                    mx: 0.5,
                  },
                })}
                slotProps={{
                  htmlInput: { "aria-label": label },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <Box
                          sx={{
                            display: "grid",
                            placeItems: "center",
                            width: 32,
                            height: 32,
                            color: "primary.main",
                            bgcolor: "background.default",
                            borderRadius: 1.5,
                          }}
                        >
                          <AutoAwesomeRoundedIcon fontSize="small" />
                        </Box>
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                disableElevation
                startIcon={<SearchRoundedIcon />}
                sx={(theme) => ({
                  flexShrink: 0,
                  minWidth: { xs: "100%", sm: 150 },
                  minHeight: 56,
                  borderRadius: 2.25,
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  textTransform: "none",
                  boxShadow: theme.shadows[3],
                  "&:hover": {
                    boxShadow: theme.shadows[6],
                  },
                  "&.Mui-focusVisible": {
                    outline: `3px solid ${theme.palette.primary.light}`,
                    outlineOffset: 2,
                  },
                })}
              >
                {button}
              </Button>
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
