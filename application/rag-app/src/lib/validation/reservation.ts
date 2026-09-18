import { z } from "zod";
import { instantSchema, isValidDateRange } from "@/lib/dateTime";

export const reservationIdSchema = z.coerce.number().int().positive();

export const reservationCarSchema = z
  .object({
    carId: z.number().int().positive(),
    pickUpLocationId: z.coerce.number().int().positive(),
    returnLocationId: z.coerce.number().int().positive(),
    pickupAt: instantSchema,
    returnAt: instantSchema,
    mileagePackageId: z.coerce.number().int().positive(),
    extraIds: z.array(z.coerce.number().int().positive()).max(20),
    searchQuery: z.string().trim().max(500).optional(),
  })
  .refine((input) => isValidDateRange(input.pickupAt, input.returnAt), {
    message: "Return time must be after pickup time",
    path: ["returnAt"],
  });

export type ReservationCarRequest = z.infer<typeof reservationCarSchema>;

export const reservationOptionsSchema = z.object({
  reservationId: reservationIdSchema,
  mileagePackageId: z.coerce.number().int().positive(),
  extraIds: z.array(z.coerce.number().int().positive()).max(20),
});

export type ReservationOptionsRequest = z.infer<
  typeof reservationOptionsSchema
>;
