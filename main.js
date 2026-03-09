import { appendMessage, createAssistantBubble, appendToBubble } from './chat.js';
import { streamChatCompletion } from './api.js';

const form = document.getElementById('chat-form');
const input = document.getElementById('message-input');
const messagesContainer = document.getElementById('messages');

const messages = [];

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (!text) {
    return;
  }

  input.value = '';

  appendMessage(messagesContainer, 'user', text);

  messages.push({
    role: 'user',
    content: text
  });

  const assistantBubble = createAssistantBubble(messagesContainer);

  try {
    const assistantReply = await streamChatCompletion(messages, (chunk) => {
      appendToBubble(assistantBubble, chunk, messagesContainer);
    });

    messages.push({
      role: 'assistant',
      content: assistantReply
    });
  } catch (error) {
    assistantBubble.textContent = 'Something went wrong.';
    console.error(error);
  }
});