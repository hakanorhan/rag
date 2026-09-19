import PageShell from "@/components/layout/PageShell";
import ContactPageContent from "@/components/pages/ContactPageContent";

export default async function ContactPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ sent?: string }>;
}) {
  const { locale } = await params;
  const { sent } = await searchParams;

  return (
    <PageShell>
      <ContactPageContent locale={locale} sent={sent === "1"} />
    </PageShell>
  );
}
