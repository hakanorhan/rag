import { commonOptions } from "../helpers/options.js";
import http from "k6/http";
import { check, sleep } from "k6";
import { FRONTEND_URLS } from "../urls.js";
import { stagesLoad, thresholds } from "../helpers/config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function () {
  const response = http.get(FRONTEND_URLS.cars.de.searchType, {
    tags: { name: "GET /de/autos?searchType=criteria" },
  });

  check(response, {
    "search page: status 200": (res) => res.status === 200,
  });

  sleep(1);
}