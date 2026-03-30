export async function getConversations() {
  const response = await fetch("/api/conversations");
  return response.json();
}