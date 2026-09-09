import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { CarDTO } from "@/types/car";
import CarCardFrame from "./CarCardFrame";
import RentCarButton from "./RentCarButton";

export type FleetCar = {
  car: CarDTO;
  location: string;
  minimumAge: string;
  price: string;
  status: string;
};

type SearchCarCardProps = {
  car: CarDTO;
  labels: {
    minimumAge: string;
    perDay: string;
    rent: string;
    renting: string;
    rentSuccess: string;
    rentError: string;
    rentMissingDetails: string;
    rentNotAuthenticated: string;
    rentNoCustomerAccount: string;
    rentNotAvailable: string;
    years: string;
  };
  pickUpLocationId: number;
  returnLocationId: number;
  pickupAt: string;
  price: string;
  returnAt: string;
  searchQuery?: string;
  imageLoading?: "eager" | "lazy";
  variant?: "search";
};

type FleetCarCardProps = {
  fleetCar: FleetCar;
  imageLoading: "eager" | "lazy";
  perDay: string;
  since: string;
  variant: "fleet";
};

type RelatedCarCardProps = {
  car: CarDTO;
  imageLoading?: "eager" | "lazy";
  minimumAge: string;
  price: string;
  variant: "related";
};

type CarCardProps =
  | SearchCarCardProps
  | FleetCarCardProps
  | RelatedCarCardProps;

export default function CarCard(props: CarCardProps) {
  if (props.variant === "fleet") {
    const { fleetCar, imageLoading, perDay, since } = props;
    const { car, location, minimumAge, price, status } = fleetCar;

    return (
      <CarCardFrame
        car={car}
        imageLoading={imageLoading}
        imageSizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
        imageStyle={{
          objectFit: "contain",
          padding: 16,
          backgroundColor: "#fff",
        }}
        imageSx={{ height: 210, bgcolor: "#fff" }}
        cardSx={{ height: "100%", borderRadius: 3 }}
        contentSx={{ p: 3 }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ justifyContent: "space-between", alignItems: "start" }}
        >
          <Box>
            <Typography variant="overline" color="text.secondary">
              {car.carType}
            </Typography>
            <Typography component="h2" variant="h5" sx={{ fontWeight: 700 }}>
              {car.brand} {car.model}
            </Typography>
          </Box>
          <Chip
            size="small"
            color={car.status === "AVAILABLE" ? "success" : "default"}
            label={status}
          />
        </Stack>
        <Stack spacing={0.75} sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {location}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {minimumAge}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {since}
          </Typography>
        </Stack>
        <Typography sx={{ mt: 2.5, fontWeight: 700 }}>
          {price} {perDay}
        </Typography>
      </CarCardFrame>
    );
  }

  if (props.variant === "related") {
    const { car, imageLoading, minimumAge, price } = props;

    return (
      <CarCardFrame
        car={car}
        imageLoading={imageLoading}
        imageSizes="(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw"
        imageStyle={{
          objectFit: "contain",
          padding: 16,
          backgroundColor: "#fff",
        }}
        imageSx={{ height: 190, bgcolor: "#fff" }}
        cardSx={{ borderRadius: 3 }}
        contentSx={{ px: 3 }}
      >
        <Typography variant="overline" color="text.secondary">
          {car.carType}
        </Typography>
        <Typography component="h3" variant="h6" sx={{ fontWeight: 650 }}>
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {car.location.name} · {minimumAge}
        </Typography>
        <Typography sx={{ fontWeight: 700, mt: 2 }}>{price}</Typography>
      </CarCardFrame>
    );
  }

  const {
    car,
    labels,
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    price,
    returnAt,
    searchQuery,
    imageLoading,
  } = props;

  return (
    <CarCardFrame
      car={car}
      imageLoading={imageLoading}
      imageSizes="(max-width: 600px) 100vw, 33vw"
      imageStyle={{ objectFit: "cover" }}
      imageSx={{ height: 180 }}
      actionsSx={{ px: 2, pb: 2 }}
      actions={
        <RentCarButton
          car={car}
          pickUpLocationId={pickUpLocationId}
          returnLocationId={returnLocationId}
          pickupAt={pickupAt}
          returnAt={returnAt}
          searchQuery={searchQuery}
          labels={labels}
        />
      }
    >
      <Typography variant="h6">
        {car.brand} {car.model}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {car.carType} · {car.location.name}
      </Typography>
      <Typography variant="body2">
        {price} {labels.perDay} · {labels.minimumAge} {car.minimumAge}{" "}
        {labels.years}
      </Typography>
      <Typography variant="body2">{car.status}</Typography>
    </CarCardFrame>
  );
}
