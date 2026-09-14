import "server-only";

import { getIronSession, type SessionOptions } from "iron-session";
import { cookies } from "next/headers";

type ChatSession = {
  conversationId?: string;
};

function getSessionOptions(): SessionOptions {
  const password = process.env.CHAT_SESSION_SECRET;

  if (!password) {
    throw new Error("CHAT_SESSION_SECRET is required for the chat session");
  }

  return {
    cookieName:
      process.env.NODE_ENV === "production" ? "__Host-rag-chat" : "rag-chat",
    password,
    cookieOptions: {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  };
}

export async function getChatSession() {
  return getIronSession<ChatSession>(await cookies(), getSessionOptions());
}
