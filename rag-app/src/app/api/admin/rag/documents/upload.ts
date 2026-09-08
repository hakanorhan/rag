import "server-only";

import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/auth";
import { parseProblemDetail } from "@/lib/problemDetails";
import { fetchRagDocuments, saveRagDocument } from "@/lib/ragAdmin";
import { getAccessToken } from "@/lib/session";

// https://nextjs.org/docs/app/api-reference/file-conventions/route#request-body-formdata
export async function proxyRagUpload(input: { request: Request; id?: string }) {
  const { request, id } = input;
  // The browser authenticates with a session cookie; protect uploads against CSRF.
  const origin = getAppUrl(request.url).origin;
  if (request.headers.get("origin") !== origin) {
    return NextResponse.json({ code: "FORBIDDEN" }, { status: 403 });
  }

  const accessToken = await getAccessToken();
  if (!accessToken) {
    return NextResponse.json({ code: "UNAUTHORIZED" }, { status: 401 });
  }

  try {
    const permission = await fetchRagDocuments(accessToken);
    if (!permission.ok) {
      return NextResponse.json(
        { code: "ACCESS_DENIED" },
        { status: permission.status },
      );
    }
    if (Number(request.headers.get("content-length")) > 21 * 1024 * 1024) {
      return NextResponse.json({ code: "PDF_TOO_LARGE" }, { status: 413 });
    }

    const data = await request.formData();
    const file = data.get("file");
    if (
      !(file instanceof File) ||
      file.size === 0 ||
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json({ code: "INVALID_PDF" }, { status: 400 });
    }
    if (file.size > 20 * 1024 * 1024) {
      return NextResponse.json({ code: "PDF_TOO_LARGE" }, { status: 413 });
    }

    const response = await saveRagDocument({ id, data, accessToken });
    if (response.status >= 500) {
      return NextResponse.json({ code: "REQUEST_FAILED" }, { status: 502 });
    }
    const body = response.ok
      ? await response.json()
      : await parseProblemDetail(response);
    return NextResponse.json(body, {
      status: response.status,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": response.ok
          ? "application/json"
          : "application/problem+json",
      },
    });
  } catch {
    return NextResponse.json({ code: "REQUEST_FAILED" }, { status: 502 });
  }
}
