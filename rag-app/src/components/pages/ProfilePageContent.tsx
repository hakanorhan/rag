import Alert from "@mui/material/Alert";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import UserProfileForm from "@/components/profile/UserProfileForm";
import { getPathname } from "@/i18n/navigation";
import { getProblemMessage } from "@/lib/problemDetails";
import { getUserProfile } from "@/lib/services/userProfile";

export default async function ProfilePageContent({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [t, problemT, result] = await Promise.all([
    getTranslations("Profile"),
    getTranslations("Problems"),
    getUserProfile(),
  ]);

  if (
    result.status === "error" &&
    result.problem.code === "AUTHENTICATION_REQUIRED"
  ) {
    const returnTo = getPathname({ locale, href: "/profile" });
    redirect(`/api/login?${new URLSearchParams({ returnTo })}`);
  }
  if (result.status === "error" && result.problem.code === "ACCESS_DENIED") {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">
          {getProblemMessage(result.problem, problemT)}
        </Alert>
      </Container>
    );
  }

  return (
    <Container
      component="main"
      maxWidth="md"
      sx={{ py: { xs: 5, md: 8 }, minHeight: 640 }}
    >
      <Typography component="h1" variant="h3" sx={{ mb: 1 }}>
        {t("title")}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        {t("description")}
      </Typography>
      {result.status === "success" ? (
        <UserProfileForm
          driverLicenseNumber={result.profile.driverLicenseNumber}
        />
      ) : (
        <Alert severity="error">
          {getProblemMessage(result.problem, problemT)}
        </Alert>
      )}
    </Container>
  );
}
