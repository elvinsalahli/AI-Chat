export async function streamChatCompletion(messages, onChunk) {
  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer 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'
      },
      body: JSON.stringify({
        model: 'liquid/lfm-2.5-1.2b-instruct:free',
        messages,
        stream: true
      })
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  if (!response.body) {
    throw new Error('Missing response body.');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  let fullReply = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed.startsWith('data:')) {
        continue;
      }

      const data = trimmed.replace(/^data:\s*/, '');

      if (data === '[DONE]') {
        continue;
      }

      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content;

        if (text) {
          fullReply += text;
          onChunk(text);
        }
      } catch (error) {
        console.error('Chunk parse error:', error);
      }
    }
  }

  return fullReply;
}