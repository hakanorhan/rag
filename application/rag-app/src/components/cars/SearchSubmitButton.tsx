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
      startIcon={<SearchRoundedIcon />}
      sx={{
        ...(fullWidth
          ? { mt: 1.5 }
          : { flexShrink: 0, minWidth: { xs: "100%", sm: 150 } }),
      }}
    >
      {label}
    </Button>
  );
}
