import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";

export default async function ContactPageContent() {
  const t = await getTranslations("Contact");

  return (
    <>
      <Container
        component="main"
        maxWidth="lg"
        sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
      >
        <Box sx={{ maxWidth: 760, mb: { xs: 4, md: 6 } }}>
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

        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          <Paper
            variant="outlined"
            sx={{ flex: 1, p: { xs: 3, md: 4 }, borderRadius: 3 }}
          >
            <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
              {t("detailsTitle")}
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

          <Paper
            component="form"
            action={`mailto:${t("email")}`}
            method="post"
            encType="text/plain"
            variant="outlined"
            sx={{ flex: 1.4, p: { xs: 3, md: 4 }, borderRadius: 3 }}
          >
            <Typography component="h2" variant="h5" sx={{ mb: 3 }}>
              {t("formTitle")}
            </Typography>
            <Stack spacing={2.5}>
              <TextField
                name="name"
                label={t("name")}
                autoComplete="name"
                required
              />
              <TextField
                name="email"
                type="email"
                label={t("emailLabel")}
                autoComplete="email"
                required
              />
              <TextField
                name="subject"
                label={t("subject")}
                select
                required
                defaultValue="general"
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
              />
              <Typography variant="body2" color="text.secondary">
                {t("privacy")}
              </Typography>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{ alignSelf: "start" }}
              >
                {t("submit")}
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </>
  );
}
