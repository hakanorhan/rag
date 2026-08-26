import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocationOnRoundedIcon from "@mui/icons-material/LocationOnRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ButtonBase from "@mui/material/ButtonBase";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
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
        src="/optimized/tesla.webp"
        alt="Image"
        fill
        priority
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
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          sx={{ alignItems: "stretch" }}
        >
          <ButtonBase
            aria-label={`${search.locationLabel}, ${search.locationHint}`}
            sx={{
              flex: 1.25,
              justifyContent: "flex-start",
              gap: 1.5,
              minHeight: 64,
              px: 2,
              borderRadius: 2.5,
              color: "text.primary",
              textAlign: "left",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <LocationOnRoundedIcon color="primary" />
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {search.locationLabel}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {search.locationHint}
              </Typography>
            </Box>
          </ButtonBase>

          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" } }}
          />

          <ButtonBase
            aria-label={`${search.dateLabel}: ${search.dateValue}`}
            sx={{
              flex: 1,
              justifyContent: "flex-start",
              gap: 1.5,
              minHeight: 64,
              px: 2,
              borderRadius: 2.5,
              color: "text.primary",
              textAlign: "left",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            <CalendarMonthRoundedIcon color="primary" />
            <Box>
              <Typography variant="caption" color="text.secondary">
                {search.dateLabel}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {search.dateValue}
              </Typography>
            </Box>
          </ButtonBase>

          <Button
            variant="contained"
            size="large"
            startIcon={<SearchRoundedIcon />}
            sx={{
              minHeight: 64,
              px: { xs: 3, md: 4 },
              borderRadius: 2.5,
              fontWeight: 700,
              boxShadow: "none",
            }}
          >
            {search.button}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
