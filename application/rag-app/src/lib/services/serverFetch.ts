import "server-only";

import { type ProblemDetail, ProblemDetailError } from "@/lib/problemDetails";
import { getSession } from "@/lib/session";

type FetchResult =
  | { status: "success"; response: Response }
  | { status: "error"; problem: ProblemDetail };

function createClient(accessToken?: string) {
  async function request(input: string | URL, init?: RequestInit) {
    if (!accessToken) return fetch(input, init);

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    return fetch(input, { ...init, headers });
  }

  async function requestResult(
    input: string | URL,
    init?: RequestInit,
  ): Promise<FetchResult> {
    const response = await request(input, init);
    if (!response.ok) {
      return { status: "error", problem: await response.json() };
    }
    return { status: "success", response };
  }

  async function requestOrThrow(input: string | URL, init?: RequestInit) {
    const result = await requestResult(input, init);
    if (result.status === "error") {
      throw new ProblemDetailError(result.problem);
    }
    return result.response;
  }

  return { request, requestResult, requestOrThrow };
}

export const serverFetch = createClient();

export async function getAuthenticatedFetch() {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      } satisfies ProblemDetail,
    };
  }

  return { status: "success" as const, ...createClient(accessToken) };
}
