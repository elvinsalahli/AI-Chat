export async function getMessagesByConversationId(conversationId: number) {
  const response = await fetch(
    `/api/messages?conversationId=${conversationId}`
  );
  return response.json();
}