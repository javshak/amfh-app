import { SYSTEM_PROMPT } from '../data/systemPrompt'

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.1-8b-instant'

export async function sendChatMessage(messages) {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY

  if (!apiKey) {
    throw new Error('Missing VITE_GROQ_API_KEY in .env')
  }

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ role: m.role, content: m.content })),
      ],
      temperature: 0.7,
      max_tokens: 300,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`Groq API error: ${response.status} ${err}`)
  }

  const data = await response.json()
  return data.choices[0].message.content
}
