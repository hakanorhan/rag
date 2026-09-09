"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import TextField from "@mui/material/TextField";
import Form from "next/form";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useState } from "react";

import { getPathname } from "@/i18n/navigation";
import { isValidDateRange } from "@/lib/dateTime";
import type { LocationDTO } from "@/types/location";

import CarSearchDateTimeFields from "./CarSearchDateTimeFields";
import SelectField from "./SelectField";

type PickerTarget = "pickup" | "return";
type SearchType = "criteria" | "freeText";

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

  const locale = useLocale();
  const searchParams = useSearchParams();
  const pickUpLocationId = searchParams.get("pickUpLocationId") ?? "";
  const returnLocationId = searchParams.get("returnLocationId") ?? "";
  const pickupAt = searchParams.get("pickupAt") ?? "";
  const returnAt = searchParams.get("returnAt") ?? "";
  const query = searchParams.get("query") ?? "";
  const requestedSearchType = searchParams.get("searchType");
  const searchType: SearchType =
    requestedSearchType === "freeText" || (!requestedSearchType && query)
      ? "freeText"
      : "criteria";

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

  const action = getPathname({
    href: "/cars",
    locale,
  });

  function updateSearchParam(name: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    window.history.replaceState(null, "", `?${params.toString()}`);
  }

  return (
    <Box component="section">
      <Stack spacing={2}>
        <Tabs
          variant="fullWidth"
          value={searchType}
          aria-label={`${criteriaModeLabel} / ${freeTextModeLabel}`}
          onChange={(_, value: SearchType) => {
            updateSearchParam("searchType", value);
            setShowValidationErrors(false);
          }}
          sx={{
            p: 0.5,
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 44,
              color: "text.primary",
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "action.hover" },
              "&.Mui-selected": {
                color: "primary.contrastText",
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
              },
              "&.Mui-focusVisible": {
                outline: "2px solid",
                outlineColor: "primary.main",
                outlineOffset: -2,
              },
            },
          }}
        >
          <Tab value="criteria" label={criteriaModeLabel} />
          <Tab value="freeText" label={freeTextModeLabel} />
        </Tabs>

        <Form
          action={action}
          noValidate
          onSubmit={(event) => {
            const cannotSubmit =
              searchType === "criteria"
                ? !canSubmitCriteria
                : !canSubmitFreeText;

            if (cannotSubmit) {
              event.preventDefault();
              setShowValidationErrors(true);
            }
          }}
        >
          <input type="hidden" name="searchType" value={searchType} />

          {searchType === "criteria" ? (
            <>
              <input type="hidden" name="pickupAt" value={pickupAt} />
              <input type="hidden" name="returnAt" value={returnAt} />

              <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                <Grid size={{ xs: 6 }}>
                  <SelectField
                    label={locationLabel}
                    name="pickUpLocationId"
                    value={pickUpLocationId}
                    locations={locations}
                    onChange={(value) =>
                      updateSearchParam("pickUpLocationId", value)
                    }
                    error={showValidationErrors && !pickUpLocationId}
                    helperText={locationRequired}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <SelectField
                    label={returnLocationLabel}
                    name="returnLocationId"
                    value={returnLocationId}
                    locations={locations}
                    onChange={(value) =>
                      updateSearchParam("returnLocationId", value)
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
                      updateSearchParam("pickupAt", value)
                    }
                    onReturnAtChange={(value) =>
                      updateSearchParam("returnAt", value)
                    }
                    onPickupErrorChange={setPickupAtHasError}
                    onReturnErrorChange={setReturnAtHasError}
                    showRequiredErrors={showValidationErrors}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disableElevation
                startIcon={<SearchRoundedIcon />}
                sx={{ mt: 2 }}
              >
                {button}
              </Button>
            </>
          ) : (
            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "flex-start" }}
            >
              <TextField
                fullWidth
                name="query"
                placeholder={placeholder}
                helperText={helperText}
                value={query}
                onChange={(event) =>
                  updateSearchParam("query", event.target.value)
                }
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "background.paper",
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                  },
                }}
                slotProps={{
                  htmlInput: { "aria-label": label },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <AutoAwesomeRoundedIcon color="primary" />
                      </InputAdornment>
                    ),
                  },
                }}
              />

              <IconButton
                type="submit"
                aria-label={button}
                sx={{
                  width: 56,
                  height: 56,
                  color: "primary.contrastText",
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
              >
                <SearchRoundedIcon />
              </IconButton>
            </Stack>
          )}
        </Form>
      </Stack>
    </Box>
  );
}
