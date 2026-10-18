"use client";

import { useLocale } from "next-intl";
import AppButton from "@/components/ui/AppButton";
import { Link } from "@/i18n/navigation";
import { buildReservationCarHref } from "@/lib/carSearch";
import type { CarSearchState } from "@/lib/carSearchState";
import type { CarDTO } from "@/types/car";

type RentCarButtonProps = {
  car: CarDTO;
  pickUpLocationId: number;
  returnLocationId: number;
  pickupAt: string;
  returnAt: string;
  searchQuery?: string;
  mileagePackageId?: string;
  extraIds?: string;
  labels: {
    rent: string;
  };
};

export default function RentCarButton(props: RentCarButtonProps) {
  const {
    car,
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    returnAt,
    searchQuery = "",
    mileagePackageId = "",
    extraIds = "",
    labels,
  } = props;
  const locale = useLocale();
  const searchState: CarSearchState = {
    pickUpLocationId: String(pickUpLocationId),
    returnLocationId: String(returnLocationId),
    pickupAt,
    returnAt,
    query: searchQuery,
    mileagePackageId: mileagePackageId || undefined,
    extraIds: extraIds || undefined,
    searchType: searchQuery ? "freeText" : "criteria",
  };

  return (
    <Link
      href={buildReservationCarHref(car.id, searchState)}
      locale={locale}
      prefetch={false}
      aria-label={`${labels.rent}: ${car.carCategory}`}
      style={{ width: "100%" }}
    >
      <AppButton component="span" fullWidth>
        {labels.rent}
      </AppButton>
    </Link>
  );
}
