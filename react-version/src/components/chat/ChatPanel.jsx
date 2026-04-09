import { useState } from 'react';

export default function ChatPanel({ messages, onSendMessage, isLoading }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    if (!text.trim()) return;

    onSendMessage(text);
    setText('');
  }

  return (
    <main className="flex-1 flex flex-col bg-gray-100">
      <section className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={
              message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
            }
          >
            <div
              className={
                message.role === 'user'
                  ? 'max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-blue-600 text-white'
                  : 'max-w-md px-4 py-2 rounded-2xl text-sm leading-relaxed shadow-sm bg-white border text-gray-900'
              }
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
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
            rows="2"
            placeholder="Type a message..."
            value={text}
            onChange={(event) => setText(event.target.value)}
          ></textarea>

          <button
            className="rounded-lg bg-blue-600 text-white px-4 font-medium"
            type="submit"
          >
            Send
          </button>
        </form>
      </footer>
    </main>
  );
}