import ContactPageContent from "@/components/contact/ContactPageContent";
import PageShell from "@/components/layout/PageShell";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <ContactPageContent locale={locale} />
    </PageShell>
  );
}
