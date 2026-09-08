import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CarGrid from "@/components/cars/CarGrid";
import FleetCarCard, { type FleetCar } from "./FleetCarCard";

export type FleetContent = {
  articleText: string;
  articleTitle: string;
  description: string;
  empty: string;
  perDay: string;
  requestError: string;
  since: string;
  title: string;
};

type FleetPageContentProps = {
  cars: FleetCar[] | null;
  content: FleetContent;
};

export default function FleetPageContent(props: FleetPageContentProps) {
  const { cars, content } = props;

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
    >
      <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
        <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
          {content.title}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.125rem" }}>
          {content.description}
        </Typography>
      </Box>

      {cars === null ? (
        <Alert severity="error">{content.requestError}</Alert>
      ) : null}

      {cars?.length === 0 ? (
        <Typography color="text.secondary">{content.empty}</Typography>
      ) : null}

      {cars && cars.length > 0 ? (
        <CarGrid>
          {cars.map((fleetCar, index) => (
            <FleetCarCard
              key={fleetCar.car.id}
              fleetCar={fleetCar}
              imageLoading={index === 0 ? "eager" : "lazy"}
              perDay={content.perDay}
              since={content.since}
            />
          ))}
        </CarGrid>
      ) : null}

      <Box
        component="section"
        sx={{
          mt: { xs: 6, md: 9 },
          maxWidth: 820,
          borderTop: 3,
          borderColor: "primary.main",
          pt: 3,
        }}
      >
        <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
          {content.articleTitle}
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {content.articleText}
        </Typography>
      </Box>
    </Container>
  );
}
