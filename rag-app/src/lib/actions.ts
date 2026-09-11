"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { redirect as localizedRedirect } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import {
  createReservation,
  updateReservationOptions,
} from "@/lib/reservations";
import { getLoginUrl } from "@/lib/session";
import {
  reservationCarSchema,
  reservationOptionsSchema,
} from "@/lib/validation/reservation";
import type { ReservationOptionsState } from "@/types/reservation";

export async function login() {
  const returnTo = (await headers()).get("referer") ?? "/";
  redirect(getLoginUrl(returnTo));
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

export async function reservationCar(
  context: { carId: number; locale: string },
  _previousState: ReservationOptionsState,
  formData: FormData,
): Promise<ReservationOptionsState> {
  const { carId, locale } = context;
  const input = reservationCarSchema.safeParse({
    carId,
    pickUpLocationId: formData.get("pickUpLocationId"),
    returnLocationId: formData.get("returnLocationId"),
    pickupAt: formData.get("pickupAt"),
    returnAt: formData.get("returnAt"),
    mileagePackageId: formData.get("mileagePackageId"),
    extraIds: formData.getAll("extraIds"),
    searchQuery: formData.get("searchQuery") ?? undefined,
  });

  if (!hasLocale(routing.locales, locale) || !input.success) {
    return { status: "error", error: "invalid" };
  }

  const result = await createReservation(input.data);
  if (result.status === "error") {
    return {
      status: "error",
      error:
        result.error === "not-authenticated" ? "notAuthenticated" : "saveError",
    };
  }

  revalidatePath("/[locale]/my-reservations", "page");
  return localizedRedirect({
    href: "/my-reservations",
    locale,
  });
}

export async function saveReservationOptions(
  reservationId: number,
  _previousState: ReservationOptionsState,
  formData: FormData,
): Promise<ReservationOptionsState> {
  const input = reservationOptionsSchema.safeParse({
    reservationId,
    mileagePackageId: formData.get("mileagePackageId"),
    extraIds: formData.getAll("extraIds"),
  });
  if (!input.success) {
    return { status: "error", error: "invalid" };
  }

  const result = await updateReservationOptions(input.data);
  if (result.status === "error") return result;

  revalidatePath("/[locale]/reservation-car/[reservationId]", "page");
  return result;
}
