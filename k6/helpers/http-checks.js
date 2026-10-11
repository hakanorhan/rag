import { check } from "k6";

export const thresholds = {
  http_req_failed: ["rate<0.01"],
  http_req_duration: ["p(95)<200"],
};

export function checkHttpResponse(
  response,
  {
    name,
    statuses = [200],
    maxDurationMs,
  } = {}
) {
  const checks = {};

  const statusCheckName = name + ": status ok";

  checks[statusCheckName] = (response) =>
    statuses.includes(response.status);

  if (maxDurationMs != null) {
    const durationCheckName =
      name + ": duration <= " + maxDurationMs + "ms";

    checks[durationCheckName] = (response) =>
      response.timings.duration <= maxDurationMs;
  }

  check(response, checks);
}