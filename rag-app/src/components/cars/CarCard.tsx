import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
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
  imageLoading?: "eager" | "lazy";
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
    imageLoading,
  } = props;
  return (
    <Card variant="outlined">
      {car.imageUrl ? (
        <ImageWithSkeleton
          src={car.imageUrl}
          alt={`${car.brand} ${car.model}`}
          sx={{ height: 180 }}
          sizes="(max-width: 600px) 100vw, 33vw"
          loading={imageLoading}
          style={{ objectFit: "cover" }}
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
