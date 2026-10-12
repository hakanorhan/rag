import "server-only";

import { AI_API_URL } from "@/lib/api";
import type { CarSearchResponse } from "@/types/car";
import type { RagDocument } from "@/types/ragDocument";
import { getAuthenticatedFetch, serverFetch } from "./serverFetch";

const ragAdminPath = "/admin/rag/edit";
const aiAdminPath = "/admin/ai-config";

export type AiProvider = "OPENAI" | "GROQ" | "DEEPSEEK" | "ANTHROPIC";
export type AiConfiguration = {
  provider: AiProvider;
  baseUrl: string;
  model: string;
  apiKeyConfigured: boolean;
};

export async function searchCars(message: string) {
  const response = await serverFetch.requestOrThrow(
    `${AI_API_URL}/cars/search`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    },
  );
  const result: CarSearchResponse = await response.json();
  if (!Array.isArray(result.cars)) {
    throw new Error("Invalid car search response");
  }
  return result;
}

export async function fetchRagDocuments() {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(new URL(ragAdminPath, AI_API_URL), {
    cache: "no-store",
  });
  if (result.status === "error") return result;

  const documents: unknown = await result.response.json();
  if (!Array.isArray(documents)) {
    throw new Error("Invalid RAG documents response");
  }
  return { status: "success" as const, documents: documents as RagDocument[] };
}

export async function saveRagDocument(input: { id?: string; data: FormData }) {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const path = input.id
    ? `${ragAdminPath}/${encodeURIComponent(input.id)}`
    : ragAdminPath;
  const result = await client.requestResult(new URL(path, AI_API_URL), {
    method: input.id ? "PUT" : "POST",
    body: input.data,
  });
  if (result.status === "error") return result;

  return {
    status: "success" as const,
    document: (await result.response.json()) as RagDocument,
  };
}

export async function fetchAiConfiguration() {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(new URL(aiAdminPath, AI_API_URL), {
    cache: "no-store",
  });
  if (result.status === "error") return result;
  return {
    status: "success" as const,
    configuration: (await result.response.json()) as AiConfiguration,
  };
}

export async function saveAiConfiguration(input: {
  provider: AiProvider;
  baseUrl: string;
  model: string;
  apiKey: string;
}) {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return client;

  const result = await client.requestResult(new URL(aiAdminPath, AI_API_URL), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (result.status === "error") return result;
  return {
    status: "success" as const,
    configuration: (await result.response.json()) as AiConfiguration,
  };
}
