import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { cookies } from "next/headers";
import { getTranslations } from "next-intl/server";
import CarSearchForm from "@/components/cars/CarSearchForm";
import Hero from "@/components/cars/Hero";
import NewsArticle from "@/components/cars/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import { routing } from "@/i18n/routing";
import {
  CAR_SEARCH_DRAFT_COOKIE,
  carSearchStateSchema,
  EMPTY_CAR_SEARCH_STATE,
} from "@/lib/carSearchState";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

export const instant = false;

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function Home() {
  const [newsTranslation, heroTranslation, stepsTranslation] =
    await Promise.all([
      getTranslations("News"),
      getTranslations("HeroSearch"),
      getTranslations("HomeSteps"),
    ]);
  const news: NewsInterface = {
    article: newsTranslation.raw("article"),
  };
  const hero: HeroSearchInterface = {
    title: heroTranslation("title"),
    search: heroTranslation.raw("search"),
  };
  const initialSearchState = await readCarSearchState();

  return (
    <PageShell topPadding={false}>
      <Hero title={hero.title}>
        <CarSearchForm
          labels={hero.search}
          locations={[]}
          initialSearchState={initialSearchState}
        />
      </Hero>
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

async function readCarSearchState() {
  const cookieStore = await cookies();
  let initialSearchState = EMPTY_CAR_SEARCH_STATE;
  try {
    const stored = cookieStore.get(CAR_SEARCH_DRAFT_COOKIE)?.value;
    const parsed = carSearchStateSchema.safeParse(JSON.parse(stored ?? "null"));
    if (parsed.success) initialSearchState = parsed.data;
  } catch {
    // Ignore invalid drafts.
  }

  return initialSearchState;
}
