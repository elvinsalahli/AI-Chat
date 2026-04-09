import { getMessages, createMessage } from "../../../lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get("conversationId"));

  const messages = await getMessages(conversationId);
  return Response.json(messages);
}

export async function POST(req: Request) {
  const { conversationId, role, content } = await req.json();

  const message = await createMessage(conversationId, role, content);
  return Response.json(message);
}