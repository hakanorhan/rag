import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import PageShell from "@/components/layout/PageShell";
import { Link } from "@/i18n/navigation";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const values = ["transparent", "reliable", "personal"] as const;

  return (
    <PageShell fallback={<Skeleton variant="rounded" height={400} />}>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 4, md: 8 }}
          sx={{ alignItems: "center" }}
        >
          <Box sx={{ flex: 1 }}>
            <Typography
              variant="overline"
              color="primary.main"
              sx={{ fontWeight: 800 }}
            >
              {t("eyebrow")}
            </Typography>
            <Typography component="h1" variant="h3" sx={{ mt: 1, mb: 2 }}>
              {t("title")}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ fontSize: "1.125rem", lineHeight: 1.75 }}
            >
              {t("intro")}
            </Typography>
          </Box>
          <Box
            sx={{
              position: "relative",
              width: { xs: 1, md: "48%" },
              aspectRatio: "4 / 3",
              overflow: "hidden",
              borderRadius: 3,
            }}
          >
            <Image
              src="/optimized/news.webp"
              alt={t("imageAlt")}
              fill
              sizes="(max-width: 900px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </Box>
        </Stack>

        <Box component="section" sx={{ maxWidth: 820, py: { xs: 7, md: 10 } }}>
          <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
            {t("storyTitle")}
          </Typography>
          <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
            {t("storyText")}
          </Typography>
        </Box>

        <Box component="section" aria-labelledby="values-title">
          <Typography
            id="values-title"
            component="h2"
            variant="h4"
            sx={{ mb: 3 }}
          >
            {t("valuesTitle")}
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
              gap: 3,
            }}
          >
            {values.map((value) => (
              <Card key={value} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography component="h3" variant="h6" sx={{ mb: 1 }}>
                    {t(`values.${value}.title`)}
                  </Typography>
                  <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {t(`values.${value}.text`)}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Link href="/contact">
            <Button component="span" variant="contained" sx={{ mt: 4 }}>
              {t("contact")}
            </Button>
          </Link>
        </Box>
      </Container>
    </PageShell>
  );
}
