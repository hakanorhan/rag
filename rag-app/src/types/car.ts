import type { LocationDTO } from "@/types/location";

export type CarDTO = {
  id: number;
  brand: string;
  model: string;
  carType: string;
  dailyRate: number;
  minimumAge: number;
  location: LocationDTO;
  imageUrl: string | null;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
};

export type CarSearchResponse = {
  cars: CarDTO[];
  pickupAt: string | null;
  returnAt: string | null;
};
