import { useNavigate, useLocation } from 'react-router-dom'
import s from './BottomNav.module.css'

const NAV = [
  {
    label: 'Home', path: '/',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
        <path d="M9 21V12h6v9"/>
      </svg>
    ),
  },
  {
    label: 'Support', path: '/support',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
  },
  {
    label: 'Reset', path: '/reset',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 11-7.07 2.93"/>
        <polyline points="2 2 2 8 8 8"/>
      </svg>
    ),
  },
  {
    label: 'Learn', path: '/learn',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20l-8-4V8l8-4 8 4v8l-8 4z"/>
        <path d="M12 12L4 8M12 12l8-4M12 12v8"/>
      </svg>
    ),
  },
  {
    label: 'Reflect', path: '/reflect',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? 'var(--color-accent)' : 'var(--color-text-muted)'} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
]

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <nav className={s.nav}>
      {NAV.map(n => {
        const active = pathname === n.path
        return (
          <button
            key={n.path}
            className={`${s.item} ${active ? s.active : ''}`}
            onClick={() => navigate(n.path)}
          >
            <span className={`${s.iconWrap} ${active ? s.iconWrapActive : ''}`}>
              {n.icon(active)}
            </span>
            <span className={s.label}>{n.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
