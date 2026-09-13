import { z } from "zod";

export const TIME_ZONE = "Europe/Berlin";
export const MIN_RENTAL_DURATION_MS = 2 * 60 * 60 * 1000;
export const instantSchema = z.iso.datetime({ offset: true });

export function isValidDateRange(pickupAt: string, returnAt: string) {
  return (
    instantSchema.safeParse(pickupAt).success &&
    instantSchema.safeParse(returnAt).success &&
    Date.parse(returnAt) - Date.parse(pickupAt) >= MIN_RENTAL_DURATION_MS
  );
}
