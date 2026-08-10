const c = 'currentColor'
const s = { width: 16, height: 16, display: 'block', flexShrink: 0 }

export const IconColorMatch = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <circle cx="7" cy="7" r="4"/>
    <circle cx="13" cy="7" r="4"/>
    <circle cx="10" cy="13" r="4"/>
  </svg>
)

export const IconCalmWords = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="4" width="16" height="12" rx="2"/>
    <path d="M5 8h10M5 12h6"/>
  </svg>
)

export const IconMemoryTiles = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <rect x="2" y="2" width="7" height="7" rx="1.5"/>
    <rect x="11" y="2" width="7" height="7" rx="1.5"/>
    <rect x="2" y="11" width="7" height="7" rx="1.5"/>
    <rect x="11" y="11" width="7" height="7" rx="1.5"/>
  </svg>
)

export const IconGratitude = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <path d="M10 17s-7-4-7-9a7 7 0 0114 0c0 5-7 9-7 9z"/>
    <path d="M10 8v4M8 10h4"/>
  </svg>
)

export const IconGrounding = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none" stroke={c} strokeWidth="1.5" strokeLinecap="round">
    <path d="M10 2v10"/>
    <path d="M6 6l4-4 4 4"/>
    <path d="M4 14c0-1 .5-2 2-2.5M16 14c0-1-.5-2-2-2.5"/>
    <path d="M3 18c.5-2 2-3 7-3s6.5 1 7 3"/>
  </svg>
)
