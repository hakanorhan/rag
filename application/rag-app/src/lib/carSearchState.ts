import { z } from "zod";
import type { ProblemDetail } from "@/lib/problemDetails";
import type { CarDTO } from "@/types/car";

export const carSearchStateSchema = z.object({
  pickUpLocationId: z.string(),
  returnLocationId: z.string(),
  pickupAt: z.string(),
  returnAt: z.string(),
  query: z.string(),
  searchType: z.enum(["criteria", "freeText"]),
  searchId: z.string().optional(),
  mileagePackageId: z.string().optional(),
  extraIds: z.string().optional(),
});

export type CarSearchState = z.infer<typeof carSearchStateSchema>;

export type CarSearchResult =
  | { status: "error"; problem: ProblemDetail }
  | { status: "success"; cars: CarDTO[]; searchState: CarSearchState };
