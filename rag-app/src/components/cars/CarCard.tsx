import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { CarDTO } from "@/types/car";

type CarCardProps = {
  car: CarDTO;
  labels: {
    minimumAge: string;
    perDay: string;
    years: string;
  };
  price: string;
};

export default function CarCard({ car, labels, price }: CarCardProps) {
  return (
    <Card variant="outlined">
      {car.imageUrl ? (
        <CardMedia
          component="img"
          image={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          sx={{ height: 180 }}
        />
      ) : null}

      <CardContent>
        <Typography variant="h6">
          {car.brand} {car.model}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {car.carType} · {car.location}
        </Typography>
        <Typography variant="body2">
          {price} {labels.perDay} · {labels.minimumAge} {car.minimumAge}{" "}
          {labels.years}
        </Typography>
        <Typography variant="body2">{car.status}</Typography>
      </CardContent>
    </Card>
  );
}
