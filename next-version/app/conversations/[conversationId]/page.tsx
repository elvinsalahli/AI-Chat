import Sidebar from "../../components/sidebar/Sidebar";
import ChatPanel from "../../components/chat/ChatPanel";
import { getMessages } from "../../../lib/db";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const id = Number(conversationId);

  const messages = await getMessages(id);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar activeId={id} />
      <ChatPanel
  conversationId={id}
  initialMessages={messages.map((m) => ({
    id: String(m.id),
    role: m.role as "user" | "assistant",
    content: m.content,
  }))}
/>
    </div>
  );
}