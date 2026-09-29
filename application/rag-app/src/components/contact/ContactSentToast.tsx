"use client";

import { useSearchParams } from "next/navigation";
import ToasterComponent from "@/components/ToasterComponent";

export default function ContactSentToast({ message }: { message: string }) {
  const searchParams = useSearchParams();

  return (
    <ToasterComponent
      message={message}
      show={searchParams.get("sent") === "1"}
      state="success"
    />
  );
}
