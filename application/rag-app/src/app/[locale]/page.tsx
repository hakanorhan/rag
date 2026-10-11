import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import ImageRender from "@/app/utils/imageRender";
import CarSearchForm from "@/components/cars/CarSearchForm";
import Hero from "@/components/cars/Hero";
import NewsArticle from "@/components/cars/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

export const instant = false;

export default async function Home() {
  const [
    newsTranslation,
    heroTranslation,
    stepsTranslation,
    journeysTranslation,
  ] = await Promise.all([
    getTranslations("News"),
    getTranslations("HeroSearch"),
    getTranslations("HomeSteps"),
    getTranslations("HomeJourneys"),
  ]);
  const news: NewsInterface = {
    article: newsTranslation.raw("article"),
  };
  const hero: HeroSearchInterface = {
    title: heroTranslation("title"),
    search: heroTranslation.raw("search"),
  };
  return (
    <PageShell topPadding={false}>
      <Hero title={hero.title} description={heroTranslation("description")}>
        <CarSearchForm labels={hero.search} locations={[]} />
      </Hero>
      <Container
        component="section"
        maxWidth="lg"
        aria-label={journeysTranslation("label")}
        sx={{
          py: { xs: 4, md: 7 },
          px: { xs: 2, sm: 3 },
        }}
      >
        <Stack spacing={{ xs: 5, md: 8 }}>
          <Grid
            container
            component="article"
            aria-labelledby="journey-airport-title"
            sx={{ alignItems: "center" }}
            spacing={{ xs: 2.5, md: 5, lg: 7 }}
          >
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  aspectRatio: "1920 / 819",
                  overflow: "hidden",
                  borderRadius: "18px",
                }}
              >
                <ImageRender
                  src="/optimized/flughafen-terminal.webp"
                  alt={journeysTranslation("airport.imageAlt")}
                  objectFit="cover"
                  fillParent
                  sizes="(max-width: 900px) 100vw, 600px"
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {journeysTranslation("airport.eyebrow")}
              </Typography>
              <Typography
                component="h2"
                id="journey-airport-title"
                variant="h5"
                sx={{
                  mt: 1,
                  mb: 2,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {journeysTranslation("airport.title")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ maxWidth: 480, lineHeight: 1.75 }}
              >
                {journeysTranslation("airport.description")}
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            component="article"
            aria-labelledby="journey-coast-title"
            sx={{ alignItems: "center" }}
            spacing={{ xs: 2.5, md: 5, lg: 7 }}
          >
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Box
                sx={{
                  aspectRatio: "1920 / 819",
                  overflow: "hidden",
                  borderRadius: "18px",
                }}
              >
                <ImageRender
                  src="/optimized/suv-im-blauen-kuestendaemmerlicht.webp"
                  alt={journeysTranslation("coast.imageAlt")}
                  objectFit="cover"
                  fillParent
                  sizes="(max-width: 900px) 100vw, 600px"
                />
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Typography
                variant="overline"
                sx={{
                  color: "primary.main",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                }}
              >
                {journeysTranslation("coast.eyebrow")}
              </Typography>
              <Typography
                component="h2"
                id="journey-coast-title"
                variant="h5"
                sx={{
                  mt: 1,
                  mb: 2,
                  fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                  fontWeight: 600,
                  lineHeight: 1.2,
                  letterSpacing: "-0.025em",
                  textWrap: "balance",
                }}
              >
                {journeysTranslation("coast.title")}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ maxWidth: 480, lineHeight: 1.75 }}
              >
                {journeysTranslation("coast.description")}
              </Typography>
            </Grid>
          </Grid>
        </Stack>
      </Container>
      <NewsArticle article={news.article} />
      <Container
        component="section"
        maxWidth="lg"
        aria-labelledby="booking-steps-title"
        sx={{ py: { xs: 5, md: 8 } }}
      >
        <Typography component="h2" variant="h5" id="booking-steps-title">
          {stepsTranslation("title")}
        </Typography>
        <Typography color="text.secondary">
          {stepsTranslation("intro")}
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
            gap: 4,
            mt: 4,
          }}
        >
          {(["search", "reserve", "manage"] as const).map((step) => (
            <Box key={step}>
              <Typography component="h3" variant="h6">
                {stepsTranslation(`${step}Title`)}
              </Typography>
              <Typography color="text.secondary">
                {stepsTranslation(`${step}Text`)}
              </Typography>
            </Box>
          ))}
        </Box>
      </Container>
    </PageShell>
  );
}
