"use server";

import { saveAiConfiguration, type AiProvider } from "@/lib/services/ai";

export async function saveAiConfigurationAction(
  _previousState: unknown,
  formData: FormData,
) {
  const provider = formData.get("provider");
  const baseUrl = formData.get("baseUrl");
  const model = formData.get("model");
  const apiKey = formData.get("apiKey");
  if (
    typeof provider !== "string" ||
    typeof baseUrl !== "string" ||
    typeof model !== "string" ||
    typeof apiKey !== "string" ||
    !["OPENAI", "GROQ", "DEEPSEEK", "ANTHROPIC"].includes(provider)
  ) {
    return { status: "error" as const, message: "Invalid AI configuration" };
  }
  return saveAiConfiguration({
    provider: provider as AiProvider,
    baseUrl,
    model,
    apiKey,
  });
}
