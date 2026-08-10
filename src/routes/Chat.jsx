import BottomNav from '../components/BottomNav'
import { useChat } from '../hooks/useChat'
import s from './Chat.module.css'

export default function Chat() {
  const { messages, input, setInput, send, loading, bottomRef } = useChat()

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <>
      <div className={s.page}>
        <div className={s.header}>
          <p className={s.headerTitle}>Ask a Therapist</p>
          <p className={s.headerSub}>Mental health awareness & support — not a substitute for professional care</p>
        </div>

        <div className={s.messages}>
          {messages.map((m, i) => (
            <div key={i} className={`${s.bubble} ${m.role === 'user' ? s.bubbleUser : s.bubbleAssistant}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className={`${s.bubble} ${s.bubbleAssistant}`}>
              <div className={s.typingDots}><span /><span /><span /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className={s.inputRow}>
          <textarea
            className={s.input}
            rows={1}
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className={s.sendBtn} onClick={send} disabled={!input.trim() || loading}>
            Send
          </button>
        </div>
        <p className={s.disclaimer}>This is not a crisis service. If you're in danger, call 988 or local emergency services.</p>
      </div>
      <BottomNav />
    </>
  )
}
