"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatPanel from "../../components/chat/ChatPanel";
import {
  Conversation,
  createConversation,
  deleteConversation,
  getConversations,
} from "../../lib/conversations";
import {
  Message,
  createMessage,
  getMessagesByConversationId,
} from "../../lib/messages";

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const id = Number(params.conversationId);
    if (!Number.isNaN(id)) {
      setActiveId(id);
    }
  }, [params.conversationId]);

  const { data: conversations = [] } = useQuery<Conversation[]>({
    queryKey: ["conversations"],
    queryFn: getConversations,
  });

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ["messages", activeId],
    queryFn: () => getMessagesByConversationId(activeId as number),
    enabled: activeId !== null,
  });

  const createConversationMutation = useMutation({
    mutationFn: () => createConversation("New Chat"),
    onSuccess: (conversation) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      setActiveId(conversation.id);
      router.push(`/conversations/${conversation.id}`);
    },
  });

  const deleteConversationMutation = useMutation({
    mutationFn: (id: number) => deleteConversation(id),
    onSuccess: (_data, deletedId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
      queryClient.removeQueries({ queryKey: ["messages", deletedId] });

      if (activeId === deletedId) {
        setActiveId(null);
        router.push("/");
      }
    },
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (text: string) => {
      if (activeId === null) {
        throw new Error("No active conversation");
      }

      await createMessage({
        conversationId: activeId,
        role: "user",
        content: text,
      });

      const llmResponse = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }].map(
            (message) => ({
              role: message.role,
              content: message.content,
            })
          ),
        }),
      });

      if (!llmResponse.ok) {
        throw new Error("Failed to get AI reply");
      }

      const llmData = await llmResponse.json();
      const assistantContent =
        llmData.choices?.[0]?.message?.content || "No response received.";

      await createMessage({
        conversationId: activeId,
        role: "assistant",
        content: assistantContent,
      });

      return true;
    },
    onMutate: async (text) => {
      if (activeId === null) return;

      await queryClient.cancelQueries({ queryKey: ["messages", activeId] });

      const previousMessages =
        queryClient.getQueryData<Message[]>(["messages", activeId]) || [];

      const optimisticUserMessage: Message = {
        id: Date.now(),
        conversationId: activeId,
        role: "user",
        content: text,
      };

      queryClient.setQueryData<Message[]>(
        ["messages", activeId],
        [...previousMessages, optimisticUserMessage]
      );

      return { previousMessages };
    },
    onError: (_error, _text, context) => {
      if (activeId === null) return;

      if (context?.previousMessages) {
        queryClient.setQueryData(
          ["messages", activeId],
          context.previousMessages
        );
      }
    },
    onSuccess: () => {
      if (activeId === null) return;
      queryClient.invalidateQueries({ queryKey: ["messages", activeId] });
    },
  });

  function handleSelectConversation(id: number) {
    setActiveId(id);
    router.push(`/conversations/${id}`);
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={handleSelectConversation}
        onCreate={() => createConversationMutation.mutate()}
        onDelete={(id) => deleteConversationMutation.mutate(id)}
        isCreating={createConversationMutation.isPending}
        deletingId={deleteConversationMutation.isPending ? activeId : null}
      />

      <ChatPanel
        messages={messages}
        onSendMessage={(text) => sendMessageMutation.mutate(text)}
        isLoading={sendMessageMutation.isPending}
      />
    </div>
  );
}