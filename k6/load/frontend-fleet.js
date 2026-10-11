import { commonOptions } from "../helpers/options.js";
import http from "k6/http";
import { sleep } from "k6";
import { FRONTEND_URLS } from "../urls.js";
import { checkHttpResponse } from "../helpers/http-checks.js";
import { stagesLoad, thresholds } from "./config.js";

export const options = {
  ...commonOptions,
  stagesLoad,
  thresholds,
};

export default function fleet() {
  checkPage(FRONTEND_URLS.fleet.de, "/de/fuhrpark");
}

function checkPage(url, name) {
  const response = http.get(url, {
    tags: {
      name,
    },
  });

  checkHttpResponse(response, {
    name,
  });

  sleep(1);
}