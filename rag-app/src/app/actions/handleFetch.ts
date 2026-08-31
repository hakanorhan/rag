"use server";

import axios from "axios";

type ChatResponse = {
  answer: string;
};

export default async function handleFetch(message: string) {
  const response = await axios.post<ChatResponse>(
    "http://aiservice:8081/api/ai/chat",
    { message },
    { timeout: 300_000 },
  );

  return response.data.answer;
}
