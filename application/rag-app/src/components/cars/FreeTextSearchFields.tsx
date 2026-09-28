import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { CarSearchState } from "@/lib/carSearchState";
import type { CarSearchLabels } from "./CarSearchForm.types";
import SearchSubmitButton from "./SearchSubmitButton";

type FreeTextSearchFieldsProps = {
  button: string;
  labels: CarSearchLabels;
  query: string;
  showValidationErrors: boolean;
  canSubmitFreeText: boolean;
  updateSearchState: (values: Partial<CarSearchState>) => void;
};

export default function FreeTextSearchFields({
  button,
  labels,
  query,
  showValidationErrors,
  canSubmitFreeText,
  updateSearchState,
}: FreeTextSearchFieldsProps) {
  const {
    freeTextHelper: helperText,
    freeTextLabel: label,
    placeholder,
  } = labels;
  return (
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
        onChange={(event) => updateSearchState({ query: event.target.value })}
        error={showValidationErrors && !canSubmitFreeText}
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
                    bgcolor: "background.paper",
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

      <SearchSubmitButton label={button} />
    </Stack>
  );
}
