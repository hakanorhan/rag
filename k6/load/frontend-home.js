import { commonOptions } from "../helpers/options.js";
import http from "k6/http";
import { check, sleep } from "k6";
import { FRONTEND_URLS } from "../urls.js";
import { stagesLoad, thresholds } from "./config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function () {
  const response = http.get(FRONTEND_URLS.home.de, {
    tags: { name: "GET /de" },
  });

  check(response, {
    "home page: status 200": (res) => res.status === 200,
  });

  sleep(1);
}