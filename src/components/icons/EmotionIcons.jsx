const c = 'var(--color-accent)'
const s = { width: 18, height: 18, display: 'block', flexShrink: 0 }

export const IconOverwhelmed = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 13c0-1.7 1.3-2 3-2s3 .3 3 2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7 8l1.5 1M13 8l-1.5 1" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8 6l-2-1M12 6l2-1" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const IconAnxious = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 13.5c.5-1 1.5-1.5 3-1.5s2.5.5 3 1.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="7.5" cy="8.5" r="1" fill={c}/>
    <circle cx="12.5" cy="8.5" r="1" fill={c}/>
    <path d="M8 6.5c.5-.8 1.2-1 2-1" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const IconSad = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 14c.5-1.5 1.5-2 3-2s2.5.5 3 2" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="7.5" cy="8.5" r="1" fill={c}/>
    <circle cx="12.5" cy="8.5" r="1" fill={c}/>
    <path d="M12 6.5c.5.5.6 1.2.3 1.8" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const IconFrustrated = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 14c.5-1.2 1.5-1.8 3-1.8s2.5.6 3 1.8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7 7.5l2 1.5M13 7.5l-2 1.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M8.5 11h3" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const IconStuck = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7.5 13.5h5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <circle cx="7.5" cy="8.5" r="1" fill={c}/>
    <circle cx="12.5" cy="8.5" r="1" fill={c}/>
    <path d="M10 11v2" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const IconCalm = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 12.5c.8 1 1.8 1.5 3 1.5s2.2-.5 3-1.5" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7.5 8.5c.3-.3.7-.5 1-.5s.7.2 1 .5M10.5 8.5c.3-.3.7-.5 1-.5s.7.2 1 .5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
)

export const IconGrateful = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 12c.8 1.2 1.8 1.8 3 1.8s2.2-.6 3-1.8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7.5 8c.5-.5 1-.5 1.5 0s1 .5 1.5 0" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10 8v1" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
    <path d="M12.5 7l.8-1.2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const IconHopeful = () => (
  <svg style={s} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8" stroke={c} strokeWidth="1.5"/>
    <path d="M7 12c.8 1.2 1.8 1.8 3 1.8s2.2-.6 3-1.8" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    <path d="M7.5 8.5c.3-.4.7-.5 1-.5M11.5 8.5c.3-.4.7-.5 1-.5" stroke={c} strokeWidth="1.3" strokeLinecap="round"/>
    <path d="M10 5.5v1.5M12.5 6l-1 1.2M7.5 6l1 1.2" stroke={c} strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
)

export const EMOTION_TAGS = [
  { id: 'overwhelmed', label: 'Overwhelmed', Icon: IconOverwhelmed },
  { id: 'anxious',     label: 'Anxious',     Icon: IconAnxious },
  { id: 'sad',         label: 'Sad',         Icon: IconSad },
  { id: 'frustrated',  label: 'Frustrated',  Icon: IconFrustrated },
  { id: 'stuck',       label: 'Stuck',       Icon: IconStuck },
  { id: 'calm',        label: 'Calm',        Icon: IconCalm },
  { id: 'grateful',    label: 'Grateful',    Icon: IconGrateful },
  { id: 'hopeful',     label: 'Hopeful',     Icon: IconHopeful },
]
