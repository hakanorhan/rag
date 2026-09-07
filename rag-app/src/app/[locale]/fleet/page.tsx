import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getFormatter, getTranslations } from "next-intl/server";
import ImageWithSkeleton from "@/components/ImageWithSkeleton";
import PageShell from "@/components/layout/PageShell";
import { getAllCars } from "@/lib/cars";

export default async function FleetPage() {
  const [t, format, cars] = await Promise.all([
    getTranslations("Fleet"),
    getFormatter(),
    getAllCars().catch(() => null),
  ]);

  return (
    <PageShell>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
          <Typography component="h1" variant="h3" sx={{ mb: 2 }}>
            {t("title")}
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: "1.125rem" }}>
            {t("description")}
          </Typography>
        </Box>

        {cars === null ? (
          <Alert severity="error">{t("requestError")}</Alert>
        ) : null}

        {cars?.length === 0 ? (
          <Typography color="text.secondary">{t("empty")}</Typography>
        ) : null}

        {cars && cars.length > 0 ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, minmax(0, 1fr))",
                md: "repeat(3, minmax(0, 1fr))",
              },
              gap: 3,
            }}
          >
            {cars.map((car, index) => (
              <Card
                key={car.id}
                variant="outlined"
                sx={{ height: "100%", borderRadius: 3 }}
              >
                {car.imageUrl ? (
                  <ImageWithSkeleton
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.model}`}
                    sx={{
                      height: 210,
                      bgcolor: "#fff",
                    }}
                    sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    style={{
                      objectFit: "contain",
                      padding: 16,
                      backgroundColor: "#fff",
                    }}
                  />
                ) : null}
                <CardContent sx={{ p: 3 }}>
                  <Stack
                    direction="row"
                    spacing={2}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: "start",
                    }}
                  >
                    <Box>
                      <Typography variant="overline" color="text.secondary">
                        {car.carType}
                      </Typography>
                      <Typography
                        component="h2"
                        variant="h5"
                        sx={{ fontWeight: 700 }}
                      >
                        {car.brand} {car.model}
                      </Typography>
                    </Box>
                    <Chip
                      size="small"
                      color={car.status === "AVAILABLE" ? "success" : "default"}
                      label={t(`status.${car.status}`)}
                    />
                  </Stack>
                  <Stack spacing={0.75} sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      {t("location", { location: car.location.name })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("minimumAge", { age: car.minimumAge })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t("since")}
                    </Typography>
                  </Stack>
                  <Typography sx={{ mt: 2.5, fontWeight: 700 }}>
                    {format.number(car.dailyRate, {
                      style: "currency",
                      currency: "EUR",
                    })}{" "}
                    {t("perDay")}
                  </Typography>
                </CardContent>
              </Card>
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
            {t("articleTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t("articleText")}
          </Typography>
        </Box>
      </Container>
    </PageShell>
  );
}
