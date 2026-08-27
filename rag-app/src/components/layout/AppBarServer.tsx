import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import AppBar from "./AppBar";

type AppBarServerProps = {
  backgroundColor: string;
};

export default async function AppBarServer({
  backgroundColor,
}: AppBarServerProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <AppBar
      backgroundColor={backgroundColor}
      isAuthenticated={Boolean(session)}
    />
  );
}
