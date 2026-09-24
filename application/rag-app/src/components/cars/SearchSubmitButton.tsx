import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Button from "@mui/material/Button";

export default function SearchSubmitButton({
  label,
  fullWidth = false,
}: {
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <Button
      type="submit"
      variant="contained"
      size="large"
      fullWidth={fullWidth}
      disableElevation
      startIcon={<SearchRoundedIcon />}
      sx={{
        ...(fullWidth
          ? { mt: 1.5 }
          : { flexShrink: 0, minWidth: { xs: "100%", sm: 150 } }),
        minHeight: 56,
        borderRadius: "10px",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        fontWeight: 650,
        textTransform: "none",
        border: 0,
        boxShadow: "0 8px 20px var(--mui-palette-primary-main)",
        transition:
          "background 160ms ease, transform 160ms ease, box-shadow 160ms ease",
        "&:hover": {
          bgcolor: "primary.dark",
          boxShadow: "0 10px 26px var(--mui-palette-primary-main)",
        },
        "&:active": { transform: "translateY(1px)" },
        "&.Mui-focusVisible": {
          outline: "3px solid",
          outlineColor: "primary.main",
          outlineOffset: 2,
        },
      }}
    >
      {label}
    </Button>
  );
}
