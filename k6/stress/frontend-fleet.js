import { sleep } from "k6";
import http from "k6/http";
import { stagesStress, thresholds } from "../helpers/config.js";
import { checkHttpResponse } from "../helpers/http-checks.js";
import { commonOptions } from "../helpers/options.js";
import { FRONTEND_URLS } from "../urls.js";

export const options = {
  ...commonOptions,
  stages: stagesStress,
  thresholds,
};

export default function () {
  const response = http.get(FRONTEND_URLS.fleet.de);
  checkHttpResponse(response, { name: "GET /de/fuhrpark" });
  sleep(1);
}
