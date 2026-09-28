import PageShell from "@/components/layout/PageShell";
import AboutPageContent from "@/components/pages/AboutPageContent";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default function AboutPage() {
  return (
    <PageShell>
      <AboutPageContent />
    </PageShell>
  );
}
