import { z } from "zod";

export const TIME_ZONE = "Europe/Berlin";
export const instantSchema = z.iso.datetime({ offset: true });

export function isValidDateRange(pickupAt: string, returnAt: string) {
  return (
    instantSchema.safeParse(pickupAt).success &&
    instantSchema.safeParse(returnAt).success &&
    Date.parse(pickupAt) < Date.parse(returnAt)
  );
}
