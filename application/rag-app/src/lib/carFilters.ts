import type { CarDTO } from "@/types/car";

export type CarSortOrder = "default" | "priceAscending" | "priceDescending";

type FilterableCar = {
  car: Pick<CarDTO, "dailyRate" | "minimumAge">;
};

export function filterAndSortCars<T extends FilterableCar>(
  cars: readonly T[],
  age: string,
  sortOrder: CarSortOrder,
) {
  const filteredCars =
    age === "" || age === "all"
      ? [...cars]
      : cars.filter((item) => item.car.minimumAge <= Number(age));

  if (sortOrder === "default") return filteredCars;

  return filteredCars.sort((first, second) =>
    sortOrder === "priceAscending"
      ? first.car.dailyRate - second.car.dailyRate
      : second.car.dailyRate - first.car.dailyRate,
  );
}
