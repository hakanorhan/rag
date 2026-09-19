import "server-only";

import { AI_API_URL } from "@/lib/api";
import { ProblemDetailError } from "@/lib/problemDetails";
import { getSession } from "@/lib/session";
import type { CarSearchResponse } from "@/types/car";
import type { RagDocument } from "@/types/ragDocument";

type ChatResponse = {
  conversationId: string;
  answer: string;
  sources: Array<{
    documentId: string;
    fileName: string;
    page: number;
    chunkId: string;
    similarityScore: number | null;
  }>;
};

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
  const response = await fetch(`${AI_API_URL}/cars/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  const result: CarSearchResponse = await response.json();
  if (!Array.isArray(result.cars)) {
    throw new Error("Invalid car search response");
  }
  return result;
}

export async function searchCarsById(searchId: string) {
  const response = await fetch(
    `${AI_API_URL}/cars/search/${encodeURIComponent(searchId)}`,
  );
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  const result: CarSearchResponse = await response.json();
  if (!Array.isArray(result.cars))
    throw new Error("Invalid car search response");
  return result;
}

export async function requestChatAnswer(
  message: string,
  conversationId?: string,
) {
  const response = await fetch(`${AI_API_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      ...(conversationId && { conversationId }),
    }),
  });
  if (!response.ok) {
    throw new ProblemDetailError(await response.json());
  }
  const result: unknown = await response.json();
  if (
    typeof result !== "object" ||
    result === null ||
    !("conversationId" in result) ||
    typeof result.conversationId !== "string" ||
    !("answer" in result) ||
    typeof result.answer !== "string" ||
    !("sources" in result) ||
    !Array.isArray(result.sources)
  ) {
    throw new Error("Invalid chat response");
  }
  return result as ChatResponse;
}

export async function fetchRagDocuments() {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(new URL(ragAdminPath, AI_API_URL), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return {
      status: "error" as const,
      problem: await response.json(),
    };
  }

  const documents: unknown = await response.json();
  if (!Array.isArray(documents)) {
    throw new Error("Invalid RAG documents response");
  }
  return { status: "success" as const, documents: documents as RagDocument[] };
}

export async function saveRagDocument(input: { id?: string; data: FormData }) {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const path = input.id
    ? `${ragAdminPath}/${encodeURIComponent(input.id)}`
    : ragAdminPath;
  const response = await fetch(new URL(path, AI_API_URL), {
    method: input.id ? "PUT" : "POST",
    body: input.data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return {
      status: "error" as const,
      problem: await response.json(),
    };
  }

  return {
    status: "success" as const,
    document: (await response.json()) as RagDocument,
  };
}

export async function fetchAiConfiguration() {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(new URL(aiAdminPath, AI_API_URL), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    return {
      status: "error" as const,
      problem: await response.json(),
    };
  }
  return {
    status: "success" as const,
    configuration: (await response.json()) as AiConfiguration,
  };
}

export async function saveAiConfiguration(input: {
  provider: AiProvider;
  baseUrl: string;
  model: string;
  apiKey: string;
}) {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) {
    return {
      status: "error" as const,
      problem: {
        type: "/problems/authentication-required",
        status: 401,
        code: "AUTHENTICATION_REQUIRED",
      },
    };
  }

  const response = await fetch(new URL(aiAdminPath, AI_API_URL), {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    return {
      status: "error" as const,
      problem: await response.json(),
    };
  }
  return {
    status: "success" as const,
    configuration: (await response.json()) as AiConfiguration,
  };
}
