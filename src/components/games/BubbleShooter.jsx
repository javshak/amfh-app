import { useState, useRef, useCallback } from 'react'
import s from './Games.module.css'

const COLS = 8
const ROWS = 7
const BUBBLE_COLORS = ['#E8A87C', '#7CBDE8', '#A8D8A8', '#D4A8D8', '#E8D07C', '#A8C8D8']
const EMPTY = null

function randomColor() {
  return BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)]
}

function initGrid() {
  return Array.from({ length: ROWS }, (_, r) =>
    r < 4
      ? Array.from({ length: r % 2 === 0 ? COLS : COLS - 1 }, () => randomColor())
      : Array.from({ length: r % 2 === 0 ? COLS : COLS - 1 }, () => EMPTY)
  )
}

function getNeighbors(grid, row, col) {
  const isEvenRow = row % 2 === 0
  const dirs = isEvenRow
    ? [[-1,-1],[-1,0],[0,-1],[0,1],[1,-1],[1,0]]
    : [[-1,0],[-1,1],[0,-1],[0,1],[1,0],[1,1]]
  return dirs
    .map(([dr, dc]) => [row + dr, col + dc])
    .filter(([nr, nc]) => nr >= 0 && nr < grid.length && nc >= 0 && nc < (grid[nr]?.length || 0))
}

function findMatches(grid, row, col, color) {
  const visited = new Set()
  const queue = [[row, col]]
  const matches = []
  while (queue.length) {
    const [r, c] = queue.shift()
    const key = `${r},${c}`
    if (visited.has(key)) continue
    visited.add(key)
    if (grid[r]?.[c] !== color) continue
    matches.push([r, c])
    getNeighbors(grid, r, c).forEach(([nr, nc]) => {
      if (!visited.has(`${nr},${nc}`)) queue.push([nr, nc])
    })
  }
  return matches
}

function removeFloating(grid) {
  const connected = new Set()
  const queue = []
  for (let c = 0; c < (grid[0]?.length || 0); c++) {
    if (grid[0][c] !== EMPTY) queue.push([0, c])
  }
  while (queue.length) {
    const [r, c] = queue.shift()
    const key = `${r},${c}`
    if (connected.has(key) || grid[r]?.[c] === EMPTY) continue
    connected.add(key)
    getNeighbors(grid, r, c).forEach(([nr, nc]) => {
      if (!connected.has(`${nr},${nc}`)) queue.push([nr, nc])
    })
  }
  return grid.map((row, r) => row.map((cell, c) => connected.has(`${r},${c}`) ? cell : EMPTY))
}

export default function BubbleShooter() {
  const [grid, setGrid] = useState(initGrid)
  const [shooter, setShooter] = useState(randomColor)
  const [next, setNext] = useState(randomColor)
  const [score, setScore] = useState(0)
  const [won, setWon] = useState(false)
  const [lastPlaced, setLastPlaced] = useState(null)

  const reset = useCallback(() => {
    setGrid(initGrid())
    setShooter(randomColor())
    setNext(randomColor())
    setScore(0)
    setWon(false)
    setLastPlaced(null)
  }, [])

  function handleBubbleClick(targetRow, targetCol) {
    if (won) return
    const neighbors = getNeighbors(grid, targetRow, targetCol)
    const emptyNeighbors = neighbors.filter(([nr, nc]) => grid[nr]?.[nc] === EMPTY)
    if (emptyNeighbors.length === 0) return
    const [bestRow, bestCol] = emptyNeighbors.sort((a, b) => b[0] - a[0])[0]
    const newGrid = grid.map(r => [...r])
    newGrid[bestRow][bestCol] = shooter
    setLastPlaced([bestRow, bestCol])
    const matches = findMatches(newGrid, bestRow, bestCol, shooter)
    if (matches.length >= 3) {
      for (const [r, c] of matches) newGrid[r][c] = EMPTY
      const cleaned = removeFloating(newGrid)
      const hasAny = cleaned.some(row => row.some(c => c !== EMPTY))
      setGrid(cleaned)
      setScore(sc => sc + matches.length * 10)
      if (!hasAny) { setWon(true); return }
    } else {
      setGrid(newGrid)
    }
    setShooter(next)
    setNext(randomColor())
  }

  const bubbleSize = 100 / COLS

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>🫧</span>
        <div>
          <p className={s.gameSubtitle}>Match & clear</p>
          <h2 className={s.gameTitle}>Bubble Calm</h2>
        </div>
        {score > 0 && <div className={s.streakBadge} style={{ marginLeft: 'auto' }}>✦ {score}</div>}
      </div>

      {won ? (
        <div style={{ textAlign: 'center', padding: '20px 0' }}>
          <p className={s.feedbackCorrect} style={{ fontSize: 16 }}>✦ Board cleared</p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 12, fontFamily: 'var(--font-main)', margin: '8px 0 16px' }}>Score: {score}</p>
          <button className={s.smallBtn} onClick={reset}>Play again</button>
        </div>
      ) : (
        <>
          {/* Board constrained to max 320px and centered */}
          <div style={{ width: '100%', maxWidth: 320, margin: '0 auto' }}>
            <div style={{ position: 'relative', width: '100%', paddingBottom: `${(ROWS / COLS) * 100}%`, userSelect: 'none' }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                {grid.map((row, r) =>
                  row.map((color, c) => {
                    const offset = r % 2 === 0 ? 0 : bubbleSize / 2
                    const isLast = lastPlaced && lastPlaced[0] === r && lastPlaced[1] === c
                    return (
                      <div
                        key={`${r}-${c}`}
                        onClick={() => color !== EMPTY && handleBubbleClick(r, c)}
                        style={{
                          position: 'absolute',
                          left: `${offset + c * bubbleSize}%`,
                          top: `${r * bubbleSize}%`,
                          width: `${bubbleSize}%`,
                          paddingBottom: `${bubbleSize}%`,
                          cursor: color !== EMPTY ? 'pointer' : 'default',
                        }}
                      >
                        {color !== EMPTY && (
                          <div style={{
                            position: 'absolute',
                            inset: '6%',
                            borderRadius: '50%',
                            background: color,
                            boxShadow: isLast
                              ? `0 0 0 2px white, 0 0 0 3px ${color}, inset -2px -2px 4px rgba(0,0,0,0.1)`
                              : 'inset -2px -2px 4px rgba(0,0,0,0.1), inset 2px 2px 4px rgba(255,255,255,0.5)',
                            transition: 'transform 0.1s',
                            transform: isLast ? 'scale(1.1)' : 'scale(1)',
                          }} />
                        )}
                      </div>
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 20, marginTop: 8 }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-main)', marginBottom: 4 }}>NEXT</p>
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: next, margin: '0 auto', boxShadow: 'inset -1px -1px 3px rgba(0,0,0,0.1)' }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: 'var(--color-text-muted)', fontSize: 9, fontFamily: 'var(--font-main)', marginBottom: 4 }}>SHOOT</p>
              <div style={{ width: 38, height: 38, borderRadius: '50%', background: shooter, margin: '0 auto', boxShadow: 'inset -2px -2px 5px rgba(0,0,0,0.1), inset 2px 2px 5px rgba(255,255,255,0.5)', border: '2px solid rgba(255,255,255,0.5)' }} />
            </div>
            <button className={s.ghostBtn} onClick={reset}>Reset</button>
          </div>

          <p style={{ color: 'var(--color-text-muted)', fontSize: 11, fontFamily: 'var(--font-main)', textAlign: 'center', marginTop: 4 }}>
            Tap a bubble to place next to it — match 3+ to clear
          </p>
        </>
      )}
    </div>
  )
}
