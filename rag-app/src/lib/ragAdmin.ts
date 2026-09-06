import "server-only";

import { apiFetch } from "@/lib/api";

const adminPath = "/admin/rag/edit";

export function fetchRagDocuments(accessToken: string) {
  return apiFetch({ service: "ai", path: adminPath, accessToken });
}

export function saveRagDocument(input: {
  id?: string;
  data: FormData;
  accessToken: string;
}) {
  const { id, data, accessToken } = input;
  return apiFetch({
    service: "ai",
    path: id ? `${adminPath}/${encodeURIComponent(id)}` : adminPath,
    method: id ? "PUT" : "POST",
    accessToken,
    body: data,
  });
}
