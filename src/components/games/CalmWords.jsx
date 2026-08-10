import { useState, useEffect, useCallback } from 'react'
import s from './Games.module.css'

const CALM_WORDS = ['BREATHE', 'PEACE', 'CALM', 'GENTLE', 'SERENE', 'GROUND', 'ANCHOR', 'STEADY', 'QUIET', 'STILL', 'RELAX']

function scramble(word) {
  const arr = word.split('')
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (arr.join('') === word && word.length > 2) return scramble(word)
  return arr
}

export default function CalmWords() {
  const [wordIdx, setWordIdx] = useState(0)
  const [tiles, setTiles] = useState([])
  const [answer, setAnswer] = useState([])
  const [solved, setSolved] = useState(false)
  const [score, setScore] = useState(0)

  const newWord = useCallback((currentIdx = -1) => {
    let idx
    do {
      idx = Math.floor(Math.random() * CALM_WORDS.length)
    } while (idx === currentIdx && CALM_WORDS.length > 1)
    setWordIdx(idx)
    setTiles(scramble(CALM_WORDS[idx]))
    setAnswer([])
    setSolved(false)
  }, [])

  useEffect(() => { newWord() }, [newWord])

  const targetWord = CALM_WORDS[wordIdx]

  function selectLetter(i) {
    if (solved || answer.includes(i)) return
    const next = [...answer, i]
    setAnswer(next)
    if (next.length === targetWord.length) {
      const guess = next.map(j => tiles[j]).join('')
      if (guess === targetWord) {
        setSolved(true)
        setScore(sc => sc + 1)
        setTimeout(() => newWord(wordIdx), 1600)
      } else {
        setTimeout(() => setAnswer([]), 500)
      }
    }
  }

  function removeLast() {
    if (!solved) setAnswer(a => a.slice(0, -1))
  }

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>🔤</span>
        <div>
          <p className={s.gameSubtitle}>Unscramble the word</p>
          <h2 className={s.gameTitle}>Calm Words</h2>
        </div>
      </div>

      {score > 0 && (
        <div className={s.streakBadge}>✨ Score: {score}</div>
      )}

      <div className={s.answerRow}>
        {Array.from({ length: targetWord.length }).map((_, i) => (
          <div
            key={i}
            className={`${s.answerSlot} ${i < answer.length ? (solved ? s.slotSolved : s.slotFilled) : s.slotEmpty}`}
          >
            {i < answer.length ? tiles[answer[i]] : ''}
          </div>
        ))}
      </div>

      {solved && (
        <p className={s.feedbackCorrect}>✓ {targetWord} — a good word to carry 💚</p>
      )}

      <div className={s.letterGrid}>
        {tiles.map((letter, i) => (
          <button
            key={i}
            className={`${s.letterTile} ${answer.includes(i) ? s.letterUsed : ''}`}
            onClick={() => selectLetter(i)}
            disabled={answer.includes(i) || solved}
          >
            {letter}
          </button>
        ))}
      </div>

      <div className={s.wordControls}>
        <button className={s.ghostBtn} onClick={removeLast} disabled={!answer.length || solved}>← Undo</button>
        <button className={s.ghostBtn} onClick={() => setAnswer([])} disabled={!answer.length || solved}>Clear</button>
        <button className={s.ghostBtn} onClick={() => newWord(wordIdx)}>Skip →</button>
      </div>
    </div>
  )
}
