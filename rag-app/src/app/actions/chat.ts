"use server";

import { requestChatAnswer } from "@/lib/services/ai";

export async function askChat(message: string, conversationId?: string) {
  return requestChatAnswer(message, conversationId);
}
