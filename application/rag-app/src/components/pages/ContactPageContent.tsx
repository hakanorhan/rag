import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import Altcha from "@/components/Altcha";
import ContactForm from "@/components/contact/ContactForm";
import ToasterComponent from "@/components/ToasterComponent";
import { COMPANY_NAME } from "@/lib/branding";

export default async function ContactPageContent({
  locale,
  sent,
}: {
  locale: string;
  sent: boolean;
}) {
  const t = await getTranslations("Contact");

  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{ pb: { xs: 5, md: 8 }, minHeight: 640 }}
    >
      <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
        <Typography
          component="h1"
          variant="h3"
          color="primary.main"
          sx={{
            mb: 2,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {t("eyebrow")}
        </Typography>
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          {t("title")}
        </Typography>
        <Typography color="text.secondary" sx={{ fontSize: "1.125rem" }}>
          {t("intro")}
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        <Paper
          variant="outlined"
          sx={{ flex: 1, p: { xs: 3, md: 4 }, borderRadius: 3 }}
        >
          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
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
          <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
            {t("formTitle")}
          </Typography>
          <Stack spacing={2.5}>
            {sent && <ToasterComponent message={t("sent")} state="success" />}
            <input type="hidden" name="returnTo" value={`/${locale}/contact`} />
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
            <TextField
              name="subject"
              label={t("subject")}
              select
              required
              defaultValue="general"
              slotProps={{
                select: { MenuProps: { disableScrollLock: true } },
              }}
            >
              <MenuItem value="reservation">
                {t("subjects.reservation")}
              </MenuItem>
              <MenuItem value="vehicle">{t("subjects.vehicle")}</MenuItem>
              <MenuItem value="general">{t("subjects.general")}</MenuItem>
            </TextField>
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
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ alignSelf: "start" }}
            >
              {t("submit")}
            </Button>
          </Stack>
        </ContactForm>
      </Stack>
    </Container>
  );
}
