export const TIME_ZONE = "Europe/Berlin";

export function isValidDateRange(pickupAt: string, returnAt: string) {
  return Date.parse(pickupAt) < Date.parse(returnAt);
}
