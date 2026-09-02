"use server";

import { postJson } from "@/lib/aiService";

type ChatResponse = {
  answer: string;
};

const MAX_MESSAGE_LENGTH = 4_000;
const MAX_CONVERSATION_ID_LENGTH = 100;

export default async function handleFetch(
  message: string,
  conversationId = crypto.randomUUID(),
) {
  if (typeof message !== "string" || typeof conversationId !== "string") {
    throw new Error("Invalid chat request");
  }

  const normalizedMessage = message.trim();
  const normalizedConversationId = conversationId.trim();

  if (
    !normalizedMessage ||
    normalizedMessage.length > MAX_MESSAGE_LENGTH ||
    !normalizedConversationId ||
    normalizedConversationId.length > MAX_CONVERSATION_ID_LENGTH
  ) {
    throw new Error("Invalid chat request");
  }

  const result = await postJson(
    "/api/ai/chat",
    {
      message: normalizedMessage,
      conversationId: normalizedConversationId,
    },
    "Chat request",
  );

  if (
    typeof result !== "object" ||
    result === null ||
    !("answer" in result) ||
    typeof result.answer !== "string"
  ) {
    throw new Error("Invalid chat response");
  }

  return (result as ChatResponse).answer;
}
