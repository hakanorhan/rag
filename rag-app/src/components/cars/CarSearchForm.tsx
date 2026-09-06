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
  returnLocationLabel: string;
  pickupDateLabel: string;
  placeholder: string;
  returnDateLabel: string;
};

type InitialCarSearchValues = {
  pickUpLocationId?: string;
  returnLocationId?: string;
  pickupAt?: string;
  query?: string;
  returnAt?: string;
};

type CarSearchFormProps = {
  initialValues?: InitialCarSearchValues;
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
};

export default function CarSearchForm({
  initialValues = {},
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
    returnLocationLabel,
    pickupDateLabel,
    placeholder,
    returnDateLabel,
  } = labels;

  const {
    pickUpLocationId: initialPickupLocationId = "",
    returnLocationId: initialReturnLocationId = "",
    pickupAt: initialPickupAt = "",
    query: initialQuery = "",
    returnAt: initialReturnAt = "",
  } = initialValues;

  const locale = useLocale();

  const [pickUpLocationId, setPickupLocationId] = useState(
    initialPickupLocationId,
  );

  const [returnLocationId, setReturnLocationId] = useState(
    initialReturnLocationId,
  );

  const [pickupAt, setPickupAt] = useState(initialPickupAt);
  const [returnAt, setReturnAt] = useState(initialReturnAt);
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>(
    initialQuery ? "freeText" : "criteria",
  );

  const [pickupAtHasError, setPickupAtHasError] = useState(false);
  const [returnAtHasError, setReturnAtHasError] = useState(false);

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

  return (
    <Box
      component="section"
      sx={{
        "& .MuiInputLabel-root, & .MuiInputBase-input, & .MuiFormHelperText-root":
          {
            color: "black",
          },
        "& .MuiButton-contained": {
          color: "black",
          bgcolor: "#d4af37",
          "&:hover": { bgcolor: "#b8962e" },
        },
        "& .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          {
            borderColor: "black",
          },
      }}
    >
      <Stack spacing={2}>
        <Tabs
          variant="fullWidth"
          value={searchType}
          aria-label={`${criteriaModeLabel} / ${freeTextModeLabel}`}
          onChange={(_, value: SearchType) => setSearchType(value)}
          sx={{
            p: 0.5,
            bgcolor: "white",
            border: "1px solid #00000033",
            borderRadius: 2,
            "& .MuiTabs-indicator": { display: "none" },
            "& .MuiTab-root": {
              minHeight: 44,
              color: "black",
              borderRadius: 1.5,
              fontWeight: 600,
              textTransform: "none",
              "&:hover": { bgcolor: "#f5f5f5" },
              "&.Mui-selected": {
                color: "black",
                bgcolor: "#d4af37",
                "&:hover": { bgcolor: "#c6a230" },
              },
              "&.Mui-focusVisible": {
                outline: "2px solid black",
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
          onSubmit={(event) => {
            if (
              searchType === "criteria"
                ? !canSubmitCriteria
                : !canSubmitFreeText
            ) {
              event.preventDefault();
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
                    onChange={setPickupLocationId}
                  />
                </Grid>

                <Grid size={{ xs: 6 }}>
                  <SelectField
                    label={returnLocationLabel}
                    name="returnLocationId"
                    value={returnLocationId}
                    locations={locations}
                    onChange={setReturnLocationId}
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
                    onPickupAtChange={setPickupAt}
                    onReturnAtChange={setReturnAt}
                    onPickupErrorChange={setPickupAtHasError}
                    onReturnErrorChange={setReturnAtHasError}
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
                onChange={(event) => setQuery(event.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    backgroundColor: "white",
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
                  color: "black",
                  bgcolor: "#d4af37",
                  "&:hover": { bgcolor: "#b8962e" },
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
