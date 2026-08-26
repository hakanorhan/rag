import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import type { NewsInterface } from "../../../messages/interfaces";

type NewsArticleProps = {
  article: NewsInterface["article"];
};

export default function NewsArticle({ article }: NewsArticleProps) {
  return (
    <Box
      component="section"
      aria-labelledby="news-article-title"
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        py: { xs: 5, sm: 7, md: 10 },
      }}
    >
      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Box component="article">
          <Box component="header" sx={{ maxWidth: 880, mb: { xs: 3, md: 5 } }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={{ xs: 1.5, sm: 2 }}
              sx={{
                mb: 2.5,
                alignItems: { xs: "flex-start", sm: "center" },
              }}
            >
              <Chip
                label={article.category}
                color="primary"
                size="small"
                sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
              />
              <Stack
                direction="row"
                spacing={0.75}
                sx={{ alignItems: "center" }}
              >
                <AccessTimeRoundedIcon
                  aria-hidden="true"
                  sx={{ color: "text.secondary", fontSize: 18 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {article.date} · {article.readingTime}
                </Typography>
              </Stack>
            </Stack>

            <Typography
              id="news-article-title"
              component="h1"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                fontWeight: 750,
                letterSpacing: "-0.04em",
                lineHeight: { xs: 1.08, md: 1.03 },
                mb: 2.5,
              }}
            >
              {article.title}
            </Typography>

            <Typography
              component="p"
              color="text.secondary"
              sx={{
                maxWidth: 760,
                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                lineHeight: 1.65,
              }}
            >
              {article.intro}
            </Typography>
          </Box>

          <Box component="figure" sx={{ m: 0, mb: { xs: 4, md: 7 } }}>
            <Box
              sx={{
                position: "relative",
                width: "100%",
                aspectRatio: { xs: "4 / 5", sm: "16 / 10", md: "16 / 9" },
                overflow: "hidden",
                borderRadius: { xs: 2, md: 3 },
                bgcolor: "action.hover",
              }}
            >
              <Image
                src="/optimized/news.webp"
                alt={article.imageAlt}
                fill
                loading="lazy"
                sizes="(max-width: 600px) 100vw, (max-width: 1200px) 92vw, 1200px"
                style={{ objectFit: "cover", objectPosition: "center 97%" }}
              />
            </Box>
            <Typography
              component="figcaption"
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 1.25 }}
            >
              {article.caption}
            </Typography>
          </Box>

          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 5, md: 10 }}
            sx={{ alignItems: "flex-start" }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography
                component="p"
                sx={{
                  fontSize: { xs: "1.05rem", sm: "1.125rem" },
                  lineHeight: 1.8,
                  mb: 3,
                }}
              >
                {article.firstParagraph}
              </Typography>

              <Typography
                component="h2"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.025em",
                  mt: 4,
                  mb: 2,
                }}
              >
                {article.sectionTitle}
              </Typography>

              <Typography
                component="p"
                sx={{
                  fontSize: { xs: "1.05rem", sm: "1.125rem" },
                  lineHeight: 1.8,
                }}
              >
                {article.secondParagraph}
              </Typography>
            </Box>

            <Box
              component="aside"
              sx={{
                width: { xs: 1, md: 280 },
                flexShrink: 0,
                borderTop: 3,
                borderColor: "primary.main",
                bgcolor: "background.paper",
                borderRadius: "0 0 12px 12px",
                p: { xs: 2.5, sm: 3 },
              }}
            >
              <Typography
                component="h2"
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 800 }}
              >
                {article.overview.title}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {article.overview.itemDrive}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {article.overview.itemComfort}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                {article.overview.itemDesign}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
