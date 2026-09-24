"use server";

import { revalidatePath } from "next/cache";
import { RedirectType, redirect } from "next/navigation";
import { hasLocale } from "next-intl";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import {
  createReservation,
  updateReservationOptions,
} from "@/lib/services/car";
import {
  reservationCarSchema,
  reservationOptionsSchema,
} from "@/lib/validation/reservation";
import type { ReservationOptionsState } from "@/types/reservation";

export async function reservationCar(
  context: { carId: number; locale: string },
  _previousState: ReservationOptionsState,
  formData: FormData,
): Promise<ReservationOptionsState> {
  const { carId, locale } = context;
  const idempotencyKey = formData.get("idempotencyKey");
  if (typeof idempotencyKey !== "string" || idempotencyKey.length === 0) {
    return {
      status: "error",
      problem: {
        type: "/problems/validation-error",
        status: 400,
        code: "VALIDATION_ERROR",
      },
    };
  }
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
    return {
      status: "error",
      problem: {
        type: "/problems/validation-error",
        status: 400,
        code: "VALIDATION_ERROR",
      },
    };
  }

  const result = await createReservation(input.data, idempotencyKey);
  if (result.status === "error") {
    return result;
  }

  revalidatePath("/[locale]/my-reservations", "page");
  redirect(
    getPathname({
      locale,
      href: {
        pathname: "/reservation-car/[reservationId]",
        params: { reservationId: String(result.reservationId) },
      },
    }),
    RedirectType.replace,
  );
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
    return {
      status: "error",
      problem: {
        type: "/problems/validation-error",
        status: 400,
        code: "VALIDATION_ERROR",
      },
    };
  }

  const result = await updateReservationOptions(input.data);
  if (result.status === "error") return result;

  revalidatePath("/[locale]/reservation-car/[reservationId]", "page");
  return result;
}
