import { commonOptions } from "../helpers/options.js";
import { sleep } from "k6";
import { checkHttpResponse } from "../helpers/http-checks.js";
import { searchCars } from "../helpers/search-cars.js";
import { stagesLoad, thresholds } from "./config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function () {
  const response = searchCars();
  checkHttpResponse(response, {
    name: "GET /cars/search",
  });

  sleep(1);
}