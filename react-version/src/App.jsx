import { useEffect, useState } from 'react';
import Sidebar from './components/sidebar/Sidebar';
import ChatPanel from './components/chat/ChatPanel';
import { getConversations } from './api/conversations';
import { createMessage, getMessagesByConversationId } from './api/messages';
import { getLLMReply } from './api/llm';

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getConversations().then((data) => {
      setConversations(data);
      if (data.length > 0) {
        setActiveConversationId(data[0].id);
      }
    });
  }, []);

  useEffect(() => {
    if (!activeConversationId) return;

    getMessagesByConversationId(activeConversationId).then((data) => {
      setMessages(data);
    });
  }, [activeConversationId]);

  async function handleSendMessage(text) {
    if (!text.trim() || !activeConversationId) return;

    const userMessage = await createMessage({
      conversationId: activeConversationId,
      role: 'user',
      content: text
    });

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const assistantReply = await getLLMReply(updatedMessages);

      const assistantMessage = await createMessage({
        conversationId: activeConversationId,
        role: 'assistant',
        content: assistantReply
      });

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);

      const fallbackMessage = await createMessage({
        conversationId: activeConversationId,
        role: 'assistant',
        content: 'Something went wrong while getting the AI reply.'
      });

      setMessages((prev) => [...prev, fallbackMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen flex bg-gray-100">
      <Sidebar
        conversations={conversations}
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />

      <ChatPanel
        messages={messages}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
}

export default App;