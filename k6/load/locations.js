import { commonOptions } from "../helpers/options.js";
import http from "k6/http";
import { check, sleep } from "k6";
import { CARSERVICE_URLS } from "../urls.js";
import { stagesLoad, thresholds } from "./config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function () {
  const response = http.get(CARSERVICE_URLS.locations, {
    tags: { name: "GET /locations" },
  });

  check(response, {
    "locations: status 200": (res) => res.status === 200,
  });

  sleep(1);
}