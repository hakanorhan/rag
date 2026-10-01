import { findCars } from "@/app/actions/carSearch";
import CarSearchResults from "@/components/cars/CarSearchResults";
import { parseCarSearchState } from "@/lib/carSearch";
import type { CarsInterface } from "../../../messages/interfaces";

export default async function CarsPageContent({
  searchParams,
  content,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
  content: CarsInterface["content"];
}) {
  const searchState = parseCarSearchState(await searchParams);
  const result = await findCars(searchState);

  return <CarSearchResults content={content} result={result} />;
}
