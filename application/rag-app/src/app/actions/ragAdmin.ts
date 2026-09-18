"use server";

import { saveRagDocument } from "@/lib/services/ai";
import {
  type RagAdminActionState,
  type RagCategory,
  ragCategories,
} from "@/types/ragDocument";

export async function saveRagDocumentAction(
  documentId: string | undefined,
  _previousState: RagAdminActionState,
  formData: FormData,
): Promise<RagAdminActionState> {
  const file = formData.get("file");
  const category = formData.get("category");
  const version = formData.get("version");

  if (file instanceof File && file.size > 20 * 1024 * 1024) {
    return {
      status: "error",
      problem: {
        type: "/problems/payload-too-large",
        status: 413,
        code: "PAYLOAD_TOO_LARGE",
      },
    };
  }
  if (
    !(file instanceof File) ||
    file.size === 0 ||
    !file.name.toLowerCase().endsWith(".pdf") ||
    typeof category !== "string" ||
    !ragCategories.includes(category as RagCategory) ||
    (documentId &&
      (typeof version !== "string" ||
        !Number.isInteger(Number(version)) ||
        Number(version) < 1))
  ) {
    return {
      status: "error",
      problem: {
        type: "/problems/invalid-pdf",
        status: 400,
        code: "INVALID_PDF",
      },
    };
  }

  const result = await saveRagDocument({ id: documentId, data: formData });
  if (result.status === "error") return result;

  return {
    ...result,
    previousVersion: documentId ? Number(version) : undefined,
  };
}
