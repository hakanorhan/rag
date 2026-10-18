import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import ImageRender from "@/app/utils/imageRender";
import AppButton from "@/components/ui/AppButton";
import { Link } from "@/i18n/navigation";
import { COMPANY_NAME } from "@/lib/branding";

export default async function AboutPageContent() {
  const t = await getTranslations("About");
  const values = ["transparent", "reliable", "personal"] as const;

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h1" color="primary.main">
        {t("eyebrow", { companyName: COMPANY_NAME })}
      </Typography>
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={{ xs: 4, md: 8 }}
        sx={{ alignItems: "center" }}
      >
        <Box sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {t("title")}
          </Typography>
          <Typography variant="subtitle1" component="p" color="text.secondary">
            {t("intro", { companyName: COMPANY_NAME })}
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            width: "100%",
            position: "relative",
          }}
        >
          <ImageRender
            src="/optimized/office.webp"
            alt={t("imageAlt", { companyName: COMPANY_NAME })}
            objectFit="cover"
            loading="eager"
            fetchPriority="high"
          />
        </Box>
      </Stack>

      <Box component="section" sx={{ py: { xs: 7, md: 10 } }}>
        <Typography component="h2" variant="h5">
          {t("storyTitle")}
        </Typography>
        <Typography color="text.secondary">{t("storyText")}</Typography>
      </Box>

      <Box component="section" aria-labelledby="values-title">
        <Typography id="values-title" component="h2" variant="h5">
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
              <CardContent>
                <Typography component="h3" variant="h6">
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
          <AppButton component="span" sx={{ mt: 4 }}>
            {t("contact")}
          </AppButton>
        </Link>
      </Box>
    </Container>
  );
}
