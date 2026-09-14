import { z } from "zod";

export const userProfileSchema = z.object({
  driverLicenseNumber: z.string().trim().min(1).max(100),
});
