import { useState, useEffect, useCallback } from 'react'
import s from './Games.module.css'

const EMOJI_PAIRS = ['🌿', '🌊', '🌙', '☀️', '🌸', '🍃', '💫', '🕊️']

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryTiles() {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState(new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const [won, setWon] = useState(false)

  const init = useCallback(() => {
    const deck = shuffle([...EMOJI_PAIRS, ...EMOJI_PAIRS].map((e, i) => ({ id: i, emoji: e })))
    setCards(deck)
    setFlipped([])
    setMatched(new Set())
    setMoves(0)
    setLocked(false)
    setWon(false)
  }, [])

  useEffect(() => { init() }, [init])

  function flip(id) {
    if (locked || flipped.includes(id) || matched.has(cards.find(c => c.id === id)?.emoji)) return
    const next = [...flipped, id]
    setFlipped(next)
    if (next.length === 2) {
      setMoves(m => m + 1)
      setLocked(true)
      const [a, b] = next.map(i => cards.find(c => c.id === i))
      if (a.emoji === b.emoji) {
        const newMatched = new Set([...matched, a.emoji])
        setMatched(newMatched)
        setFlipped([])
        setLocked(false)
        if (newMatched.size === EMOJI_PAIRS.length) setWon(true)
      } else {
        setTimeout(() => { setFlipped([]); setLocked(false) }, 900)
      }
    }
  }

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>🧠</span>
        <div>
          <p className={s.gameSubtitle}>Find the pairs</p>
          <h2 className={s.gameTitle}>Memory Tiles</h2>
        </div>
        {moves > 0 && <div className={s.streakBadge} style={{marginLeft:'auto'}}>{moves} moves</div>}
      </div>
      {won ? (
        <div style={{textAlign:'center',padding:'16px 0'}}>
          <p className={s.feedbackCorrect} style={{fontSize:16}}>✦ Well done — {moves} moves</p>
          <button className={s.smallBtn} style={{marginTop:12}} onClick={init}>Play again</button>
        </div>
      ) : (
        <div className={s.memoryGrid}>
          {cards.map(card => {
            const isFlipped = flipped.includes(card.id)
            const isMatched = matched.has(card.emoji)
            return (
              <button
                key={card.id}
                className={`${s.memoryTile} ${isFlipped || isMatched ? s.memoryTileFlipped : ''} ${isMatched ? s.memoryTileMatched : ''}`}
                onClick={() => flip(card.id)}
              >
                {isFlipped || isMatched ? card.emoji : ''}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
