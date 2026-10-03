import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import Altcha from "@/components/Altcha";
import ButtonComponent from "@/components/ButtonComponent";
import ContactForm from "@/components/contact/ContactForm";
import ContactSentToast from "@/components/contact/ContactSentToast";
import SelectComponent from "@/components/SelectComponent";
import { getPathname } from "@/i18n/navigation";
import { COMPANY_NAME } from "@/lib/branding";

export default async function ContactPageContent({
  locale,
}: {
  locale: string;
}) {
  const t = await getTranslations("Contact");
  const returnTo = getPathname({ locale, href: "/contact" });

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="h1" color="primary.main">
          {t("eyebrow")}
        </Typography>
        <Typography component="h2" variant="h5">
          {t("title")}
        </Typography>
        <Typography variant="subtitle1" component="p" color="text.secondary">
          {t("intro")}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Paper component="section" variant="outlined" sx={{ flex: 1 }}>
          <Typography component="h2" variant="h5">
            {t("detailsTitle", { companyName: COMPANY_NAME })}
          </Typography>
          <Stack spacing={1.5} color="text.secondary">
            <Typography>{t("address")}</Typography>
            <Typography
              component="a"
              href={`tel:${t("phone").replaceAll(" ", "")}`}
            >
              {t("phone")}
            </Typography>
            <Typography component="a" href={`mailto:${t("email")}`}>
              {t("email")}
            </Typography>
            <Typography>{t("hours")}</Typography>
          </Stack>
        </Paper>

        <ContactForm
          requiredError={t("errors.required")}
          emailError={t("errors.email")}
        >
          <Typography component="h2" variant="h5">
            {t("formTitle")}
          </Typography>
          <Stack spacing={2.5}>
            <Suspense fallback={null}>
              <ContactSentToast message={t("sent")} />
            </Suspense>
            <input type="hidden" name="returnTo" value={returnTo} />
            <TextField
              name="name"
              label={t("name")}
              autoComplete="name"
              required
              slotProps={{ htmlInput: { maxLength: 100 } }}
            />
            <TextField
              name="email"
              type="email"
              label={t("emailLabel")}
              autoComplete="email"
              required
              slotProps={{ htmlInput: { maxLength: 254 } }}
            />
            <SelectComponent
              name="subject"
              label={t("subject")}
              required
              defaultValue="general"
            >
              <MenuItem value="reservation">
                {t("subjects.reservation")}
              </MenuItem>
              <MenuItem value="vehicle">{t("subjects.vehicle")}</MenuItem>
              <MenuItem value="general">{t("subjects.general")}</MenuItem>
            </SelectComponent>
            <TextField
              name="message"
              label={t("message")}
              multiline
              minRows={6}
              required
              slotProps={{ htmlInput: { maxLength: 4000 } }}
            />
            <Typography variant="body2" color="text.secondary">
              {t("privacy")}
            </Typography>
            <Altcha locale={locale} />
            <ButtonComponent type="submit" sx={{ alignSelf: "start" }}>
              {t("submit")}
            </ButtonComponent>
          </Stack>
        </ContactForm>
      </Stack>
    </Container>
  );
}
