import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import FleetCarGrid from "@/components/cars/FleetCarGrid";
import { COMPANY_NAME } from "@/lib/branding";
import { getAllCars } from "@/lib/services/car";

type FleetContent = {
  articleText: string;
  articleTitle: string;
  ageFilter: string;
  allAges: string;
  description: string;
  empty: string;
  noFilterResults: string;
  perDay: string;
  priceAscending: string;
  priceDescending: string;
  rent: string;
  requestError: string;
  since: string;
  sort: string;
  sortDefault: string;
  title: string;
};

export default async function FleetPageContent() {
  const [t, format, cars] = await Promise.all([
    getTranslations("Fleet"),
    getFormatter(),
    getAllCars().catch(() => null),
  ]);

  const content: FleetContent = {
    articleText: t("articleText", { companyName: COMPANY_NAME }),
    articleTitle: t("articleTitle"),
    ageFilter: t("filters.age"),
    allAges: t("filters.allAges"),
    description: t("description"),
    empty: t("empty"),
    noFilterResults: t("filters.noResults"),
    perDay: t("perDay"),
    priceAscending: t("filters.priceAscending"),
    priceDescending: t("filters.priceDescending"),
    rent: t("rent"),
    requestError: t("requestError"),
    since: t("since"),
    sort: t("filters.sort"),
    sortDefault: t("filters.sortDefault"),
    title: t("title"),
  };

  const fleetCars = cars?.map((car) => ({
    car,
    location: t("location", { location: car.location.name }),
    minimumAge: t("minimumAge", { age: car.minimumAge }),
    price: format.number(car.dailyRate, {
      style: "currency",
      currency: "EUR",
    }),
  }));

  return (
    <>
      <Box
        component="section"
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800 }}>
            <Typography
              component="h1"
              variant="h3"
              color="primary.main"
              sx={{
                mb: 2,
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              {content.title}
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                maxWidth: 720,
              }}
            >
              {content.description}
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        {fleetCars === null ? (
          <Alert severity="error">{content.requestError}</Alert>
        ) : null}

        {fleetCars?.length === 0 ? (
          <Typography color="text.secondary">{content.empty}</Typography>
        ) : null}

        {fleetCars && fleetCars.length > 0 ? (
          <FleetCarGrid
            cars={fleetCars}
            labels={{
              ageFilter: content.ageFilter,
              allAges: content.allAges,
              noFilterResults: content.noFilterResults,
              perDay: content.perDay,
              priceAscending: content.priceAscending,
              priceDescending: content.priceDescending,
              rent: content.rent,
              since: content.since,
              sort: content.sort,
              sortDefault: content.sortDefault,
            }}
          />
        ) : null}

        <Box
          component="section"
          sx={{
            mt: { xs: 6, md: 9 },
            maxWidth: 820,
            borderTop: 3,
            borderColor: "primary.main",
            pt: 3,
          }}
        >
          <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
            {content.articleTitle}
          </Typography>

          <Typography color="text.secondary">{content.articleText}</Typography>
        </Box>
      </Container>
    </>
  );
}
