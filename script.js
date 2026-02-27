const sendButton = document.getElementById('sendButton');
const messageInput = document.getElementById('messageInput');
const messages = document.getElementById('messages');

sendButton.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text) return;

  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.textContent = text;

  messages.appendChild(messageElement);
  messageInput.value = '';
});
