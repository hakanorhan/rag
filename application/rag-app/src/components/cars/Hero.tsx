"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type HeroProps = {
  title: string;
  children: ReactNode;
};

export default function Hero({ title, children }: HeroProps) {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "600px",
        maxHeight: "1100px",
        height: "100vh",
        overflow: "hidden",
        mt: "-80px",
      }}
    >
      <Box
        aria-hidden="true"
        sx={[
          {
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundImage: 'url("/optimized/hero-image-light.webp")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          },
          (theme) =>
            theme.applyStyles("dark", {
              backgroundImage: 'url("/optimized/hero-image-dark.webp")',
            }),
        ]}
      />

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          top: { xs: 200, sm: 200, md: 200 },
          left: { xs: "50%", md: "50px" },
          transform: { xs: "translateX(-50%)", md: "none" },
          width: {
            xs: "90%",
            sm: "80%",
            md: "600px",
          },
          bgcolor: "transparent",
        }}
      >
        <Typography variant="h1" color="text.primary">
          {title}
        </Typography>
        {children}
      </Box>
    </Box>
  );
}
