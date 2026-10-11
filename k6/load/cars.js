import { commonOptions } from "../helpers/options.js";
import http from "k6/http";
import { sleep } from "k6";
import { CARSERVICE_URLS } from "../urls.js";
import { checkHttpResponse } from "../helpers/http-checks.js";
import { stagesLoad, thresholds } from "../helpers/config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function () {
  const response = http.get(CARSERVICE_URLS.cars);
  checkHttpResponse(response, {
    name: "GET /cars",
  });

  sleep(1);
}