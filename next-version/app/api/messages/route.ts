import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationId = Number(searchParams.get("conversationId"));

  const messages = await prisma.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json(messages);
}

export async function POST(request: Request) {
  const body = await request.json();

  const message = await prisma.message.create({
    data: {
      content: body.content,
      role: body.role,
      conversationId: body.conversationId,
    },
  });

  return Response.json(message);
}