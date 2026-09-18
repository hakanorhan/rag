import "server-only";

import { CAR_API_URL } from "@/lib/api";
import type { ProblemDetail } from "@/lib/problemDetails";
import { getSession } from "@/lib/session";
import type { UserProfile } from "@/types/userProfile";

export type UserProfileResult =
  | { status: "success"; profile: UserProfile }
  | {
      status: "error";
      problem: ProblemDetail;
    };

async function userProfileError(
  response: Response,
): Promise<UserProfileResult> {
  return {
    status: "error",
    problem: await response.json(),
  };
}

export async function getUserProfile(): Promise<UserProfileResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(`${CAR_API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) return userProfileError(response);

  return { status: "success", profile: await response.json() };
}

export async function saveUserProfile(
  driverLicenseNumber: string,
): Promise<UserProfileResult> {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error",
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(`${CAR_API_URL}/users/me`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ driverLicenseNumber }),
  });
  if (!response.ok) return userProfileError(response);

  return { status: "success", profile: await response.json() };
}
