let messagesDb = [
  {
    id: 1,
    conversationId: 1,
    role: 'assistant',
    content: 'Hi! How can I help you today?'
  },
  {
    id: 2,
    conversationId: 1,
    role: 'user',
    content: 'Help me build a React app.'
  },
  {
    id: 3,
    conversationId: 2,
    role: 'assistant',
    content: 'What kind of homework ideas do you need?'
  }
];

export function getMessagesByConversationId(conversationId) {
  return Promise.resolve(
    messagesDb.filter((msg) => msg.conversationId === conversationId)
  );
}

export function createMessage(message) {
  const newMessage = {
    id: Date.now(),
    ...message
  };

  messagesDb.push(newMessage);

  return Promise.resolve(newMessage);
}