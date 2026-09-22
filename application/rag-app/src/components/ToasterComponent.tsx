"use client";

import { useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";

export interface ToastInterface {
  message: string;
  state: "success" | "error";
  position?: "top-center" | "top-right";
}

export default function ToasterComponent({
  message,
  state,
  position = "top-center",
}: ToastInterface) {
  useEffect(() => {
    if (state === "success") toast.success(message, { id: "contact-success" });
    if (state === "error") toast.error(message, { id: "contact-error" });

    if (state === "success") {
      const url = new URL(window.location.href);
      url.searchParams.delete("sent");
      window.history.replaceState(null, "", url);
    }
  }, [message, state]);

  return <Toaster position={position} />;
}
