"use client";

import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { buildCarSearchHref } from "@/lib/carSearch";
import {
  CAR_SEARCH_DRAFT_STORAGE_KEY,
  type CarSearchState,
  EMPTY_CAR_SEARCH_STATE,
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
};

export default function CarSearchForm({
  labels,
  locations,
}: CarSearchFormProps) {
  const {
    button,
    criteriaModeLabel,
    freeTextModeLabel,
    incompleteDateRange,
    invalidDateRange,
  } = labels;

  const router = useRouter();
  const [searchState, setSearchState] = useState(EMPTY_CAR_SEARCH_STATE);
  const [hasRestoredSearchState, setHasRestoredSearchState] = useState(false);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(CAR_SEARCH_DRAFT_STORAGE_KEY);
      if (storedValue) {
        const parsed: unknown = JSON.parse(storedValue);
        if (isCarSearchState(parsed)) {
          setSearchState(parsed);
          localStorage.setItem(
            CAR_SEARCH_DRAFT_STORAGE_KEY,
            JSON.stringify(parsed),
          );
        }
      }
    } catch {}

    setHasRestoredSearchState(true);
  }, []);

  useEffect(() => {
    if (!hasRestoredSearchState) return;

    try {
      localStorage.setItem(
        CAR_SEARCH_DRAFT_STORAGE_KEY,
        JSON.stringify(searchState),
      );
    } catch {
    }
  }, [hasRestoredSearchState, searchState]);

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
        bgcolor: "rgba(255, 255, 255, 0.92)",
        backgroundImage: "none",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        border: "1px solid #DCE3E6",
        borderRadius: "18px",
        boxShadow: "0 18px 50px rgba(24, 33, 38, 0.10)",
        ...theme.applyStyles("dark", {
          bgcolor: "rgba(24, 33, 38, 0.88)",
          borderColor: "rgba(255, 255, 255, 0.10)",
          boxShadow: "0 18px 50px rgba(0, 0, 0, 0.22)",
        }),
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

function isCarSearchState(value: unknown): value is CarSearchState {
  if (typeof value !== "object" || value === null) return false;

  const state = value as Record<string, unknown>;
  return (
    typeof state.pickUpLocationId === "string" &&
    typeof state.returnLocationId === "string" &&
    typeof state.pickupAt === "string" &&
    typeof state.returnAt === "string" &&
    typeof state.query === "string" &&
    (state.searchType === "criteria" || state.searchType === "freeText") &&
    (state.mileagePackageId === undefined ||
      typeof state.mileagePackageId === "string") &&
    (state.extraIds === undefined || typeof state.extraIds === "string")
  );
}
