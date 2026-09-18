import { Box } from "@mui/material";
import type { ReactNode } from "react";
import ChatWidget from "../chat/chat-widget";
import AppBar from "./AppBarServer";
import Footer from "./Footer";

type PageShellProps = {
  children: ReactNode;
};

export default function PageShell({ children }: PageShellProps) {
  return (
    <>
      <AppBar />
      {children}
      <Box
        sx={{
          position: "fixed",
          zIndex: 1,
          right: { xs: 2, sm: 4 },
          bottom: { xs: 2, sm: 4 },
        }}
      >
        <ChatWidget />
      </Box>
      <Footer />
    </>
  );
}
