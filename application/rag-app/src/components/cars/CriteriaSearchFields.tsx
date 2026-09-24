import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import type { CarSearchState } from "@/lib/carSearchState";
import type { LocationDTO } from "@/types/location";
import CarSearchDateTimeFields from "./CarSearchDateTimeFields";
import type { CarSearchLabels, PickerTarget } from "./CarSearchForm.types";
import LocationSelect from "./LocationSelect";
import SearchSubmitButton from "./SearchSubmitButton";

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

      <Box
        sx={(theme) => ({
          pt: { xs: 1.5, sm: 2 },
          "& .MuiOutlinedInput-root": {
            minHeight: 56,
            bgcolor: "background.default",
            borderRadius: 2,
            color: "text.primary",
            transition: theme.transitions.create(
              ["box-shadow", "background-color"],
              { duration: theme.transitions.duration.shorter },
            ),
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "divider",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "text.secondary",
            },
            "&.Mui-focused": {
              boxShadow: 1,
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderWidth: 1,
              borderColor: "primary.main",
            },
          },
          "& .MuiFormLabel-root": {
            color: "text.secondary",
            fontWeight: 500,
          },
          "& .MuiInputBase-input": {
            color: "text.primary",
          },
          "& .MuiFormHelperText-root": {
            mx: 0.5,
          },
          "& .MuiFormHelperText-root.Mui-error": {
            color: "text.primary",
            fontWeight: 700,
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

      <SearchSubmitButton label={button} fullWidth />
    </>
  );
}
