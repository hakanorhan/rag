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
      sx={{
        ...(fullWidth
          ? { mt: 1.5 }
          : { flexShrink: 0, minWidth: { xs: "100%", sm: 150 } }),
      }}
    >
      {label}
    </ButtonComponent>
  );
}
