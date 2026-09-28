"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { Suspense } from "react";
import CarSearchForm from "@/components/cars/CarSearchForm";
import type { LocationDTO } from "@/types/location";
import type { HeroSearchInterface } from "../../../messages/interfaces";

type HeroProps = {
  search: HeroSearchInterface["search"];
  title: string;
  locations: LocationDTO[];
};

function HeroImage({ src, mode }: { src: string; mode: "light" | "dark" }) {
  return (
    <Box
      aria-hidden="true"
      sx={[
        {
          position: "absolute",
          inset: 0,
          zIndex: 0,
          display: mode === "light" ? "block" : "none",
        },
        (theme) =>
          theme.applyStyles("dark", {
            display: mode === "dark" ? "block" : "none",
          }),
      ]}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="100vw"
        loading={mode === "light" ? "eager" : "lazy"}
        fetchPriority="high"
        style={{ objectFit: "cover" }}
      />
    </Box>
  );
}

export default function Hero({ search, title, locations }: HeroProps) {
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
        bgcolor: "background.default",
      }}
    >
      <HeroImage src="/optimized/hero-image-light.webp" mode="light" />
      <HeroImage src="/optimized/hero-image-dark.webp" mode="dark" />

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
        <Suspense fallback={null}>
          <CarSearchForm labels={search} locations={locations} />
        </Suspense>
      </Box>
    </Box>
  );
}
