import { getFormatter, getTranslations } from "next-intl/server";
import FleetPageContent, {
  type FleetContent,
} from "@/components/fleet/FleetPageContent";
import PageShell from "@/components/layout/PageShell";
import { getAllCars } from "@/lib/cars";

export default async function FleetPage() {
  const [t, format, cars] = await Promise.all([
    getTranslations("Fleet"),
    getFormatter(),
    getAllCars().catch(() => null),
  ]);

  const content: FleetContent = {
    articleText: t("articleText"),
    articleTitle: t("articleTitle"),
    description: t("description"),
    empty: t("empty"),
    perDay: t("perDay"),
    requestError: t("requestError"),
    since: t("since"),
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
    status: t(`status.${car.status}`),
  }));

  return (
    <PageShell>
      <FleetPageContent cars={fleetCars ?? null} content={content} />
    </PageShell>
  );
}
