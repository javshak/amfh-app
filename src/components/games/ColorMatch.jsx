import { useState, useEffect, useCallback } from 'react'
import s from './Games.module.css'

const COLORS = [
  { name: 'Sunny Yellow',  hex: '#FFC547' },
  { name: 'Dusty Rose',    hex: '#D2A1A1' },
  { name: 'Sage Green',    hex: '#8F9779' },
  { name: 'Soft Sand',     hex: '#E6DCC8' },
  { name: 'Muted Teal',    hex: '#7A9E9F' },
  { name: 'Lavender',      hex: '#B5A8B9' },
  { name: 'Terracotta',    hex: '#CC8B79' },
  { name: 'Sky Blue',      hex: '#87BFDF' },
]

export default function ColorMatch() {
  const [target, setTarget] = useState(COLORS[0])
  const [options, setOptions] = useState([])
  const [feedback, setFeedback] = useState(null) // 'correct' | 'wrong' | null
  const [streak, setStreak] = useState(0)
  const [guessedIdx, setGuessedIdx] = useState(null)

  const startRound = useCallback(() => {
    const t = COLORS[Math.floor(Math.random() * COLORS.length)]
    setTarget(t)
    const others = COLORS.filter(c => c.name !== t.name)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
    setOptions([t, ...others].sort(() => 0.5 - Math.random()))
    setFeedback(null)
    setGuessedIdx(null)
  }, [])

  useEffect(() => { startRound() }, [startRound])

  function handleGuess(color, idx) {
    if (feedback !== null) return
    setGuessedIdx(idx)
    if (color.name === target.name) {
      setStreak(s => s + 1)
      setFeedback('correct')
      setTimeout(startRound, 1400)
    } else {
      setStreak(0)
      setFeedback('wrong')
    }
  }

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>🎨</span>
        <div>
          <p className={s.gameSubtitle}>Find the color</p>
          <h2 className={s.gameTitle}>Color Match</h2>
        </div>
      </div>

      {streak > 1 && (
        <div className={s.streakBadge}>🔥 {streak} in a row</div>
      )}

      <p className={s.colorName}>{target.name}</p>

      <div className={s.colorGrid}>
        {options.map((color, i) => (
          <button
            key={i}
            className={`${s.colorTile} ${guessedIdx === i ? (feedback === 'correct' ? s.tileCorrect : s.tileWrong) : ''}`}
            style={{ backgroundColor: color.hex }}
            onClick={() => handleGuess(color, i)}
          >
            {guessedIdx === i && feedback === 'correct' && <span className={s.tileIcon}>✓</span>}
            {guessedIdx === i && feedback === 'wrong' && <span className={s.tileIcon}>✕</span>}
          </button>
        ))}
      </div>

      <div className={s.feedbackRow}>
        {feedback === 'correct' && (
          <p className={s.feedbackCorrect}>Matched! Take a breath. 🌿</p>
        )}
        {feedback === 'wrong' && (
          <div className={s.feedbackWrongRow}>
            <p className={s.feedbackWrong}>That's okay — try again</p>
            <button className={s.smallBtn} onClick={startRound}>Next</button>
          </div>
        )}
      </div>
    </div>
  )
}
