import { createMessage, getMessages } from '../../../lib/db';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const conversationId = Number(searchParams.get('conversationId'));

  if (!conversationId) {
    return Response.json([]);
  }

  const messages = await getMessages(conversationId);
  return Response.json(messages);
}

export async function POST(req: Request) {
  const { conversationId, role, content } = await req.json();

  const message = await createMessage(conversationId, role, content);
  return Response.json(message);
}
