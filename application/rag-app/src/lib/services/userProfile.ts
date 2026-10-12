import "server-only";

import { CAR_API_URL } from "@/lib/api";
import type { ProblemDetail } from "@/lib/problemDetails";
import type { UserProfile } from "@/types/userProfile";
import { getAuthenticatedFetch } from "./serverFetch";

export type UserProfileResult =
  | { status: "success"; profile: UserProfile }
  | {
      status: "error";
      problem: ProblemDetail;
    };

export async function getUserProfile(): Promise<UserProfileResult> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(`${CAR_API_URL}/users/me`, {
    cache: "no-store",
  });
  if (result.status === "error") return result;

  return { status: "success", profile: await result.response.json() };
}

export async function saveUserProfile(
  driverLicenseNumber: string,
): Promise<UserProfileResult> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(`${CAR_API_URL}/users/me`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ driverLicenseNumber }),
  });
  if (result.status === "error") return result;

  return { status: "success", profile: await result.response.json() };
}
