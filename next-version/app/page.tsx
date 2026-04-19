import { redirect } from "next/navigation";
import { getConversations } from "../lib/db";

export default async function HomePage() {
  const conversations = await getConversations();

  if (conversations.length > 0) {
    redirect(`/conversations/${conversations[0].id}`);
  }

  return (
    <div className="p-6">
      No conversations yet. Create one from the sidebar.
    </div>
  );
}