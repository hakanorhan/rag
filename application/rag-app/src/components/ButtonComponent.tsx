import MuiButton, { type ButtonProps } from "@mui/material/Button";

export default function ButtonComponent({
  variant = "contained",
  size = "large",
  ...props
}: ButtonProps) {
  return <MuiButton variant={variant} size={size} {...props} />;
}
