import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import {
  getCar,
  getLocations,
  getReservationOptions,
} from "@/lib/services/car";
import { reservationIdSchema as carIdSchema } from "@/lib/validation/reservation";
import type { ReservationDTO, ReservationOptions } from "@/types/reservation";
import { NewReservationFormLoading } from "../NewReservationForm";
import ReservationPageLayout from "../ReservationPageLayout";
import ReservationSearchBooking from "./ReservationSearchBooking";

type NewReservationPageProps = {
  params: Promise<{ locale: string; carId: string }>;
};

async function NewReservationContent(props: NewReservationPageProps) {
  const { locale, carId } = await props.params;
  const validatedCarId = carIdSchema.safeParse(carId);
  if (!validatedCarId.success) notFound();

  const [t, selectedCar, locations, availableOptions] = await Promise.all([
    getTranslations("Reservation"),
    getCar(validatedCarId.data),
    getLocations(),
    getReservationOptions().catch(() => null),
  ]);
  if (!selectedCar) notFound();

  const options: ReservationOptions = availableOptions ?? {
    mileagePackages: [
      {
        id: 1,
        name: t("included"),
        includedKmPerDay: null,
        pricePerDay: 0,
      },
    ],
    extras: [],
  };
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
    <ReservationSearchBooking
      locale={locale}
      locations={locations}
      reservation={reservation}
      options={options}
    />
  );
}

export default function NewReservationPageContent(
  props: NewReservationPageProps,
) {
  return (
    <ReservationPageLayout fallback={<NewReservationFormLoading />}>
      <NewReservationContent params={props.params} />
    </ReservationPageLayout>
  );
}
