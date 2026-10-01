"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";
import { buildCarSearchHref } from "@/lib/carSearch";
import {
  CAR_SEARCH_DRAFT_COOKIE,
  type CarSearchState,
} from "@/lib/carSearchState";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";

import type { CarSearchLabels, PickerTarget } from "./CarSearchForm.types";
import CriteriaSearchFields from "./CriteriaSearchFields";
import FreeTextSearchFields from "./FreeTextSearchFields";

type SearchType = "criteria" | "freeText";

type CarSearchFormProps = {
  labels: CarSearchLabels;
  locations: LocationDTO[];
  initialSearchState: CarSearchState;
};

export default function CarSearchForm({
  labels,
  locations,
  initialSearchState,
}: CarSearchFormProps) {
  const {
    button,
    criteriaModeLabel,
    freeTextModeLabel,
    incompleteDateRange,
    invalidDateRange,
  } = labels;

  const router = useRouter();
  const [searchState, setSearchState] = useState(initialSearchState);

  useEffect(() => {
    void cookieStore.set({
      name: CAR_SEARCH_DRAFT_COOKIE,
      value: encodeURIComponent(JSON.stringify(searchState)),
      expires: Date.now() + 31_536_000_000,
      path: "/",
      sameSite: "lax",
    });
  }, [searchState]);

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
      sx={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        p: { xs: 1.5, sm: 2 },
        bgcolor: "transparent",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: { xs: 3, sm: 4 },
        boxShadow: 4,
      }}
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
          sx={{
            minHeight: 48,
            borderBottom: "1px solid",
            borderColor: "divider",
            "& .MuiTabs-indicator": {
              height: 2,
              backgroundColor: "primary.main",
            },
            "& .MuiTab-root": {
              minHeight: 48,
              px: { xs: 1, sm: 2 },
              color: "text.secondary",
              fontSize: { xs: "0.8125rem", sm: "0.875rem" },
              fontWeight: 600,
              textTransform: "none",
              "&:hover": {
                color: "text.primary",
              },
              "&.Mui-selected": {
                color: "text.primary",
              },
              "&.Mui-focusVisible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: -2,
              },
            },
          }}
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

            router.push(buildCarSearchHref(searchState));
          }}
        >
          <input type="hidden" name="searchType" value={searchType} />

          {searchType === "criteria" ? (
            <CriteriaSearchFields
              button={button}
              labels={labels}
              locations={locations}
              searchState={searchState}
              showValidationErrors={showValidationErrors}
              openPicker={openPicker}
              updateSearchState={updateSearchState}
              setOpenPicker={setOpenPicker}
              setPickupAtHasError={setPickupAtHasError}
              setReturnAtHasError={setReturnAtHasError}
            />
          ) : (
            <FreeTextSearchFields
              button={button}
              labels={labels}
              query={query}
              showValidationErrors={showValidationErrors}
              canSubmitFreeText={canSubmitFreeText}
              updateSearchState={updateSearchState}
            />
          )}
        </Box>
      </Stack>
    </Box>
  );
}
