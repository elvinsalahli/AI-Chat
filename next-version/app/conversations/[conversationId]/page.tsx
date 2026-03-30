"use client";

import { useEffect, useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import ChatPanel from "../../components/chat/ChatPanel";
import { getConversations } from "../../lib/conversations";
import { getMessagesByConversationId } from "../../lib/messages";

type Conversation = {
  id: number;
  title: string;
};

type Message = {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
};

export default function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);
    });
  }, []);

  useEffect(() => {
    params.then((resolved) => {
      setActiveId(Number(resolved.conversationId));
    });
  }, [params]);

  useEffect(() => {
    if (activeId === null) return;

    getMessagesByConversationId(activeId).then((data) => {
      setMessages(data);
    });
  }, [activeId]);

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />

      <ChatPanel
        messages={messages}
        onSendMessage={() => {}}
        isLoading={false}
      />
    </div>
  );
}