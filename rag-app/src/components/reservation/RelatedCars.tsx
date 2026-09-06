import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";
import type { CarDTO } from "@/types/car";

export type RelatedCarsData = {
  cars: { car: CarDTO; price: string; minimumAge: string }[] | null;
  title: string;
  description: string;
  allResults: string;
  noRelated: string;
  error: string;
  searchHref: ComponentProps<typeof Link>["href"];
};

export default function RelatedCars({ data }: { data: RelatedCarsData }) {
  const { cars, searchHref } = data;
  if (cars === null) {
    return (
      <Box component="section" sx={{ mt: 6 }}>
        <Typography component="h2" variant="h5">
          {data.title}
        </Typography>
        <Typography role="status" color="text.secondary" sx={{ mt: 1 }}>
          {data.error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box component="section" aria-labelledby="related-title" sx={{ mt: 7 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{ justifyContent: "space-between", gap: 2, mb: 3 }}
      >
        <Box>
          <Typography
            component="h2"
            variant="h4"
            id="related-title"
            sx={{ fontSize: 28, fontWeight: 700 }}
          >
            {data.title}
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {data.description}
          </Typography>
        </Box>
        <Link
          href={searchHref}
          style={{ alignSelf: "start", whiteSpace: "nowrap" }}
        >
          <Button component="span">{data.allResults}</Button>
        </Link>
      </Stack>
      {cars.length === 0 ? (
        <Typography color="text.secondary">{data.noRelated}</Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {cars.map(({ car, price, minimumAge }) => (
            <Card variant="outlined" key={car.id} sx={{ borderRadius: 3 }}>
              {car.imageUrl ? (
                <CardMedia
                  component="img"
                  image={car.imageUrl}
                  alt={`${car.brand} ${car.model}`}
                  sx={{
                    height: 190,
                    objectFit: "contain",
                    p: 2,
                    bgcolor: "#fff",
                  }}
                />
              ) : null}
              <CardContent sx={{ px: 3 }}>
                <Typography variant="overline" color="text.secondary">
                  {car.carType}
                </Typography>
                <Typography
                  component="h3"
                  variant="h6"
                  sx={{ fontWeight: 650 }}
                >
                  {car.brand} {car.model}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  {car.location.name} · {minimumAge}
                </Typography>
                <Typography sx={{ fontWeight: 700, mt: 2 }}>{price}</Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
