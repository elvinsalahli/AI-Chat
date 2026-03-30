"use client";

import { useEffect, useState } from "react";
import Sidebar from "./components/sidebar/Sidebar";
import ChatPanel from "./components/chat/ChatPanel";
import { getConversations } from "./lib/conversations";
import { getMessagesByConversationId } from "./lib/messages";

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

export default function HomePage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) {
        setActiveId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (activeId === null) return;

    getMessagesByConversationId(activeId).then((data) => {
      setMessages(data);
    });
  }, [activeId]);

  async function handleSendMessage(text: string) {
    if (!text.trim() || activeId === null) return;

    const userMessage: Message = {
      id: Date.now(),
      conversationId: activeId,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/llm", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((message) => ({
            role: message.role,
            content: message.content,
          })),
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: Date.now() + 1,
        conversationId: activeId,
        role: "assistant",
        content: data.choices?.[0]?.message?.content || "No response received.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      const assistantMessage: Message = {
        id: Date.now() + 1,
        conversationId: activeId,
        role: "assistant",
        content: "Something went wrong while getting the AI reply.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
      />

      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}