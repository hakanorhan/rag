import "server-only";

const serviceUrls = {
  ai: process.env.AI_API_URL ?? "http://aiservice:8081/api/ai",
  car: process.env.CAR_API_URL ?? "http://carservice:8080",
};

export type ApiService = keyof typeof serviceUrls;
export type ApiRequest = RequestInit & {
  service: ApiService;
  path: string;
  accessToken?: string;
  json?: unknown;
};

export function apiFetch(input: ApiRequest) {
  const { service, path, accessToken, json, ...options } = input;
  const headers = new Headers(options.headers);
  if (accessToken) headers.set("Authorization", `Bearer ${accessToken}`);
  if (json !== undefined) headers.set("Content-Type", "application/json");
  headers.set("Accept", "application/json, application/problem+json");

  const url = new URL(path, `${serviceUrls[service].replace(/\/$/, "")}/`);
  return fetch(url, {
    ...options,
    headers,
    body: json === undefined ? options.body : JSON.stringify(json),
    cache: "no-store",
  });
}
