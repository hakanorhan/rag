import { Box } from "@mui/material";
import type { ReactNode } from "react";
import ChatWidget from "../chat/chat-widget";
import AppBar from "./AppBarServer";
import Footer from "./Footer";

type PageShellProps = {
  children: ReactNode;
  topPadding?: boolean;
};

export default function PageShell({
  children,
  topPadding = true,
}: PageShellProps) {
  return (
    <>
      <AppBar />
      <div style={{ paddingTop: topPadding ? "50px" : 0 }}>{children}</div>
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
