import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import AppButton from "@/components/ui/AppButton";

export default function SearchSubmitButton({
  label,
  ariaLabel,
  fullWidth = false,
}: {
  label: string;
  ariaLabel?: string;
  fullWidth?: boolean;
}) {
  return (
    <AppButton
      type="submit"
      aria-label={ariaLabel}
      fullWidth={fullWidth}
      startIcon={<SearchRoundedIcon />}
      sx={{ flexShrink: 0, minWidth: "10%", mt: 1.5 }}
    >
      {label}
    </AppButton>
  );
}
