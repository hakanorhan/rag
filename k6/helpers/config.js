export const stagesLoad = [
  { duration: "1m", target: 100 },
  { duration: "5m", target: 100 },
  { duration: "1m", target: 0 },
];

export const stagesSpike = [
  { duration: "30s", target: 10 },
  { duration: "1s", target: 200 },
  { duration: "1m", target: 200 },
  { duration: "30s", target: 10 },
  { duration: "30s", target: 0 },
];

export const stagesStress = [
  { duration: "2m", target: 100 },
  { duration: "3m", target: 150 },
  { duration: "3m", target: 200 },
  { duration: "1m", target: 200 },
  { duration: "1m", target: 0 },
];

export const stagesSoak = [
  { duration: "1m", target: 50 },
  { duration: "1m", target: 100 },
  { duration: "2h", target: 100 },
  { duration: "1m", target: 0 },
];

export const thresholds = {
  http_req_failed: ["rate<0.01"],
  checks: ["rate>0.99"],
  http_req_duration: ["p(95)<500", "p(99)<1000"],
};

export const reservationThresholds = {
  ...thresholds,
  reservation_creation_rate: ["rate>0.80"],
  reservation_conflict_rate: ["rate<0.20"],
};