export type CarDTO = {
  id: number;
  brand: string;
  model: string;
  carType: string;
  dailyRate: number;
  minimumAge: number;
  location: string;
  imageUrl: string | null;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
};
