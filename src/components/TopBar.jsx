import { useState, useEffect } from 'react'
import s from './TopBar.module.css'

const SIZES = ['S', 'M', 'L']
const FONT_CLASS = { S: 'font-small', M: 'font-medium', L: 'font-large' }
const STORAGE_KEY = 'amfh_font_size'
const BYPASS_KEY = 'amfh_bypass_until'
const BYPASS_MINUTES = 15

export default function TopBar({ isLocked, onBypass }) {
  const [size, setSize] = useState(() => localStorage.getItem(STORAGE_KEY) || 'M')

  function applySize(sz) {
    document.body.classList.remove('font-small', 'font-medium', 'font-large')
    document.body.classList.add(FONT_CLASS[sz])
    localStorage.setItem(STORAGE_KEY, sz)
  }

  useEffect(() => { applySize(size) }, [])

  function handleSize(sz) {
    setSize(sz)
    applySize(sz)
  }

  function handleBypass() {
    const until = Date.now() + BYPASS_MINUTES * 60 * 1000
    localStorage.setItem(BYPASS_KEY, until.toString())
    if (onBypass) onBypass()
  }

  return (
    <div className={s.bar}>
      <span className={s.appName}>A Minute for Mental Health</span>
      <div className={s.rightGroup}>
        {isLocked && (
          <>
            <span className={s.dot}>·</span>
            <button className={s.bypassLink} onClick={handleBypass}>
              +15 min
            </button>
          </>
        )}
        <button className={s.upgradeLink} onClick={() => { window.location.replace('/#/upgrade') }}>
          Upgrade
        </button>
        <div className={s.sizeGroup}>
          {SIZES.map(sz => (
            <button
              key={sz}
              className={`${s.sizeBtn} ${size === sz ? s.sizeBtnActive : ''}`}
              onClick={() => handleSize(sz)}
              aria-label={`Font size ${sz}`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
