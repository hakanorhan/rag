import { getTranslations } from "next-intl/server";
import Hero from "@/components/home/Hero";
import NewsArticle from "@/components/home/NewsArticle";
import PageShell from "@/components/layout/PageShell";
import type { HeroSearchInterface, NewsInterface } from "../../../messages/interfaces";
import NextIntersectionObserver from "@/app/NextIntersectionObserver";

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
      <NextIntersectionObserver
        rootmargin="0px"
        classes="my-element"
        topIn="top-in"
        topOut="top-out"
        bottomIn="bottom-in"
        bottomOut="bottom-out"
      >
        <NewsArticle article={news.article} />
      </NextIntersectionObserver>
    </>
  );
}

export default function Home() {
  return (
    <PageShell fallback={<main />}>
      <HomeContent />
    </PageShell>
  );
}
