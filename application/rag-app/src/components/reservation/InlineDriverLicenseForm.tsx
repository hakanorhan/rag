"use client";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { startTransition, useActionState, useEffect, useState } from "react";
import { saveUserProfileAction } from "@/app/actions/userProfile";
import AppButton from "@/components/ui/AppButton";
import { getProblemMessage } from "@/lib/problemDetails";
import type { UserProfileActionState } from "@/types/userProfile";

const INITIAL_STATE: UserProfileActionState = { status: "idle" };

export default function InlineDriverLicenseForm({
  onSaved,
}: {
  onSaved: () => void;
}) {
  const t = useTranslations("Profile");
  const problemT = useTranslations("Problems");
  const [driverLicenseNumber, setDriverLicenseNumber] = useState("");
  const [state, saveAction, pending] = useActionState(
    saveUserProfileAction,
    INITIAL_STATE,
  );

  useEffect(() => {
    if (state.status === "success") onSaved();
  }, [onSaved, state.status]);

  function saveAndContinue() {
    const formData = new FormData();
    formData.set("driverLicenseNumber", driverLicenseNumber);
    startTransition(() => saveAction(formData));
  }

  return (
    <Stack
      spacing={2}
      sx={{ mt: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
        {t("licenseRequiredTitle")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("licenseRequiredDescription")}
      </Typography>
      <TextField
        required
        fullWidth
        size="small"
        label={t("driverLicenseNumber")}
        value={driverLicenseNumber}
        disabled={pending}
        onChange={(event) => setDriverLicenseNumber(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            saveAndContinue();
          }
        }}
        slotProps={{ htmlInput: { maxLength: 100 } }}
      />
      {state.status === "error" ? (
        <Alert severity="error">
          {getProblemMessage(state.problem, problemT)}
        </Alert>
      ) : null}
      <AppButton type="button" disabled={pending} onClick={saveAndContinue}>
        {pending ? t("saving") : t("saveAndReserve")}
      </AppButton>
    </Stack>
  );
}
