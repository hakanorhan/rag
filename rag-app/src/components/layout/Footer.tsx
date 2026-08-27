import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import type { FooterInterface } from "../../../messages/interfaces";
import SocialLogins from "./SocialLogins";

export default function Footer() {
  const translation = useTranslations("Footer");
  const footerMessages: FooterInterface = {
    content: translation.raw("content"),
  };
  const content = footerMessages.content;
  const links = Object.values(content.links);

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        borderTop: "1px solid",
        borderColor: "divider",
        pt: { xs: 6, md: 8 },
        pb: 3,
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 5, md: 8 }}
          sx={{ pb: { xs: 5, md: 7 } }}
        >
          <Box sx={{ maxWidth: 420 }}>
            <Typography
              component="p"
              variant="h5"
              sx={{
                fontFamily: "monospace",
                fontWeight: 800,
                letterSpacing: "0.24em",
                mb: 2,
              }}
            >
              RAG
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.75 }}>
              {content.description}
            </Typography>
          </Box>

          <Box>
            <Typography
              component="h2"
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              {content.linksTitle}
            </Typography>
            <Stack spacing={1.25} sx={{ mt: 2 }}>
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  underline="none"
                  sx={{
                    width: "fit-content",
                    color: "text.primary",
                    transition: "color 160ms ease",
                    "&:hover": { color: "primary.main" },
                  }}
                >
                  {link.title}
                </Link>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography
              component="h2"
              variant="overline"
              sx={{
                color: "primary.main",
                fontWeight: 800,
                letterSpacing: "0.1em",
              }}
            >
              {content.socialTitle}
            </Typography>
            <SocialLogins />
          </Box>
        </Stack>

        <Divider />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", pt: 3 }}
        >
          {content.copyright}
        </Typography>
      </Container>
    </Box>
  );
}
