import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ComponentProps } from "react";
import CarCard from "@/components/cars/CarCard";
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
          {cars.map(({ car, price, minimumAge }, index) => (
            <CarCard
              key={car.id}
              variant="related"
              car={car}
              price={price}
              minimumAge={minimumAge}
              imageLoading={index === 0 ? "eager" : "lazy"}
            />
          ))}
        </Box>
      )}
    </Box>
  );
}
