export async function GET() {
  const conversations = [
    { id: 1, title: "Chat with AI" },
    { id: 2, title: "Homework Ideas" },
  ];

  return Response.json(conversations);
}