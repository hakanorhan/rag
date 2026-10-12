import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Box from "@mui/material/Box";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { carSearchSurfaceSx } from "@/app/theme";
import type { CarSearchLabels } from "./CarSearchForm.types";
import SearchSubmitButton from "./SearchSubmitButton";

type FreeTextSearchFieldsProps = {
  labels: CarSearchLabels;
  query: string;
  onQueryChange: (query: string) => void;
  onSearch: () => void;
};

export default function FreeTextSearchFields({
  labels,
  query,
  onQueryChange,
  onSearch,
}: FreeTextSearchFieldsProps) {
  const [showValidationErrors, setShowValidationErrors] = useState(false);
  const {
    freeTextHelper: helperText,
    freeTextLabel: label,
    freeTextModeLabel,
    placeholder,
  } = labels;

  return (
    <Box
      component="section"
      aria-label={freeTextModeLabel}
      sx={carSearchSurfaceSx}
    >
      <Box
        component="form"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          if (!query.trim()) {
            setShowValidationErrors(true);
            return;
          }
          onSearch();
        }}
      >
        <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start" }}>
          <TextField
            sx={{ width: "90%" }}
            name="query"
            placeholder={placeholder}
            helperText={helperText}
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            error={showValidationErrors && !query.trim()}
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

          <SearchSubmitButton label="" ariaLabel={labels.button} />
        </Stack>
      </Box>
    </Box>
  );
}
