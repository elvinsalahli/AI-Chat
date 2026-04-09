import {
  streamText,
  convertToModelMessages,
  createUIMessageStream,
  createUIMessageStreamResponse,
  type UIMessage,
} from "ai";
import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createMessage } from "../../../lib/db";

const openrouter = createOpenAICompatible({
  name: "openrouter",
  apiKey: process.env.OPENROUTER_API_KEY ?? "",
  baseURL: "https://openrouter.ai/api/v1",
});

export async function POST(req: Request) {
  const {
    messages,
    conversationId,
  }: {
    messages: UIMessage[];
    conversationId: number;
  } = await req.json();

  const lastMessage = messages[messages.length - 1];

  const lastUserText =
    lastMessage?.parts
      ?.filter(
        (part): part is Extract<(typeof lastMessage.parts)[number], { type: "text" }> =>
          part.type === "text"
      )
      .map((part) => part.text)
      .join("") ?? "";

  if (lastUserText) {
    await createMessage(conversationId, "user", lastUserText);
  }

  try {
    const result = streamText({
      model: openrouter("openai/gpt-4o-mini"),
      messages: await convertToModelMessages(messages),
      onFinish: async ({ text }) => {
        if (text) {
          await createMessage(conversationId, "assistant", text);
        }
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("CHAT ROUTE ERROR:", error);

    const fallbackText =
      "AI response is unavailable because the current OpenRouter account has insufficient credits.";

    await createMessage(conversationId, "assistant", fallbackText);

    const stream = createUIMessageStream({
      execute: async ({ writer }) => {
        writer.write({
          type: "text-start",
          id: "fallback-assistant-message",
        });

        writer.write({
          type: "text-delta",
          id: "fallback-assistant-message",
          delta: fallbackText,
        });

        writer.write({
          type: "text-end",
          id: "fallback-assistant-message",
        });
      },
    });

    return createUIMessageStreamResponse({ stream });
  }
}