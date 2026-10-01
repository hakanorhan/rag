import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Skeleton from "@mui/material/Skeleton";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import CarCard from "@/components/cars/CarCard";
import PageShell from "@/components/layout/PageShell";
import CarsPageContent from "@/components/pages/CarsPageContent";
import type { CarsInterface } from "../../../../messages/interfaces";

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const translation = await getTranslations("Cars");
  const content: CarsInterface["content"] = translation.raw("content");

  return (
    <PageShell>
      <Container component="main" maxWidth="lg">
        <Typography variant="h1">{content.title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 4 }}>
          {content.description}
        </Typography>
        <Suspense fallback={<CarsResultsFallback content={content} />}>
          <CarsPageContent searchParams={searchParams} content={content} />
        </Suspense>
      </Container>
    </PageShell>
  );
}

function CarsResultsFallback({
  content,
}: {
  content: CarsInterface["content"];
}) {
  return (
    <Box sx={{ mt: 4, height: "90vh" }}>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            select
            label={content.ageFilter}
            value=""
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon />
                  </InputAdornment>
                ),
              },
              select: {
                readOnly: true,
                MenuProps: { disableScrollLock: true },
              },
            }}
          >
            <MenuItem value="">{content.allAges}</MenuItem>
            <MenuItem value="21">&lt;= 21</MenuItem>
            <MenuItem value="25">&lt;= 25</MenuItem>
            <MenuItem value="30">&lt;= 30</MenuItem>
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <TextField
            fullWidth
            select
            label={content.sort}
            value="default"
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SortIcon />
                  </InputAdornment>
                ),
              },
              select: {
                readOnly: true,
                MenuProps: { disableScrollLock: true },
              },
            }}
          >
            <MenuItem value="default">{content.sortDefault}</MenuItem>
            <MenuItem value="priceAscending">{content.priceAscending}</MenuItem>
            <MenuItem value="priceDescending">
              {content.priceDescending}
            </MenuItem>
          </TextField>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {[0, 1, 2].map((item) => (
          <Grid key={item} size={{ xs: 12, sm: 6, md: 4 }}>
            <CarCard
              car={{ imageUrl: null }}
              eyebrow={<Skeleton width={80} />}
              title={<Skeleton width={180} />}
              subtitle={<Skeleton width={120} />}
              details={[
                {
                  id: "minimum-age",
                  text: <Skeleton width={160} />,
                },
              ]}
              price={
                <>
                  <Skeleton
                    component="span"
                    width={70}
                    sx={{ display: "inline-block", verticalAlign: "middle" }}
                  />{" "}
                  {content.perDay}
                </>
              }
              actions={
                <Button
                  component="span"
                  variant="contained"
                  sx={{ width: "100%", pointerEvents: "none" }}
                >
                  {content.rent}
                </Button>
              }
              loading
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
