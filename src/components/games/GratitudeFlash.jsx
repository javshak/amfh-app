import { useState, useCallback } from 'react'
import s from './Games.module.css'

const PROMPTS = [
  'Name one person who made your day a little easier.',
  'What is one small thing that went well today?',
  'Name something outside right now that you appreciate.',
  'What is one thing your body did today that you are grateful for?',
  'Name one moment of quiet you had recently.',
  'What is something you have that you sometimes take for granted?',
  'Name one skill or strength you used today.',
  'What made you smile recently, even briefly?',
  'Name something in your home that brings you comfort.',
  'What is one thing you are looking forward to, however small?',
]

export default function GratitudeFlash() {
  const [idx, setIdx] = useState(0)
  const [response, setResponse] = useState('')
  const [saved, setSaved] = useState([])
  const [submitted, setSubmitted] = useState(false)

  const next = useCallback(() => {
    setIdx(i => (i + 1) % PROMPTS.length)
    setResponse('')
    setSubmitted(false)
  }, [])

  function submit() {
    if (!response.trim()) return
    setSaved(prev => [...prev, { prompt: PROMPTS[idx], response: response.trim() }])
    setSubmitted(true)
  }

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>🙏</span>
        <div>
          <p className={s.gameSubtitle}>One moment at a time</p>
          <h2 className={s.gameTitle}>Gratitude Flash</h2>
        </div>
        {saved.length > 0 && <div className={s.streakBadge} style={{marginLeft:'auto'}}>✨ {saved.length}</div>}
      </div>
      <div className={s.gratitudePromptBox}>
        <p className={s.gratitudePrompt}>{PROMPTS[idx]}</p>
      </div>
      {!submitted ? (
        <>
          <textarea
            className={s.gratitudeInput}
            placeholder="Take a moment to reflect…"
            value={response}
            onChange={e => setResponse(e.target.value)}
            rows={3}
          />
          <div className={s.wordControls}>
            <button className={s.ghostBtn} onClick={next}>Skip →</button>
            <button className={s.nextBtn} onClick={submit} disabled={!response.trim()} style={{flex:1}}>Save ✓</button>
          </div>
        </>
      ) : (
        <div style={{textAlign:'center',padding:'8px 0 4px'}}>
          <p className={s.feedbackCorrect}>Saved. One more?</p>
          <button className={s.smallBtn} style={{marginTop:10}} onClick={next}>Next prompt →</button>
        </div>
      )}
    </div>
  )
}
