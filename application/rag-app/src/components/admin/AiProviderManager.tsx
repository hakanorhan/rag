"use client";

import Alert from "@mui/material/Alert";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTranslations } from "next-intl";
import { useActionState, useEffect, useState } from "react";
import { saveAiConfigurationAction } from "@/app/actions/aiAdmin";
import ButtonComponent from "@/components/ButtonComponent";
import SelectComponent from "@/components/SelectComponent";
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
      <SelectComponent
        name="provider"
        label="Provider"
        backgroundColor="background.default"
        value={configuration.provider}
        disabled={pending}
        onChange={(value) =>
          setConfiguration({
            ...configuration,
            provider: value as AiProvider,
          })
        }
      >
        {providers.map((provider) => (
          <MenuItem key={provider} value={provider}>
            {provider}
          </MenuItem>
        ))}
      </SelectComponent>
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
      <ButtonComponent type="submit" disabled={pending}>
        Provider speichern
      </ButtonComponent>
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
