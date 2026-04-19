"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

type InitialMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

type ChatPanelProps = {
  conversationId: number;
  initialMessages: InitialMessage[];
};

export default function ChatPanel({
  conversationId,
  initialMessages,
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
    }),
    messages: initialMessages.map((message) => ({
      id: message.id,
      role: message.role,
      parts: [{ type: "text" as const, text: message.content }],
    })),
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      text: input,
    });

    setInput("");
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message: (typeof messages)[number]) => (
          <div
            key={message.id}
            className={
              message.role === "user" ? "flex justify-end" : "flex justify-start"
            }
          >
            <div
              className={
                message.role === "user"
                  ? "max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-blue-600 text-white"
                  : "max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-white border text-gray-900"
              }
            >
              {message.parts
                .filter(
                  (
                    part: (typeof message.parts)[number]
                  ): part is Extract<(typeof message.parts)[number], { type: "text" }> =>
                    part.type === "text"
                )
                .map((part, index: number) => (
                  <div key={index}>{part.text}</div>
                ))}
            </div>
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="flex justify-start">
            <div className="max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-white border text-gray-500">
              AI is typing...
            </div>
          </div>
        )}

      </section>

      <footer className="border-t bg-white p-4">
        <form className="flex gap-3" onSubmit={handleSubmit}>
          <textarea
            className="flex-1 resize-none rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={2}
            placeholder="Type a message..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />

          <button
            className="rounded-lg bg-blue-600 text-white px-4 font-medium disabled:opacity-60"
            type="submit"
            disabled={status === "submitted" || status === "streaming"}
          >
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}