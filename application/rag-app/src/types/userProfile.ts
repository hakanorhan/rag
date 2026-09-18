import type { ProblemDetail } from "@/lib/problemDetails";

export type UserProfile = {
  driverLicenseNumber: string | null;
};

export type UserProfileActionState =
  | { status: "idle" }
  | { status: "success"; profile: UserProfile }
  | {
      status: "error";
      problem: ProblemDetail;
    };
