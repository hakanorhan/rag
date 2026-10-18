import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { getTranslations } from "next-intl/server";
import AiProviderManager from "@/components/admin/AiProviderManager";
import { getPathname } from "@/i18n/navigation";
import { getProblemMessage } from "@/lib/problemDetails";
import { redirectIfAuthenticationRequired } from "@/lib/redirectIfAuthenticationRequired";
import { fetchAiConfiguration } from "@/lib/services/ai";

export default async function AiConfigurationPageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [problemT, result] = await Promise.all([
    getTranslations("Problems"),
    fetchAiConfiguration(),
  ]);

  redirectIfAuthenticationRequired(
    result,
    getPathname({ locale, href: "/admin/ai" }),
  );

  if (result.status === "error") {
    return (
      <Container sx={{ pb: 6 }}>
        <Alert severity="error">
          {getProblemMessage(result.problem, problemT)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="lg">
      <Typography variant="h1">AI-Provider konfigurieren</Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Provider, Modell, Base-URL und API-Key für den AI-Chat verwalten.
      </Typography>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        AI-Provider
      </Typography>
      <AiProviderManager initialConfiguration={result.configuration} />
    </Container>
  );
}
