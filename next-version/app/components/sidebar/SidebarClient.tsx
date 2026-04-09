"use client";

import { useOptimistic, useTransition } from "react";
import { useRouter } from "next/navigation";

type Conversation = {
  id: number;
  title: string;
};

type Props = {
  initialConversations: Conversation[];
  activeId: number | null;
};

export default function SidebarClient({
  initialConversations,
  activeId,
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [optimisticConversations, setOptimisticConversations] = useOptimistic(
    initialConversations,
    (
      state,
      action:
        | { type: "add"; conversation: Conversation }
        | { type: "remove"; id: number }
    ) => {
      if (action.type === "add") {
        return [action.conversation, ...state];
      }

      return state.filter((conversation) => conversation.id !== action.id);
    }
  );

  async function handleCreate() {
    const tempId = Date.now();

    startTransition(async () => {
      setOptimisticConversations({
        type: "add",
        conversation: {
          id: tempId,
          title: "New Chat",
        },
      });

      try {
        const response = await fetch("/api/conversations", {
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to create conversation");
        }

        const conversation = await response.json();
        router.push(`/conversations/${conversation.id}`);
        router.refresh();
      } catch {
        router.refresh();
      }
    });
  }

  async function handleDelete(id: number) {
    startTransition(async () => {
      setOptimisticConversations({
        type: "remove",
        id,
      });

      try {
        const response = await fetch(`/api/conversations/${id}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete conversation");
        }

        if (activeId === id) {
          router.push("/");
        }

        router.refresh();
      } catch {
        router.refresh();
      }
    });
  }

  return (
    <aside className="w-72 bg-white border-r flex flex-col">
      <div className="p-4">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isPending}
          className="w-full rounded-lg bg-blue-600 text-white py-2 font-medium disabled:opacity-60"
        >
          + New Chat
        </button>
      </div>

      <div className="px-2 pb-4 space-y-1">
        {optimisticConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`flex items-center justify-between px-3 py-2 rounded-lg ${
              activeId === conversation.id
                ? "bg-blue-50 border border-blue-200 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <button
              type="button"
              onClick={() => router.push(`/conversations/${conversation.id}`)}
              className="flex-1 text-left truncate"
            >
              {conversation.title}
            </button>

            <button
              type="button"
              onClick={() => handleDelete(conversation.id)}
              className="ml-3 text-gray-500 hover:text-red-600"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}