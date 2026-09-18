"use client";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { saveAiConfigurationAction } from "@/app/actions/aiAdmin";
import { getProblemMessage } from "@/lib/problemDetails";
import type { AiConfiguration, AiProvider } from "@/lib/services/ai";

const providers: AiProvider[] = ["OPENAI", "GROQ", "DEEPSEEK", "ANTHROPIC"];

export default function AiProviderManager({
  initialConfiguration,
}: {
  initialConfiguration: AiConfiguration;
}) {
  const [configuration, setConfiguration] = useState(initialConfiguration);
  const problemT = useTranslations("Problems");
  const [apiKey, setApiKey] = useState("");
  const [state, formAction, pending] = useActionState(
    saveAiConfigurationAction,
    null,
  );

  useEffect(() => {
    if (state?.status === "success") {
      setConfiguration(state.configuration);
      setApiKey("");
    }
  }, [state]);

  return (
    <Stack component="form" action={formAction} spacing={2} sx={{ mb: 5 }}>
      <Typography component="h2" variant="h6">
        AI-Provider
      </Typography>
      <TextField
        select
        name="provider"
        label="Provider"
        value={configuration.provider}
        disabled={pending}
        onChange={(event) =>
          setConfiguration({
            ...configuration,
            provider: event.target.value as AiProvider,
          })
        }
        slotProps={{
          select: { MenuProps: { disableScrollLock: true } },
        }}
      >
        {providers.map((provider) => (
          <MenuItem key={provider} value={provider}>
            {provider}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="baseUrl"
        label="Base URL"
        value={configuration.baseUrl}
        disabled={pending}
        onChange={(event) =>
          setConfiguration({ ...configuration, baseUrl: event.target.value })
        }
        required
      />
      <TextField
        name="model"
        label="Model"
        value={configuration.model}
        disabled={pending}
        onChange={(event) =>
          setConfiguration({ ...configuration, model: event.target.value })
        }
        required
      />
      <TextField
        name="apiKey"
        label={
          configuration.apiKeyConfigured
            ? "API-Key (leer = unverändert)"
            : "API-Key"
        }
        type="password"
        value={apiKey}
        disabled={pending}
        onChange={(event) => setApiKey(event.target.value)}
        required={!configuration.apiKeyConfigured}
        autoComplete="new-password"
      />
      <Button type="submit" variant="contained" disabled={pending}>
        Provider speichern
      </Button>
      {state?.status === "success" && (
        <Alert severity="success">AI-Konfiguration gespeichert.</Alert>
      )}
      {state?.status === "error" && (
        <Alert severity="error">
          {"problem" in state
            ? getProblemMessage(state.problem, problemT)
            : state.message}
        </Alert>
      )}
    </Stack>
  );
}
