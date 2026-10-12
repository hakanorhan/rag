"use server";

import { revalidatePath } from "next/cache";
import { CAR_API_URL } from "@/lib/api";
import type { ProblemDetail } from "@/lib/problemDetails";
import { getAuthenticatedFetch } from "@/lib/services/serverFetch";

type PaymentResult =
  | { status: "success"; orderId: string }
  | { status: "error"; problem: ProblemDetail };

const unavailable: ProblemDetail = {
  status: 503,
  code: "PROVIDER_ERROR",
};

async function requestPayment(
  path: string,
  body?: object,
): Promise<Response | null> {
  const client = await getAuthenticatedFetch();
  if (client.status === "error") return null;
  return client.request(`${CAR_API_URL}/paypal${path}`, {
    method: "POST",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
}

async function problem(response: Response): Promise<ProblemDetail> {
  try {
    const detail = (await response.json()) as ProblemDetail;
    if (detail.code) return detail;
    const code = detail.detail;
    if (
      code === "NOT_CONFIGURED" ||
      code === "PROVIDER_ERROR" ||
      code === "ORDER_NOT_FOUND" ||
      code === "PAYMENT_CONFLICT" ||
      code === "PAYMENT_PENDING" ||
      code === "PAYMENT_DECLINED"
    ) {
      return { ...detail, code };
    }
    return { ...detail, code: "PROVIDER_ERROR" };
  } catch {
    return unavailable;
  }
}

export async function createPaypalOrder(
  reservationId: number,
): Promise<PaymentResult> {
  if (!Number.isSafeInteger(reservationId) || reservationId <= 0) {
    return {
      status: "error",
      problem: { status: 400, code: "VALIDATION_ERROR" },
    };
  }
  try {
    const response = await requestPayment("/orders", { reservationId });
    if (!response)
      return {
        status: "error",
        problem: { status: 401, code: "AUTHENTICATION_REQUIRED" },
      };
    if (!response.ok)
      return { status: "error", problem: await problem(response) };
    const data: unknown = await response.json();
    if (
      typeof data === "object" &&
      data !== null &&
      "orderId" in data &&
      typeof data.orderId === "string" &&
      data.orderId.length > 0
    ) {
      return { status: "success", orderId: data.orderId };
    }
  } catch {}
  return { status: "error", problem: unavailable };
}

export async function capturePaypalOrder(
  orderId: string,
): Promise<PaymentResult> {
  if (!/^[A-Za-z0-9-]{1,100}$/.test(orderId)) {
    return {
      status: "error",
      problem: { status: 400, code: "VALIDATION_ERROR" },
    };
  }
  try {
    const response = await requestPayment(`/orders/${orderId}/capture`);
    if (!response)
      return {
        status: "error",
        problem: { status: 401, code: "AUTHENTICATION_REQUIRED" },
      };
    if (!response.ok)
      return { status: "error", problem: await problem(response) };
    const payment: unknown = await response.json();
    if (
      typeof payment === "object" &&
      payment !== null &&
      "status" in payment &&
      payment.status === "COMPLETED"
    ) {
      revalidatePath("/[locale]/reservation-car/[reservationId]", "page");
      return { status: "success", orderId };
    }
  } catch {
    // The buyer can retry; the backend uses the same PayPal capture request ID.
  }
  return { status: "error", problem: unavailable };
}
