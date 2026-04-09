import { prisma } from "@/lib/prisma";

export async function GET() {
  const conversations = await prisma.conversation.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });

  return Response.json(conversations);
}

export async function POST(request: Request) {
  const body = await request.json();

  const conversation = await prisma.conversation.create({
    data: {
      title: body.title || "New Chat",
    },
  });

  return Response.json(conversation);
}