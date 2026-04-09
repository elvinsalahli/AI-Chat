import { getConversations } from "../../../lib/db";
import SidebarClient from "./SidebarClient";

export default async function Sidebar({
  activeId,
}: {
  activeId: number | null;
}) {
  const conversations = await getConversations();

  return (
    <SidebarClient
      initialConversations={conversations.map((conversation) => ({
        id: conversation.id,
        title: conversation.title,
      }))}
      activeId={activeId}
    />
  );
}