import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function AdminPageLoading({ locale }: { locale: string }) {
  return (
    <Container
      component="main"
      maxWidth="lg"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "calc(100dvh - 50px)",
      }}
    >
      <Typography color="text.primary">
        {locale === "de" ? "Lädt…" : "Loading…"}
      </Typography>
    </Container>
  );
}
