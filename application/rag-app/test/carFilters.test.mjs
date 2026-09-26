import assert from "node:assert/strict";
import { test } from "node:test";
import { filterAndSortCars } from "../src/lib/carFilters.ts";

const cars = [
  { id: "premium", car: { minimumAge: 25, dailyRate: 120 } },
  { id: "compact", car: { minimumAge: 18, dailyRate: 50 } },
  { id: "sport", car: { minimumAge: 21, dailyRate: 90 } },
];

const ids = (items) => items.map((item) => item.id);

test("filters cars by minimum age, including the selected age", () => {
  assert.deepEqual(ids(filterAndSortCars(cars, "21", "default")), [
    "compact",
    "sport",
  ]);
  assert.deepEqual(ids(filterAndSortCars(cars, "", "default")), [
    "premium",
    "compact",
    "sport",
  ]);
});

test("sorts filtered cars by price without changing the original list", () => {
  assert.deepEqual(ids(filterAndSortCars(cars, "25", "priceAscending")), [
    "compact",
    "sport",
    "premium",
  ]);
  assert.deepEqual(ids(filterAndSortCars(cars, "21", "priceDescending")), [
    "sport",
    "compact",
  ]);
  assert.deepEqual(ids(cars), ["premium", "compact", "sport"]);
});
