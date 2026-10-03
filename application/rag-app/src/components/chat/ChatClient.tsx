"use client";

import ChatIcon from "@mui/icons-material/Chat";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { ChatLabels } from "./ChatContent";

export type { ChatLabels } from "./ChatContent";

const ChatContent = dynamic(() => import("./ChatContent"), { ssr: false });

type ChatProps = {
  locale: string;
  labels: ChatLabels;
};

export default function ChatClient({ locale, labels }: ChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  return (
    <ClickAwayListener onClickAway={() => setIsOpen(false)}>
      <Stack spacing={1.5} sx={{ alignItems: "flex-end", margin: "0.5rem" }}>
        <Box id="hero-chat" hidden={!isOpen} sx={{ width: { xs: 360 } }}>
          {hasOpened ? <ChatContent locale={locale} labels={labels} /> : null}
        </Box>

        <Fab
          color="primary"
          aria-label={isOpen ? labels.close : labels.open}
          aria-controls="hero-chat"
          aria-expanded={isOpen}
          onClick={() => {
            if (!isOpen) setHasOpened(true);
            setIsOpen((open) => !open);
          }}
        >
          {isOpen ? <CloseRoundedIcon /> : <ChatIcon />}
        </Fab>
      </Stack>
    </ClickAwayListener>
  );
}
