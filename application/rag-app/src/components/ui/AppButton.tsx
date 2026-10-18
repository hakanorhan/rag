import MuiButton, { type ButtonProps } from "@mui/material/Button";

export default function AppButton({
  variant = "contained",
  size = "large",
  ...props
}: ButtonProps) {
  return <MuiButton variant={variant} size={size} {...props} />;
}
