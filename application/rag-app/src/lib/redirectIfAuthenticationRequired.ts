import "server-only";

import { redirect } from "next/navigation";
import { getLoginUrl } from "@/lib/loginUrl";
import type { ProblemDetail } from "@/lib/problemDetails";

type Result =
  | { status: "success" }
  | { status: "error"; problem: ProblemDetail };

export function redirectIfAuthenticationRequired(
  result: Result,
  returnTo: string,
) {
  if (
    result.status === "error" &&
    result.problem.code === "AUTHENTICATION_REQUIRED"
  ) {
    redirect(getLoginUrl(returnTo));
  }
}
