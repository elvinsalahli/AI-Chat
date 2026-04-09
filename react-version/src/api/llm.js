const API_KEY = 'YOUR_OPENROUTER_API_KEY';

export async function getLLMReply(messages) {
  const formattedMessages = messages.map((message) => ({
    role: message.role,
    content: message.content
  }));

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: formattedMessages
    })
  });

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || 'No response received.';
}