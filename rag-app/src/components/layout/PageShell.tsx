import Box from "@mui/material/Box";
import type { ReactNode } from "react";
import { Suspense } from "react";
import AppBar from "./AppBarServer";
import Footer from "./Footer";

type PageShellProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export default function PageShell({ children, fallback }: PageShellProps) {
  return (
    <>
      <Suspense fallback={<Box sx={{ height: 80 }} />}>
        <AppBar backgroundColor="transparent" />
      </Suspense>
      <Suspense fallback={fallback}>{children}</Suspense>
      <Footer />
    </>
  );
}
