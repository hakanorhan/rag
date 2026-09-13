import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import RagDocumentManager from "@/components/admin/RagDocumentManager";
import { getPathname } from "@/i18n/navigation";
import { getRagAdminMessages } from "@/lib/ragAdminMessages";
import { fetchRagDocuments } from "@/lib/services/ai";

export default async function RagEditPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getRagAdminMessages(locale);
  const returnTo = getPathname({ locale, href: "/admin/rag/edit" });

  let result: Awaited<ReturnType<typeof fetchRagDocuments>>;
  try {
    result = await fetchRagDocuments();
  } catch {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.requestError}</Alert>
      </Container>
    );
  }
  if (result.status === "unauthorized") {
    redirect(`/api/login?${new URLSearchParams({ returnTo })}`);
  }
  if (result.status === "forbidden") {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.forbidden}</Alert>
      </Container>
    );
  }
  if (result.status === "error") {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.requestError}</Alert>
      </Container>
    );
  }
  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {t.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {t.intro}
      </Typography>
      <RagDocumentManager initialDocuments={result.documents} locale={locale} />
    </Container>
  );
}
