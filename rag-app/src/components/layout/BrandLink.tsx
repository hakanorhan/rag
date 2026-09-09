"use client";

import Typography from "@mui/material/Typography";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function BrandLink() {
  const searchParams = useSearchParams();
  const query = Object.fromEntries(searchParams.entries());

  return (
    <Typography
      variant="h6"
      noWrap
      component={Link}
      href={{ pathname: "/", query }}
      sx={{
        mr: 2,
        display: "flex",
        flexGrow: { xs: 1, lg: 0 },
        fontSize: { xs: "1.5rem", md: "1.25rem" },
        fontWeight: 700,
        letterSpacing: ".3rem",
        color: "text.primary",
        textDecoration: "none",
      }}
    >
      RAG
    </Typography>
  );
}
