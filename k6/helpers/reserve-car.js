import http from "k6/http";
import exec from "k6/execution";
import { Rate } from "k6/metrics";
import { CARSERVICE_URLS } from "../urls.js";
import { checkHttpResponse } from "./http-checks.js";
import { ACCESS_TOKEN } from "./access-token.js";

const DEFAULT_START = "2026-12-24T09:30:00.000Z";
const DAY_MS = 86_400_000;

const creationRate = new Rate("reservation_creation_rate");
const conflictRate = new Rate("reservation_conflict_rate");

http.setResponseCallback(http.expectedStatuses(200, 409));

export function setupReservation() {
  if (!ACCESS_TOKEN) {
    throw new Error("Set ACCESS_TOKEN in helpers/access-token.js before running this test.");
  }

  // Die bestehenden Setup-Abfragen benötigen ihre JSON-Testdaten.
  const carsResponse = http.get(CARSERVICE_URLS.cars, { responseType: "text" });
  const cars = carsResponse
    .json()
    .filter(
      (car) => car.status === "AVAILABLE" && car.id && car.location?.locationId,
    )
    .map((car) => ({
      carId: car.id,
      locationId: car.location.locationId,
    }));

  if (cars.length < 2) {
    throw new Error("At least two available cars with locations are required.");
  }

  const reservationOptionsResponse = http.get(
    CARSERVICE_URLS.reservationOptions,
    { responseType: "text" },
  );

  const mileagePackageId =
    reservationOptionsResponse.json().mileagePackages?.[0]?.id;

  if (!mileagePackageId) {
    throw new Error("No mileage package was found.");
  }

  const start = __ENV.K6_RESERVATION_START || DEFAULT_START;

  const startAt = Date.parse(start);

  if (!Number.isFinite(startAt) || startAt <= Date.now()) {
    throw new Error("K6_RESERVATION_START must be a future date.");
  }

  return {
    cars,
    mileagePackageId,
    startAt,
  };
}

export function reserveCar(data, maxDurationMs = 200) {
  const sequence = exec.scenario.iterationInTest;

  const carIndex = sequence % data.cars.length;

  const car = data.cars[carIndex];

  const scenarioDayOffset = data.dayOffsets?.[exec.scenario.name] || 0;

  const reservationDay =
    scenarioDayOffset + Math.floor(sequence / data.cars.length);

  const pickupAt = data.startAt + reservationDay * DAY_MS;

  const returnAt = pickupAt + DAY_MS;

  const body = JSON.stringify({
    carId: car.carId,
    pickUpLocationId: car.locationId,
    returnLocationId: car.locationId,
    pickupAt: new Date(pickupAt).toISOString(),
    returnAt: new Date(returnAt).toISOString(),
    mileagePackageId: data.mileagePackageId,
    extraIds: [],
  });

  const authorization = "Bearer " + ACCESS_TOKEN;

  const idempotencyKey = "k6-" + Date.now() + "-" + __VU + "-" + __ITER;

  const response = http.post(CARSERVICE_URLS.reservations, body, {
    headers: {
      Authorization: authorization,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
  });

  checkHttpResponse(response, {
    name: "POST /reservations",
    statuses: [200, 409],
    maxDurationMs,
  });

  const isCreated = response.status === 200;

  const isConflict = response.status === 409;

  creationRate.add(isCreated);
  conflictRate.add(isConflict);

  if (response.status === 401) {
    exec.test.abort("Access token rejected.");
  }

  return response;
}