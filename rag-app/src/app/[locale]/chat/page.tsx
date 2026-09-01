import Container from "@mui/material/Container";
import Chat from "@/components/chat/chat";

export default function ChatPage() {
  return (
    <Container component="main" maxWidth="md" sx={{ py: { xs: 4, sm: 8 } }}>
      <Chat />
    </Container>
  );
}
