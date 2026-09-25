import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/cars/Hero";
import NewsArticle from "@/components/cars/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import { getLocations } from "@/lib/services/car";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) return {};

  const { locale } = await params;
  const canonicalBase = new URL(baseUrl);
  const forwardedHost = (await headers()).get("x-forwarded-host");
 
  if (
    process.env.NODE_ENV === "development" &&
    canonicalBase.hostname === "localhost" &&
    canonicalBase.port &&
    forwardedHost === `host.docker.internal:${canonicalBase.port}`
  ) {
    canonicalBase.host = forwardedHost;
  }

  return {
    alternates: {
      canonical: new URL(`/${locale}`, canonicalBase).toString(),
    },
  };
}

export default async function Home() {
  const [newsTranslation, heroTranslation, stepsTranslation, locations] =
    await Promise.all([
      getTranslations("News"),
      getTranslations("HeroSearch"),
      getTranslations("HomeSteps"),
      getLocations(),
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
      <Hero title={hero.title} search={hero.search} locations={locations} />
      <NewsArticle article={news.article} />
      <Container
        component="section"
        maxWidth="lg"
        aria-labelledby="booking-steps-title"
        sx={{ py: { xs: 5, md: 8 } }}
      >
        <Typography
          component="h2"
          variant="h4"
          id="booking-steps-title"
          sx={{ mb: 2 }}
        >
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
              <Typography component="h3" variant="h6" sx={{ mb: 1 }}>
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
