import { Suspense } from "react";
import AdminPageLoading from "@/components/admin/AdminPageLoading";
import PageShell from "@/components/layout/PageShell";
import ProfilePageContent from "@/components/profile/ProfilePageContent";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <PageShell>
      <Suspense fallback={<AdminPageLoading locale={locale} />}>
        <ProfilePageContent params={params} />
      </Suspense>
    </PageShell>
  );
}
