import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import CarCardFrame from "@/components/cars/CarCardFrame";
import type { CarDTO } from "@/types/car";

export type FleetCar = {
  car: CarDTO;
  location: string;
  minimumAge: string;
  price: string;
  status: string;
};

type FleetCarCardProps = {
  fleetCar: FleetCar;
  imageLoading: "eager" | "lazy";
  perDay: string;
  since: string;
};

export default function FleetCarCard(props: FleetCarCardProps) {
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
