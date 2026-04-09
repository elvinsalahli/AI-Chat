const conversations = [
  { id: 1, title: 'Chat with AI' },
  { id: 2, title: 'Homework Ideas' }
];

export function getConversations() {
  return Promise.resolve([...conversations]);
}