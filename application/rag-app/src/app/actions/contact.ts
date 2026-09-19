"use server";

import { redirect } from "next/navigation";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? "localhost",
  port: Number(process.env.SMTP_PORT ?? 1025),
  secure: false,
});

export async function sendContactMessage(formData: FormData) {
  const name = formData.get("name");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");
  const returnTo = formData.get("returnTo");

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !email.trim() ||
    !message.trim()
  ) {
    throw new Error("Invalid contact form data");
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM ?? "noreply@rag.local",
    to: process.env.CONTACT_TO ?? "info@portfolio-example.de",
    replyTo: email,
    subject,
    text: `Name: ${name}\nE-Mail: ${email}\n\n${message}`,
  });

  redirect(
    typeof returnTo === "string" ? `${returnTo}?sent=1` : "/contact?sent=1",
  );
}
