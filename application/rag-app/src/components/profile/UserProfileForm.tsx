"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { saveUserProfileAction } from "@/app/actions/userProfile";
import AppButton from "@/components/ui/AppButton";
import { getProblemMessage } from "@/lib/problemDetails";
import type { UserProfileActionState } from "@/types/userProfile";

const INITIAL_STATE: UserProfileActionState = { status: "idle" };

export default function UserProfileForm({
  driverLicenseNumber,
}: {
  driverLicenseNumber: string | null;
}) {
  const t = useTranslations("Profile");
  const problemT = useTranslations("Problems");
  const [state, formAction, pending] = useActionState(
    saveUserProfileAction,
    INITIAL_STATE,
  );

  return (
    <Box component="form" action={formAction} sx={{ maxWidth: 520 }}>
      <Stack spacing={2.5}>
        <TextField
          required
          fullWidth
          name="driverLicenseNumber"
          label={t("driverLicenseNumber")}
          defaultValue={driverLicenseNumber ?? ""}
          disabled={pending}
          slotProps={{ htmlInput: { maxLength: 100 } }}
        />
        {state.status === "success" ? (
          <Alert severity="success">{t("saved")}</Alert>
        ) : null}
        {state.status === "error" ? (
          <Alert severity="error">
            {getProblemMessage(state.problem, problemT)}
          </Alert>
        ) : null}
        <AppButton type="submit" disabled={pending}>
          {pending ? t("saving") : t("save")}
        </AppButton>
      </Stack>
    </Box>
  );
}
