"use server";

import { redirect } from "next/navigation";
import nodemailer from "nodemailer";
import { z } from "zod";
import { altcha } from "@/lib/altcha";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(320),
  subject: z.enum(["reservation", "vehicle", "general"]),
  message: z.string().trim().min(1).max(4000),
  altchaPayload: z.string().min(1),
});

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export async function sendContactMessage(formData: FormData) {
  const returnTo = formData.get("returnTo");

  const input = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    altchaPayload: formData.get("altcha"),
  });
  if (!input.success) {
    throw new Error("Invalid contact form data");
  }

  const { name, email, subject, message, altchaPayload } = input.data;

  const verificationRequest = new Request("http://localhost", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ altcha: altchaPayload }),
  });
  const verificationResponse = await altcha.middleware(
    verificationRequest,
    false,
  );
  const verification = await verificationResponse.json();
  if (verification.error) {
    throw new Error("ALTCHA verification failed");
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@rag.local",
    to: process.env.CONTACT_TO ?? "info@platzhalter.invalid",
    replyTo: email,
    subject,
    text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
  });

  redirect(
    typeof returnTo === "string" ? `${returnTo}?sent=1` : "/contact?sent=1",
  );
}
