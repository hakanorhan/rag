import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import NewsArticle from "@/components/home/NewsArticle";
import AppBar from "@/components/layout/AppBarServer";
import Footer from "@/components/layout/Footer";
import type {
  HeroSearchInterface,
  NewsInterface,
} from "../../../messages/interfaces";

export default async function Home() {
  const newsTranslation = await getTranslations("News");
  const heroTranslation = await getTranslations("HeroSearch");
  const news: NewsInterface = {
    article: newsTranslation.raw("article"),
  };
  const hero: HeroSearchInterface = {
    search: heroTranslation.raw("search"),
  };

  return (
    <>
      <AppBar backgroundColor="transparent" />
      <Hero search={hero.search} />
      <NewsArticle article={news.article} />
      <Footer />
    </>
  );
}
