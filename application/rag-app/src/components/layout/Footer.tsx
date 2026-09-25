"use client";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { COMPANY_NAME } from "@/lib/branding";
import type { FooterInterface } from "../../../messages/interfaces";

const socialNetworks = [
  { label: "Facebook", icon: <FacebookRoundedIcon /> },
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "LinkedIn", icon: <LinkedInIcon /> },
  { label: "YouTube", icon: <YouTubeIcon /> },
];

export default function Footer() {
  const translation = useTranslations("Footer");
  const footerMessages: FooterInterface = {
    content: translation.raw("content"),
  };
  const content = footerMessages.content;
  const links = [
    content.links.terms,
    content.links.privacy,
    content.links.insurance,
    content.links.imprint,
  ];

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
                fontWeight: 100,
                mb: 2,
              }}
            >
              {COMPANY_NAME}
            </Typography>
            <Typography color="text.secondary">
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
                    fontWeight:
                      link === content.links.imprint ? "700" : "normal",
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
            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
              {socialNetworks.map((network) => (
                <IconButton
                  key={network.label}
                  aria-label={network.label}
                  sx={{
                    color: "text.primary",
                    border: "1px solid",
                    borderColor: "divider",
                    "&:hover": {
                      color: "primary.contrastText",
                      bgcolor: "primary.main",
                      borderColor: "primary.main",
                    },
                  }}
                >
                  {network.icon}
                </IconButton>
              ))}
            </Stack>
          </Box>
        </Stack>

        <Divider />
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", pt: 3 }}
        >
          {translation("content.copyright", { companyName: COMPANY_NAME })}
        </Typography>
      </Container>
    </Box>
  );
}
