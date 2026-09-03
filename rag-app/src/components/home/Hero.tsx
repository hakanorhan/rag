import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Image from "next/image";
import CarSearchForm from "@/components/cars/CarSearchForm";
import ChatWidget from "@/components/chat/chat-widget";
import type { HeroSearchInterface } from "../../../messages/interfaces";

type HeroProps = {
  search: HeroSearchInterface["search"];
};

export default function Hero({ search }: HeroProps) {
  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        mt: "-80px",
      }}
    >
      <Image
        src="/optimized/futuristic.webp"
        alt="Moderner Hintergrund für Autovermietung"
        fetchPriority="high"
        sizes="100vw"
        fill
        style={{ objectFit: "cover", zIndex: 0, objectPosition: "right" }}
      />

      <Paper
        elevation={10}
        sx={{
          position: "absolute",
          zIndex: 1,
          top: { xs: 112, sm: 120, md: 132 },
          left: "50%",
          transform: "translateX(-50%)",
          width: 0.9,
          maxWidth: 920,
          p: { xs: 1, sm: 1.25 },
          borderRadius: { xs: 3, md: 4 },
          bgcolor: "background.paper",
          backdropFilter: "blur(16px)",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CarSearchForm labels={search} />
      </Paper>

      <Box
        sx={{
          position: "absolute",
          zIndex: 1,
          left: { xs: 2, sm: "auto" },
          right: { xs: 2, sm: 4 },
          bottom: { xs: 2, sm: 4 },
        }}
      >
        <ChatWidget />
      </Box>
    </Box>
  );
}
