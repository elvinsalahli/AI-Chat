export type Message = {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt?: string;
};

export async function getMessagesByConversationId(
  conversationId: number
): Promise<Message[]> {
  const response = await fetch(`/api/messages?conversationId=${conversationId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch messages");
  }

  return response.json();
}

export async function createMessage(payload: {
  conversationId: number;
  role: "user" | "assistant";
  content: string;
}): Promise<Message> {
  const response = await fetch("/api/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Failed to create message");
  }

  return response.json();
}