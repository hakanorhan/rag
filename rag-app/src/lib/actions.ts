"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export type RentCarState = {
  status: "idle" | "success" | "error";
  error?:
    | "invalid-request"
    | "not-authenticated"
    | "not-available"
    | "request-failed";
};

export async function login() {
  const result = await auth.api.signInSocial({
    headers: await headers(),
    body: {
      provider: "keycloak",
      callbackURL: "/",
    },
  });

  redirect(result.url as string);
}

export async function logout() {
  const result = await auth.api.signOut({
    headers: await headers(),
    body: {
      callbackURL: "/",
    },
  });

  redirect(result.url ?? "/");
}

export async function rentCar(
  carId: number,
  _previousState: RentCarState,
  formData: FormData,
): Promise<RentCarState> {
  const location = String(formData.get("location") ?? "").trim();
  const pickupAt = String(formData.get("pickupAt") ?? "");
  const returnAt = String(formData.get("returnAt") ?? "");
  const dailyRate = Number(formData.get("dailyRate"));
  const status = String(formData.get("status") ?? "");

  if (
    !Number.isSafeInteger(carId) ||
    carId <= 0 ||
    !location ||
    !pickupAt ||
    !returnAt ||
    !Number.isFinite(dailyRate) ||
    dailyRate <= 0 ||
    !["AVAILABLE", "RENTED", "MAINTENANCE"].includes(status)
  ) {
    return { status: "error", error: "invalid-request" };
  }

  const requestHeaders = await headers();
  const session = await auth.api.getSession({ headers: requestHeaders });

  if (!session) {
    return { status: "error", error: "not-authenticated" };
  }

  try {
    const accounts = await auth.api.listUserAccounts({
      headers: requestHeaders,
    });
    const keycloakAccount = accounts.find(
      (account) => account.providerId === "keycloak",
    );

    if (!keycloakAccount) {
      return { status: "error", error: "not-authenticated" };
    }

    const { accessToken } = await auth.api.getAccessToken({
      headers: requestHeaders,
      body: { accountId: keycloakAccount.id },
    });

    const response = await fetch(
      `${process.env.CAR_API_URL}/cars/${carId}/rentcar`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location,
          pickupAt,
          returnAt,
          dailyRate,
          status,
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { status: "error", error: "not-authenticated" };
      }

      if (response.status === 409) {
        return { status: "error", error: "not-available" };
      }

      return { status: "error", error: "request-failed" };
    }

    revalidatePath("/[locale]/cars", "page");
    return { status: "success" };
  } catch {
    return { status: "error", error: "request-failed" };
  }
}