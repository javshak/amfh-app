import { useState } from 'react'
import BottomNav from '../BottomNav'
import ColorMatch from './ColorMatch'
import CalmWords from './CalmWords'
import MemoryTiles from './MemoryTiles'
import GratitudeFlash from './GratitudeFlash'
import GroundingGame from './GroundingGame'
import BubbleShooter from './BubbleShooter'
import { IconColorMatch, IconCalmWords, IconMemoryTiles, IconGratitude, IconGrounding } from '../icons/GameIcons'
import s from '../../routes/Learn.module.css'
import gs from './Games.module.css'

const IconBubble = () => (
  <svg style={{ width: 16, height: 16, display: 'block', flexShrink: 0 }} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="10" cy="10" r="7"/>
    <circle cx="7" cy="8" r="2"/>
    <circle cx="13" cy="12" r="3"/>
    <circle cx="6" cy="13" r="1.5"/>
  </svg>
)

const GAME_TABS = [
  { id: 'color',      label: 'Color Match',  Icon: IconColorMatch },
  { id: 'calmwords',  label: 'Calm Words',   Icon: IconCalmWords },
  { id: 'memory',     label: 'Memory Tiles', Icon: IconMemoryTiles },
  { id: 'gratitude',  label: 'Gratitude',    Icon: IconGratitude },
  { id: 'grounding',  label: '5-4-3-2-1',   Icon: IconGrounding },
  { id: 'bubble',     label: 'Bubble Calm',  Icon: IconBubble },
]

export default function GamesScreen({ onBack }) {
  const [active, setActive] = useState('color')

  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.header}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <div>
            <p className={s.headerTitle}>Games</p>
            <p className={s.headerSub}>Light activities to shift your focus.</p>
          </div>
        </div>
        <div className={s.content}>
          <div className={gs.tabRow}>
            {GAME_TABS.map(({ id, label, Icon }) => (
              <button key={id} className={`${gs.tab} ${active === id ? gs.tabActive : ''}`} onClick={() => setActive(id)}>
                <Icon />{label}
              </button>
            ))}
          </div>
          {active === 'color'     && <ColorMatch />}
          {active === 'calmwords' && <CalmWords />}
          {active === 'memory'    && <MemoryTiles />}
          {active === 'gratitude' && <GratitudeFlash />}
          {active === 'grounding' && <GroundingGame />}
          {active === 'bubble'    && <BubbleShooter />}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
