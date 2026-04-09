export function appendMessage(container, role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = role === 'user' ? 'flex justify-end' : 'flex justify-start';

  const bubble = document.createElement('div');
  bubble.className =
    role === 'user'
      ? 'max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-blue-600 text-white'
      : 'max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-white border text-gray-900';

  bubble.textContent = text;

  wrapper.appendChild(bubble);
  container.appendChild(wrapper);
  container.scrollTop = container.scrollHeight;

  return bubble;
}

export function createAssistantBubble(container) {
  return appendMessage(container, 'assistant', '');
}

export function appendToBubble(bubble, text, container) {
  bubble.textContent += text;
  container.scrollTop = container.scrollHeight;
}