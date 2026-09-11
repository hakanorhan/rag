import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import RagDocumentManager from "@/components/admin/RagDocumentManager";
import { getPathname } from "@/i18n/navigation";
import { requirePageAccess } from "@/lib/pageAuth";
import { parseProblemDetail } from "@/lib/problemDetails";
import { fetchRagDocuments } from "@/lib/ragAdmin";
import { getRagAdminMessages } from "@/lib/ragAdminMessages";
import type { RagDocument } from "@/types/ragDocument";

export default async function RagEditPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = getRagAdminMessages(locale);
  const { accessToken, loginUrl } = await requirePageAccess({
    returnTo: getPathname({ locale, href: "/admin/rag/edit" }),
  });

  let response: Response;
  try {
    response = await fetchRagDocuments(accessToken);
  } catch {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.requestError}</Alert>
      </Container>
    );
  }
  const problem = response.ok ? null : await parseProblemDetail(response);
  const status = problem?.status ?? response.status;
  if (status === 401) redirect(loginUrl);
  if (status === 403) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.forbidden}</Alert>
      </Container>
    );
  }
  if (!response.ok) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">{t.requestError}</Alert>
      </Container>
    );
  }
  const documents: RagDocument[] = await response.json();

  return (
    <Container component="main" maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography component="h1" variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {t.title}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {t.intro}
      </Typography>
      <RagDocumentManager initialDocuments={documents} locale={locale} />
    </Container>
  );
}
