import type { ProblemDetail } from "@/lib/problemDetails";
import type { CarDTO } from "@/types/car";
import type { LocationDTO } from "@/types/location";

export type {
  ReservationCarRequest,
  ReservationOptionsRequest,
} from "@/lib/validation/reservation";

export type ReservationDTO = {
  reservationId: number;
  car: CarDTO;
  pickupLocation: LocationDTO;
  returnLocation: LocationDTO;
  pickupAt: string;
  returnAt: string;
  status: "RESERVED" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  dailyRate: number;
  totalPrice: number;
  rentalDays: number;
  mileagePackageId: number;
  includedKmPerDay: number | null;
  mileagePricePerDay: number;
  extras: ExtraOption[];
  searchQuery: string | null;
};

export type ExtraOption = {
  id: number;
  name: string;
  description: string | null;
  pricePerDay: number;
};

export type MileageOption = {
  id: number;
  name: string;
  includedKmPerDay: number | null;
  pricePerDay: number;
};

export type ReservationOptions = {
  mileagePackages: MileageOption[];
  extras: ExtraOption[];
};

export type ReservationOptionsState =
  | { status: "idle" }
  | { status: "success"; reservation?: ReservationDTO }
  | { status: "error"; problem: ProblemDetail };
