const messagesDb = [
  {
    id: 1,
    conversationId: 1,
    role: "assistant",
    content: "Hi! How can I help you today?",
  },
  {
    id: 2,
    conversationId: 1,
    role: "user",
    content: "Help me build a React app.",
  },
  {
    id: 3,
    conversationId: 2,
    role: "assistant",
    content: "What kind of homework ideas do you need?",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = Number(searchParams.get("conversationId"));

  const filteredMessages = messagesDb.filter(
    (message) => message.conversationId === conversationId
  );

  return Response.json(filteredMessages);
}