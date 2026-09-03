import type { ReactNode } from "react";
import AppBar from "./AppBarServer";
import Footer from "./Footer";
import NextIntersectionObserver from "@/app/NextIntersectionObserver";

type PageShellProps = {
  children: ReactNode;
  fallback: ReactNode;
};

export default function PageShell({ children, fallback }: PageShellProps) {
  return (
    <>
      <AppBar backgroundColor="transparent" />
      {children}
      <NextIntersectionObserver
        rootmargin="0px"
        classes="my-element"
        topIn="top-in"
        topOut="top-out"
        bottomIn="bottom-in"
        bottomOut="bottom-out"
      >
        <Footer />
      </NextIntersectionObserver>
    </>
  );
}
