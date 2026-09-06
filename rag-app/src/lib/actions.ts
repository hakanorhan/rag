"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getPathname, redirect as localizedRedirect } from "@/i18n/navigation";
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
import type {
  ReservationCarState,
  ReservationOptionsState,
} from "@/types/reservation";

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
  _previousState: ReservationCarState,
  formData: FormData,
): Promise<ReservationCarState> {
  const { carId, locale } = context;
  const input = reservationCarSchema.safeParse({
    carId,
    pickUpLocationId: formData.get("pickUpLocationId"),
    returnLocationId: formData.get("returnLocationId"),
    pickupAt: formData.get("pickupAt"),
    returnAt: formData.get("returnAt"),
    searchQuery: formData.get("searchQuery") ?? undefined,
  });

  if (!hasLocale(routing.locales, locale) || !input.success) {
    return { status: "error", error: "invalid-request" };
  }

  const result = await createReservation(input.data);
  if (result.status === "error" && result.error === "not-authenticated") {
    const returnTo = getPathname({
      locale,
      href: {
        pathname: "/cars",
        query: {
          searchType: input.data.searchQuery ? "freeText" : "criteria",
          query: input.data.searchQuery,
          pickupAt: input.data.pickupAt,
          returnAt: input.data.returnAt,
          pickUpLocationId: input.data.pickUpLocationId,
          returnLocationId: input.data.returnLocationId,
        },
      },
    });
    redirect(getLoginUrl(returnTo));
  }
  if (result.status === "error") {
    return result;
  }

  revalidatePath("/[locale]/cars", "page");
  return localizedRedirect({
    href: {
      pathname: "/reservation-car/[reservationId]",
      params: { reservationId: String(result.reservationId) },
    },
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
