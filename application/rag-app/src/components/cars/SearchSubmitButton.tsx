import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import ButtonComponent from "@/components/ButtonComponent";

export default function SearchSubmitButton({
  label,
  fullWidth = false,
}: {
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <ButtonComponent
      type="submit"
      fullWidth={fullWidth}
      startIcon={<SearchRoundedIcon />}
      sx={{ flexShrink: 0, minWidth: "10%", mt: 1.5 }}
    >
      {label}
    </ButtonComponent>
  );
}
