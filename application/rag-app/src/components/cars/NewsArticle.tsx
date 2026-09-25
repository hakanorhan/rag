import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ImageRender from "@/app/utils/imageRender";
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
          <Box component="header" sx={{ maxWidth: 1200, mb: { xs: 3, md: 5 } }}>
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
                sx={{ fontWeight: 700 }}
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
              component="h2"
              sx={{
                fontSize: { xs: "2rem", sm: "3rem", md: "4rem" },
                fontWeight: 750,
                mb: 2.5,
              }}
            >
              {article.title}
            </Typography>

            <Typography
              component="p"
              color="text.secondary"
              sx={{
                maxWidth: "100%",
                fontSize: { xs: "1.05rem", sm: "1.25rem" },
              }}
            >
              {article.intro}
            </Typography>

            <ImageRender
              src={"/optimized/electric-news.webp"}
              alt={article.imageAlt}
              objectFit="cover"
            />

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
                  mb: 3,
                }}
              >
                {article.firstParagraph}
              </Typography>

              <Typography
                component="h3"
                sx={{
                  fontSize: { xs: "1.5rem", sm: "2rem" },
                  fontWeight: 700,
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
                component="h3"
                variant="overline"
                sx={{ color: "primary.main", fontWeight: 800 }}
              >
                {article.overview.title}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2">
                {article.overview.itemDrive}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2">
                {article.overview.itemComfort}
              </Typography>
              <Divider sx={{ my: 1.5 }} />
              <Typography variant="body2">
                {article.overview.itemDesign}
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
