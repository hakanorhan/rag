import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import CarCard from "@/components/cars/CarCard";
import { getAllCars } from "@/lib/cars";

type FleetContent = {
  articleText: string;
  articleTitle: string;
  description: string;
  empty: string;
  perDay: string;
  requestError: string;
  since: string;
  title: string;
};

export default async function FleetPageContent() {
  const [t, format, cars] = await Promise.all([
    getTranslations("Fleet"),
    getFormatter(),
    getAllCars().catch(() => null),
  ]);

  const content: FleetContent = {
    articleText: t("articleText"),
    articleTitle: t("articleTitle"),
    description: t("description"),
    empty: t("empty"),
    perDay: t("perDay"),
    requestError: t("requestError"),
    since: t("since"),
    title: t("title"),
  };

  const fleetCars = cars?.map((car) => ({
    car,
    location: t("location", { location: car.location.name }),
    minimumAge: t("minimumAge", { age: car.minimumAge }),
    price: format.number(car.dailyRate, {
      style: "currency",
      currency: "EUR",
    }),
    status: t(`status.${car.status}`),
  }));

  return (
    <>
      <Box
        component="section"
        sx={{
          minHeight: "70vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: 800 }}>
            <Typography
              component="p"
              color="primary.main"
              sx={{
                mb: 2,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Unser Fuhrpark
            </Typography>

            <Typography
              component="h1"
              variant="h2"
              sx={{
                mb: 3,
                fontWeight: 700,
              }}
            >
              Das passende Fahrzeug für jede Fahrt
            </Typography>

            <Typography
              color="text.secondary"
              sx={{
                fontSize: { xs: "1.1rem", md: "1.25rem" },
                lineHeight: 1.8,
                maxWidth: 720,
              }}
            >
              Entdecke unseren vielseitigen Fuhrpark und finde das Fahrzeug, das
              zu deinen Anforderungen passt. Von kompakten Fahrzeugen für den
              Alltag bis hin zu geräumigen Modellen für längere Reisen bieten
              wir dir eine sorgfältig ausgewählte Fahrzeugflotte.
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        {fleetCars === null ? (
          <Alert severity="error">{content.requestError}</Alert>
        ) : null}

        {fleetCars?.length === 0 ? (
          <Typography color="text.secondary">{content.empty}</Typography>
        ) : null}

        {fleetCars && fleetCars.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gridAutoRows: "max-content",
              gap: 3,
            }}
          >
            {fleetCars.map((fleetCar) => (
              <CarCard
                key={fleetCar.car.id}
                car={fleetCar.car}
                eyebrow={fleetCar.car.carType}
                title={fleetCar.car.carCategory}
                details={[
                  { id: "location", text: fleetCar.location },
                  { id: "minimum-age", text: fleetCar.minimumAge },
                  { id: "since", text: content.since },
                ]}
                price={`${fleetCar.price} ${content.perDay}`}
                statusColor={
                  fleetCar.car.status === "AVAILABLE" ? "success" : "default"
                }
                statusLabel={fleetCar.status}
              />
            ))}
          </Box>
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
    </>
  );
}
