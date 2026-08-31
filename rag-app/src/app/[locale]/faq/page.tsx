import Container from "@mui/material/Container";
import ButtonFetch from "@/app/actions/ButtonFetch";

export default function FaqPage() {
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{ py: { xs: 4, sm: 8 }, px: { xs: 2, sm: 3 } }}
    >
      <ButtonFetch />
    </Container>
  );
}
