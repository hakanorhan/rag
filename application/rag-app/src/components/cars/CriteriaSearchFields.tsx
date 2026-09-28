"use client";

import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { type ComponentProps, useState } from "react";
import { getSearchLocations } from "@/app/actions/carSearch";
import { locationFieldSx } from "@/app/theme";
import type { CarSearchState } from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";
import CarSearchDateTimeFields from "./CarSearchDateTimeFields";
import type { CarSearchLabels, PickerTarget } from "./CarSearchForm.types";
import SearchSubmitButton from "./SearchSubmitButton";

const LocationSelect = dynamic(() => import("./LocationSelect"), {
  ssr: false,
});
type LocationSelectProps = ComponentProps<typeof LocationSelect>;

let locationsRequest: Promise<LocationDTO[]> | null = null;

function SearchLocationSelect(props: LocationSelectProps) {
  const t = useTranslations("Problems");
  const [locations, setLocations] = useState(props.locations);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  async function activate() {
    if (loading || props.disabled) return;
    setLoading(true);
    try {
      await import("./LocationSelect");
      if (locations.length === 0) {
        if (!locationsRequest) {
          locationsRequest = getSearchLocations().catch((error: unknown) => {
            locationsRequest = null;
            throw error;
          });
        }
        setLocations(await locationsRequest);
      }
      setActive(true);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  if (active) {
    return <LocationSelect {...props} locations={locations} openOnMount />;
  }

  return (
    <Box sx={{ minWidth: 120 }}>
      <Box
        component="button"
        type="button"
        disabled={props.disabled || loading}
        aria-busy={loading}
        onClick={activate}
        sx={{
          ...locationFieldSx(props.error || loadError),
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 2,
          px: 2,
          cursor: "pointer",
          font: "inherit",
          textAlign: "left",
          "&:focus-visible": {
            outline: "2px solid",
            outlineColor: "primary.main",
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} aria-label={props.label} />
        ) : (
          <LocationOnRoundedIcon sx={{ color: "text.secondary" }} />
        )}
        {locations.find((item) => String(item.locationId) === props.value)
          ?.name ?? props.label}
      </Box>
      {loadError || props.error ? (
        <FormHelperText error>
          {loadError ? t("INTERNAL_SERVER_ERROR") : props.helperText}
        </FormHelperText>
      ) : null}
    </Box>
  );
}

type CriteriaSearchFieldsProps = {
  button: string;
  labels: CarSearchLabels;
  locations: LocationDTO[];
  searchState: CarSearchState;
  showValidationErrors: boolean;
  openPicker: PickerTarget | null;
  updateSearchState: (values: Partial<CarSearchState>) => void;
  setOpenPicker: (target: PickerTarget | null) => void;
  setPickupAtHasError: (error: boolean) => void;
  setReturnAtHasError: (error: boolean) => void;
};

export default function CriteriaSearchFields({
  button,
  labels,
  locations,
  searchState,
  showValidationErrors,
  openPicker,
  updateSearchState,
  setOpenPicker,
  setPickupAtHasError,
  setReturnAtHasError,
}: CriteriaSearchFieldsProps) {
  const { pickUpLocationId, returnLocationId, pickupAt, returnAt } =
    searchState;
  const {
    locationLabel,
    locationRequired,
    returnLocationLabel,
    returnLocationRequired,
    pickupDateLabel,
    returnDateLabel,
    incompleteDateRange,
    invalidDateRange,
  } = labels;
  return (
    <>
      <input type="hidden" name="pickupAt" value={pickupAt} />
      <input type="hidden" name="returnAt" value={returnAt} />

      <Box sx={{ pt: { xs: 1.5, sm: 2 } }}>
        <Grid container spacing={{ xs: 1.25, sm: 1.5 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SearchLocationSelect
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
            <SearchLocationSelect
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

      <SearchSubmitButton label={button} fullWidth />
    </>
  );
}
