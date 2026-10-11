import { commonOptions } from "../helpers/options.js";
import { sleep } from "k6";
import { reserveCar, setupReservation } from "../helpers/reserve-car.js";
import { stagesLoad, reservationThresholds as thresholds } from "./config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export function setup() {
  return setupReservation();
}

export default function (data) {
  // Antwortzeiten werden über die gemeinsamen Thresholds bewertet.
  reserveCar(data, null);
  sleep(1);
}