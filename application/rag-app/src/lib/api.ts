import "server-only";

export const AI_API_URL =
  process.env.AI_API_URL ?? "http://aiservice:8081/api/ai";

export const CAR_API_URL = process.env.CAR_API_URL ?? "http://carservice:8080";
