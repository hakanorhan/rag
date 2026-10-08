"use client";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import FleetCarGrid from "@/components/cars/FleetCarGrid";

export default function FleetPageFallback() {
  const t = useTranslations("Fleet");

  return (
    <>
      <Box component="section" sx={{ display: "flex", alignItems: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="h1" color="primary.main">
            {t("title")}
          </Typography>
          <Typography variant="subtitle1" component="p" color="text.secondary">
            {t("description")}
          </Typography>
        </Container>
      </Box>
      <Container component="main" maxWidth="lg" sx={{ pt: { xs: 5, md: 8 } }}>
        <FleetCarGrid
          cars={[]}
          loading
          labels={{
            ageFilter: t("filters.age"),
            allAges: t("filters.allAges"),
            noFilterResults: t("filters.noResults"),
            perDay: t("perDay"),
            priceAscending: t("filters.priceAscending"),
            priceDescending: t("filters.priceDescending"),
            rent: t("rent"),
            since: t("since"),
            sort: t("filters.sort"),
            sortDefault: t("filters.sortDefault"),
          }}
        />
      </Container>
    </>
  );
}
