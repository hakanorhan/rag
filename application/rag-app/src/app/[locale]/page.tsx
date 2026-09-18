import { getTranslations } from "next-intl/server";
import Hero from "@/components/cars/Hero";
import NewsArticle from "@/components/cars/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import { getLocations } from "@/lib/services/car";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

export default async function Home() {
  const [newsTranslation, heroTranslation, locations] = await Promise.all([
    getTranslations("News"),
    getTranslations("HeroSearch"),
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
    <PageShell>
      <Hero title={hero.title} search={hero.search} locations={locations} />
      <NewsArticle article={news.article} />
    </PageShell>
  );
}
