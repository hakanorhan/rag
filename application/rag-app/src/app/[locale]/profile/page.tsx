import PageShell from "@/components/layout/PageShell";
import ProfilePageContent from "@/components/pages/ProfilePageContent";

export default function ProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  return (
    <PageShell>
      <ProfilePageContent params={params} />
    </PageShell>
  );
}
