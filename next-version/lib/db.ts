import { prisma } from "./prisma";

// Conversations
export async function getConversations() {
  return prisma.conversation.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createConversation() {
  return prisma.conversation.create({
    data: {
      title: "New Chat",
    },
  });
}

export async function deleteConversation(id: number) {
  return prisma.conversation.delete({
    where: { id },
  });
}

// Messages
export async function getMessages(conversationId: number) {
  return prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });
}

export async function createMessage(
  conversationId: number,
  role: string,
  content: string
) {
  return prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}