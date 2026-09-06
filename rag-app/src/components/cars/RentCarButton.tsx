"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocale } from "next-intl";
import { useActionState } from "react";
import { reservationCar } from "@/lib/actions";
import type { CarDTO } from "@/types/car";
import type { ReservationCarState } from "@/types/reservation";

type RentCarButtonProps = {
  car: CarDTO;
  pickUpLocationId: number;
  returnLocationId: number;
  pickupAt: string;
  returnAt: string;
  searchQuery?: string;
  labels: {
    rent: string;
    renting: string;
    rentSuccess: string;
    rentError: string;
    rentMissingDetails: string;
    rentNotAuthenticated: string;
    rentNoCustomerAccount: string;
    rentNotAvailable: string;
  };
};

const initialState: ReservationCarState = { status: "idle" };

export default function RentCarButton(props: RentCarButtonProps) {
  const {
    car,
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    returnAt,
    searchQuery = "",
    labels,
  } = props;
  const locale = useLocale();
  const rentSelectedCar = reservationCar.bind(null, { carId: car.id, locale });
  const [state, formAction, pending] = useActionState(
    rentSelectedCar,
    initialState,
  );
  const hasRentalPeriod = Boolean(
    pickUpLocationId && returnLocationId && pickupAt && returnAt,
  );

  const message =
    state.status === "success"
      ? labels.rentSuccess
      : state.error === "not-authenticated"
        ? labels.rentNotAuthenticated
        : state.error === "no-customer-account"
          ? labels.rentNoCustomerAccount
          : state.error === "not-available"
            ? labels.rentNotAvailable
            : state.status === "error"
              ? labels.rentError
              : !hasRentalPeriod
                ? labels.rentMissingDetails
                : null;

  return (
    <Stack
      component="form"
      action={formAction}
      spacing={1}
      sx={{ width: "100%" }}
    >
      <input type="hidden" name="pickUpLocationId" value={pickUpLocationId} />
      <input type="hidden" name="returnLocationId" value={returnLocationId} />
      <input type="hidden" name="pickupAt" value={pickupAt} />
      <input type="hidden" name="returnAt" value={returnAt} />
      <input type="hidden" name="searchQuery" value={searchQuery} />

      <Button
        type="submit"
        variant="contained"
        disabled={pending || !hasRentalPeriod}
      >
        {pending ? labels.renting : labels.rent}
      </Button>

      {message ? (
        <Typography
          variant="caption"
          color={state.status === "success" ? "success.main" : "text.secondary"}
          role={state.status === "error" ? "alert" : "status"}
        >
          {message}
        </Typography>
      ) : null}
    </Stack>
  );
}
