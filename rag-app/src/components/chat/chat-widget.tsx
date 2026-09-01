"use client";

import ChatIcon from "@mui/icons-material/Chat";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useState } from "react";

const Chat = dynamic(() => import("@/components/chat/chat"));

export default function ChatWidget() {
  const t = useTranslations("Chat");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Stack spacing={1.5} sx={{ alignItems: "flex-end", margin:'0.5rem' }}>
      <Box id="hero-chat" hidden={!isOpen} sx={{ width: { xs: 1, sm: 360 } }}>
        {isOpen ? <Chat isVisible /> : null}
      </Box>

      <Fab
        color="primary"
        aria-label={isOpen ? t("close") : t("open")}
        aria-controls="hero-chat"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? <CloseRoundedIcon /> : <ChatIcon />}
      </Fab>
    </Stack>
  );
}
