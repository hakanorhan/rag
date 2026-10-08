"use client";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { getSearchLocations } from "@/app/actions/carSearch";
import { carSearchSurfaceSx, popupSurfaceSx } from "@/app/theme";
import type { CarSearchState } from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
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
  labels: CarSearchLabels;
  locations: LocationDTO[];
  searchState: CarSearchState;
  updateSearchState: (values: Partial<CarSearchState>) => void;
  onSearch: () => void;
};

export default function CriteriaSearchFields({
  labels,
  locations,
  searchState,
  updateSearchState,
  onSearch,
}: CriteriaSearchFieldsProps) {
  const { pickUpLocationId, returnLocationId, pickupAt, returnAt } =
    searchState;
  const [pickupAtHasError, setPickupAtHasError] = useState(false);
  const [returnAtHasError, setReturnAtHasError] = useState(false);
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const [openPicker, setOpenPicker] = useState<PickerTarget | null>(null);
  const {
    button,
    criteriaModeLabel,
    locationLabel,
    locationRequired,
    returnLocationLabel,
    returnLocationRequired,
    pickupDateLabel,
    returnDateLabel,
    incompleteDateRange,
    invalidDateRange,
  } = labels;
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
  const canSubmit =
    Boolean(pickUpLocationId && returnLocationId && hasDateRange) &&
    !dateErrorMessage;

  return (
    <Box
      component="section"
      aria-label={criteriaModeLabel}
      sx={carSearchSurfaceSx}
    >
      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!canSubmit) {
            setShowValidationErrors(true);
            return;
          }
          onSearch();
        }}
      >
        <input type="hidden" name="pickupAt" value={pickupAt} />
        <input type="hidden" name="returnAt" value={returnAt} />

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
        <SearchSubmitButton label={button} fullWidth />
      </Box>
    </Box>
  );
}
