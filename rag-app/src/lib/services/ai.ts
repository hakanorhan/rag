import "server-only";

import { AI_API_URL } from "@/lib/api";
import { parseProblemDetail } from "@/lib/problemDetails";
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

export async function searchCars(message: string) {
  const response = await fetch(`${AI_API_URL}/cars/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car search request failed");
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
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Car search result expired");
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
    const problem = await parseProblemDetail(response);
    throw new Error(problem?.detail ?? "Chat request failed");
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
  if (!accessToken) return { status: "unauthorized" as const };

  const response = await fetch(new URL(ragAdminPath, AI_API_URL), {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    const status = problem?.status ?? response.status;
    if (status === 401) return { status: "unauthorized" as const };
    if (status === 403) return { status: "forbidden" as const };
    return { status: "error" as const };
  }

  const documents: unknown = await response.json();
  if (!Array.isArray(documents)) return { status: "error" as const };
  return { status: "success" as const, documents: documents as RagDocument[] };
}

export async function saveRagDocument(input: { id?: string; data: FormData }) {
  const accessToken = (await getSession())?.accessToken;
  if (!accessToken) return { status: "error" as const, httpStatus: 401 };

  const path = input.id
    ? `${ragAdminPath}/${encodeURIComponent(input.id)}`
    : ragAdminPath;
  const response = await fetch(new URL(path, AI_API_URL), {
    method: input.id ? "PUT" : "POST",
    body: input.data,
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    const problem = await parseProblemDetail(response);
    return {
      status: "error" as const,
      httpStatus: response.status,
      code: problem?.code,
      detail: problem?.detail,
    };
  }

  return {
    status: "success" as const,
    document: (await response.json()) as RagDocument,
  };
}
