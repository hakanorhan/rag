import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import handleFetch from "@/app/actions/handleFetch";

export const maxDuration = 300;

type ChatRequest = {
  id: string;
  messages: UIMessage[];
};

function getLatestUserMessage(messages: UIMessage[]) {
  const message = messages.findLast((item) => item.role === "user");

  return message?.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("")
    .trim();
}

export async function POST(request: Request) {
  const { id, messages }: ChatRequest = await request.json();
  const userMessage = getLatestUserMessage(messages);

  if (!id || !userMessage) {
    return Response.json(
      { error: "A chat ID and user message are required." },
      { status: 400 },
    );
  }

  const stream = createUIMessageStream({
    originalMessages: messages,
    async execute({ writer }) {
      const answer = await handleFetch(userMessage, id, request.signal);
      const textPartId = crypto.randomUUID();

      writer.write({ type: "text-start", id: textPartId });
      writer.write({ type: "text-delta", id: textPartId, delta: answer });
      writer.write({ type: "text-end", id: textPartId });
    },
  });

  return createUIMessageStreamResponse({ stream });
}
