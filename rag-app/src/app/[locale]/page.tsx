import Box from "@mui/material/Box";
import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import NewsArticle from "@/components/home/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

async function HomeContent() {
  const [newsTranslation, heroTranslation] = await Promise.all([
    getTranslations("News"),
    getTranslations("HeroSearch"),
  ]);
  const news: NewsInterface = {
    article: newsTranslation.raw("article"),
  };
  const hero: HeroSearchInterface = {
    search: heroTranslation.raw("search"),
  };

  return (
    <>
      <Hero search={hero.search} />
      <NewsArticle article={news.article} />
    </>
  );
}

export default function Home() {
  return (
    <PageShell fallback={<Box component="main" sx={{ minHeight: "100vh" }} />}>
      <HomeContent />
    </PageShell>
  );
}
