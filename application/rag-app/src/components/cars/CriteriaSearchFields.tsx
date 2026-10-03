"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getSearchLocations } from "@/app/actions/carSearch";
import { popupSurfaceSx } from "@/app/theme";
import type { CarSearchState } from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";
import CarSearchDateTimeFields from "./CarSearchDateTimeFields";
import type { CarSearchLabels, PickerTarget } from "./CarSearchForm.types";
import LocationSelect, { type LocationSelectProps } from "./LocationSelect";
import SearchSubmitButton from "./SearchSubmitButton";

let locationsRequest: Promise<LocationDTO[]> | null = null;

function loadLocations() {
  if (!locationsRequest) {
    locationsRequest = getSearchLocations().catch((error: unknown) => {
      locationsRequest = null;
      throw error;
    });
  }
  return locationsRequest;
}

function SearchLocationSelect(props: LocationSelectProps) {
  const t = useTranslations("Problems");
  const [locations, setLocations] = useState(props.locations);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(props.locations.length === 0);

  useEffect(() => {
    if (locations.length > 0 || loadError) return;
    let isCurrent = true;
    setLoading(true);
    void loadLocations()
      .then((result) => {
        if (isCurrent) setLocations(result);
      })
      .catch(() => {
        if (isCurrent) setLoadError(true);
      })
      .finally(() => {
        if (isCurrent) setLoading(false);
      });
    return () => {
      isCurrent = false;
    };
  }, [loadError, locations.length]);

  return (
    <LocationSelect
      {...props}
      disabled={props.disabled || loading}
      error={props.error || loadError}
      helperText={loadError ? t("INTERNAL_SERVER_ERROR") : props.helperText}
      locations={locations}
    />
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
          <Grid size={{ xs: 6 }}>
            <SearchLocationSelect
              backgroundColor={popupSurfaceSx.bgcolor}
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

          <Grid size={{ xs: 6 }}>
            <SearchLocationSelect
              backgroundColor={popupSurfaceSx.bgcolor}
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
