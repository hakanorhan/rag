"use client";

import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { IconButton, Stack } from "@mui/material";

const socialNetworks = [
  { label: "Facebook", icon: <FacebookRoundedIcon /> },
  { label: "Instagram", icon: <InstagramIcon /> },
  { label: "LinkedIn", icon: <LinkedInIcon /> },
  { label: "YouTube", icon: <YouTubeIcon /> },
];

export default function SocialLogins() {
  return (
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
  );
}
