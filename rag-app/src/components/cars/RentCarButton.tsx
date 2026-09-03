"use client";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useActionState } from "react";
import { type RentCarState, rentCar } from "@/lib/actions";
import type { CarDTO } from "@/types/car";

type RentCarButtonProps = {
  car: CarDTO;
  pickupAt: string;
  returnAt: string;
  labels: {
    rent: string;
    renting: string;
    rentSuccess: string;
    rentError: string;
    rentMissingDetails: string;
    rentNotAuthenticated: string;
    rentNotAvailable: string;
  };
};

const initialState: RentCarState = { status: "idle" };

export default function RentCarButton({
  car,
  pickupAt,
  returnAt,
  labels,
}: RentCarButtonProps) {
  const rentSelectedCar = rentCar.bind(null, car.id);
  const [state, formAction, pending] = useActionState(
    rentSelectedCar,
    initialState,
  );
  const hasRentalPeriod = Boolean(pickupAt && returnAt);

  const message =
    state.status === "success"
      ? labels.rentSuccess
      : state.error === "not-authenticated"
        ? labels.rentNotAuthenticated
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
      <input type="hidden" name="location" value={car.location} />
      <input type="hidden" name="pickupAt" value={pickupAt} />
      <input type="hidden" name="returnAt" value={returnAt} />
      <input type="hidden" name="dailyRate" value={car.dailyRate} />
      <input type="hidden" name="status" value={car.status} />

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
