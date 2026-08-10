import { useState, useRef, useEffect } from 'react'
import { sendChatMessage } from '../utils/openai'

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: "Hi, I'm here to talk through stress, anxiety, or anything on your mind. I can suggest grounding exercises or help you understand what you're feeling. What's on your mind?",
}

export function useChat() {
  const [messages, setMessages] = useState([WELCOME_MESSAGE])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send() {
    const text = input.trim()
    if (!text || loading) return

    const userMessage = { role: 'user', content: text }
    const updated = [...messages, userMessage]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      const reply = await sendChatMessage(updated)
      setMessages(m => [...m, { role: 'assistant', content: reply }])
    } catch (e) {
      setError(e.message)
      setMessages(m => [...m, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return { messages, input, setInput, send, loading, error, bottomRef }
}
