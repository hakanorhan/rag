"use server";

import axios from "axios";

type ChatResponse = {
  answer: string;
};

export default async function handleFetch(
  message: string,
  conversationId = crypto.randomUUID(),
  signal?: AbortSignal,
) {
  const response = await axios.post<ChatResponse>(
    "http://aiservice:8081/api/ai/chat",
    { message, conversationId },
    { timeout: 300_000, signal },
  );

  return response.data.answer;
}
