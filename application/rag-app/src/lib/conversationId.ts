type ChatSession = {
  conversationId?: string;
  save(): Promise<void>;
};

export async function saveConversationIdFromResponse(
  response: Response,
  session: ChatSession,
) {
  const conversationId = response.headers.get("X-Conversation-Id");
  if (!conversationId) return;

  session.conversationId = conversationId;
  await session.save();
}
