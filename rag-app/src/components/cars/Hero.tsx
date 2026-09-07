import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import CarSearchForm from "@/components/cars/CarSearchForm";
import type { LocationDTO } from "@/types/location";
import type { HeroSearchInterface } from "../../../messages/interfaces";

type HeroProps = {
  search: HeroSearchInterface["search"];
  title: string;
  locations: LocationDTO[];
};

export default function Hero({ search, title, locations }: HeroProps) {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "500px",
        height: "100vh",
        overflow: "hidden",
        mt: "-80px",
      }}
    >
      <Image
        src="/optimized/hero-image.webp"
        alt="Moderner Hintergrund für Autovermietung"
        preload
        sizes="100vw"
        fill
        style={{ objectFit: "cover", zIndex: 0, objectPosition: "center 0%" }}
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
        <Typography
          component="h1"
          sx={{
            mb: 2,
            color: "black",
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          {title}
        </Typography>
        <CarSearchForm labels={search} locations={locations} />
      </Box>
    </Box>
  );
}
