import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import type { CarDTO } from "@/types/car";
import RentCarButton from "./RentCarButton";

type CarCardProps = {
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
};

export default function CarCard(props: CarCardProps) {
  const {
    car,
    labels,
    pickUpLocationId,
    returnLocationId,
    pickupAt,
    price,
    returnAt,
    searchQuery,
  } = props;
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
          {car.carType} · {car.location.name}
        </Typography>
        <Typography variant="body2">
          {price} {labels.perDay} · {labels.minimumAge} {car.minimumAge}{" "}
          {labels.years}
        </Typography>
        <Typography variant="body2">{car.status}</Typography>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2 }}>
        <RentCarButton
          car={car}
          pickUpLocationId={pickUpLocationId}
          returnLocationId={returnLocationId}
          pickupAt={pickupAt}
          returnAt={returnAt}
          searchQuery={searchQuery}
          labels={labels}
        />
      </CardActions>
    </Card>
  );
}
