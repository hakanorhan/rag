import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ReactNode } from "react";

type HeroProps = {
  title: string;
  description: string;
  children: ReactNode;
};

export default function Hero({ title, description, children }: HeroProps) {
  return (
    <Box
      component="main"
      sx={{
        pt: { xs: 3, sm: 4 },
        pb: { xs: 5, sm: 7 },
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 1320,
          mx: "auto",
          px: { xs: 2, sm: 3, lg: 4 },
        }}
      >
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "minmax(0, 1.1fr) minmax(0, 1fr)",
            },
            minHeight: { sm: 360, md: 380, lg: 400 },
            bgcolor: "background.paper",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: { xs: "24px", sm: "32px" },
          }}
        >
          <Box
            sx={{
              position: "relative",
              zIndex: 1,
              minWidth: 0,
              pt: { xs: 3, sm: 4, md: 5, lg: 6 },
              px: { xs: 3, sm: 4, md: 5, lg: 6 },
              pb: { xs: 3, sm: 14, lg: 16 },
            }}
          >
            <Typography
              variant="h1"
              color="text.primary"
              sx={{
                mb: 2,
                fontSize: {
                  xs: "1.75rem",
                  sm: "2.25rem",
                  md: "2.75rem",
                  lg: "3rem",
                },
                fontWeight: 600,
                lineHeight: 1.12,
                letterSpacing: "-0.035em",
                textWrap: "balance",
              }}
            >
              {title}
            </Typography>
            <Typography
              color="text.secondary"
              sx={{
                maxWidth: 440,
                fontSize: { xs: "0.875rem", sm: "1rem", md: "1.125rem" },
                lineHeight: 1.65,
                textWrap: "pretty",
              }}
            >
              {description}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "block",
              position: "relative",
              minWidth: 0,
              height: { xs: 200, sm: "auto" },
              "&::after": {
                content: '""',
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                background: {
                  xs: "linear-gradient(180deg, var(--mui-palette-background-paper), transparent 24%)",
                  sm: "linear-gradient(90deg, var(--mui-palette-background-paper), transparent 24%)",
                },
              },
            }}
          >
            <Box
              component="img"
              src="/optimized/flughafen-abholung-mit-auto.webp"
              alt="Elektroauto bei der Abholung am Flughafen"
              loading="eager"
              sx={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "70% center",
              }}
            />
          </Box>
        </Box>
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            width: {
              xs: "calc(100% - 24px)",
              sm: "calc(100% - 64px)",
              lg: "68%",
            },
            maxWidth: 840,
            ml: { xs: 1.5, sm: 4, md: 5, lg: 6 },
            mt: { xs: -6, sm: -9, lg: -12 },
            minWidth: 0,
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
