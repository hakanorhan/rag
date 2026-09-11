import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default async function AboutPageContent() {
  const t = await getTranslations("About");
  const values = ["transparent", "reliable", "personal"] as const;

  return (
    <>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
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
            <Typography color="text.secondary" sx={{ fontSize: "1.125rem" }}>
              {t("intro")}
            </Typography>
          </Box>
          <Box sx={{width: {xs: "90%", lg: '600px' }, height: {xs: "300px", sm:'350px', md: "400px", lg: '400px'}, position:'relative'}}>
          <Image
            src="/optimized/office.webp"
            alt={t("imageAlt")}
            fill
            loading="eager"
          />
          </Box>
        </Stack>

        <Box component="section" sx={{ maxWidth: 820, py: { xs: 7, md: 10 } }}>
          <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
            {t("storyTitle")}
          </Typography>
          <Typography color="text.secondary">
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
                  <Typography color="text.secondary">
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
    </>
  );
}
