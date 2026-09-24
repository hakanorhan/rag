import Container from "@mui/material/Container";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import {
  getAllCars,
  getLocations,
  getPaypalClientId,
  getReservationOptions,
} from "@/lib/services/car";
import { reservationIdSchema as carIdSchema } from "@/lib/validation/reservation";
import type { ReservationDTO, ReservationOptions } from "@/types/reservation";
import ReservationSearchBooking from "./ReservationSearchBooking";

type NewReservationPageProps = {
  params: Promise<{ locale: string; carId: string }>;
};

export default async function NewReservationPageContent(
  props: NewReservationPageProps,
) {
  const { locale, carId } = await props.params;
  const validatedCarId = carIdSchema.safeParse(carId);
  if (!validatedCarId.success) notFound();

  const t = await getTranslations("Reservation");
  const [cars, locations, paypalClientId] = await Promise.all([
    getAllCars(),
    getLocations(),
    getPaypalClientId().catch(() => ""),
  ]);
  const selectedCar = cars.find((car) => car.id === validatedCarId.data);
  if (!selectedCar) notFound();

  const options = await getReservationOptions().catch(
    (): ReservationOptions => ({
      mileagePackages: [
        {
          id: 1,
          name: t("included"),
          includedKmPerDay: null,
          pricePerDay: 0,
        },
      ],
      extras: [],
    }),
  );
  const includedMileagePackage = options.mileagePackages[0];
  const reservation: ReservationDTO = {
    reservationId: selectedCar.id,
    car: selectedCar,
    pickupLocation: selectedCar.location,
    returnLocation: selectedCar.location,
    pickupAt: "",
    returnAt: "",
    status: "RESERVED",
    dailyRate: selectedCar.dailyRate,
    totalPrice: 0,
    rentalDays: 0,
    mileagePackageId: includedMileagePackage?.id ?? 1,
    includedKmPerDay: includedMileagePackage?.includedKmPerDay ?? null,
    mileagePricePerDay: includedMileagePackage?.pricePerDay ?? 0,
    extras: [],
    searchQuery: null,
  };

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ pb: { xs: 3, md: 5 }, minHeight: 640 }}
    >
      <Suspense fallback={null}>
        <ReservationSearchBooking
          locale={locale}
          locations={locations}
          reservation={reservation}
          options={options}
          paypalClientId={paypalClientId}
        />
      </Suspense>
    </Container>
  );
}
