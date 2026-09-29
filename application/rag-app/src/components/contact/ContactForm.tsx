"use client";

import Paper from "@mui/material/Paper";
import type { SyntheticEvent, ReactNode } from "react";
import { sendContactMessage } from "@/app/actions/contact";

type FormControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export default function ContactForm({
  children,
  requiredError,
  emailError,
}: {
  children: ReactNode;
  requiredError: string;
  emailError: string;
}) {
  function handleInvalid(event: SyntheticEvent<HTMLFormElement>) {
    const control = event.target as FormControl;
    if (typeof control.setCustomValidity !== "function") return;

    if (control.validity.valueMissing) {
      control.setCustomValidity(requiredError);
    } else if (control.validity.typeMismatch) {
      control.setCustomValidity(emailError);
    }
  }

  function clearValidationError(event: SyntheticEvent<HTMLFormElement>) {
    const control = event.target as FormControl;
    if (typeof control.setCustomValidity === "function") {
      control.setCustomValidity("");
    }
  }

  return (
    <Paper
      component="form"
      action={sendContactMessage}
      onInvalid={handleInvalid}
      onInput={clearValidationError}
      variant="outlined"
      sx={{ flex: 1.4 }}
    >
      {children}
    </Paper>
  );
}
