"use server";

import { saveUserProfile } from "@/lib/services/userProfile";
import { userProfileSchema } from "@/lib/validation/userProfile";
import type { UserProfileActionState } from "@/types/userProfile";

export async function saveUserProfileAction(
  _previousState: UserProfileActionState,
  formData: FormData,
): Promise<UserProfileActionState> {
  const input = userProfileSchema.safeParse({
    driverLicenseNumber: formData.get("driverLicenseNumber"),
  });
  if (!input.success) {
    return {
      status: "error",
      problem: {
        type: "/problems/validation-error",
        status: 400,
        code: "VALIDATION_ERROR",
      },
    };
  }

  return saveUserProfile(input.data.driverLicenseNumber);
}
