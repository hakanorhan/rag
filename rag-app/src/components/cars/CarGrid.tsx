import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import type { SystemStyleObject } from "@mui/system";
import type { ReactNode } from "react";

type CarGridProps = {
  children: ReactNode;
  sx?: SystemStyleObject<Theme>;
};

export default function CarGrid({ children, sx }: CarGridProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 3,
        ...sx,
      }}
    >
      {children}
    </Box>
  );
}
