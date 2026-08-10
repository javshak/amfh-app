import { useNavigate } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import BottomNav from '../components/BottomNav'
import BottomSheet from '../components/BottomSheet'
import { useResetFlow, SCREENS } from '../hooks/useResetFlow'
import s from './Reset.module.css'

const CIRCUMFERENCE = 2 * Math.PI * 88

export default function Reset() {
  const navigate = useNavigate()
  const {
    screen, phase, cycleCount, secondsLeft, progress,
    gsStep, gsData, GROUNDING_STEPS,
    sheetOpen, setSheet,
    startBreathing, goGrounding, nextGroundingStep, goIntro,
    TOTAL_CYCLES,
  } = useResetFlow()

  const audioRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [volume, setVolume] = useState(0.5)

  // Only play audio during BREATHING screen
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (screen === SCREENS.BREATHING) {
      audio.volume = volume
      audio.play().catch(() => {})
    } else {
      audio.pause()
      audio.currentTime = 0
    }
  }, [screen])

  // Update volume in real time
  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  function toggleMute() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(m => !m)
  }

  const ringOffset = CIRCUMFERENCE * (1 - progress)
  const isExpanded = phase?.expand

  const sheetOptions = [
    { icon: '✋', label: '5-4-3-2-1 grounding', action: goGrounding },
    { icon: '⟶', label: 'Skip to return', action: () => {} },
  ]

  const bgAnim = {
    [SCREENS.INTRO]:      s.animIntro,
    [SCREENS.BREATHING]:  s.animBreathing,
    [SCREENS.GROUNDING]:  s.animGrounding,
    [SCREENS.RETURN]:     s.animGrounding,
  }[screen]

  return (
    <div className={s.page}>
      <audio ref={audioRef} src="/reset-ambient.mp3" loop preload="auto" />

      <div className={s.bgLayer}>
        <img src="/reset-background.svg" alt="" className={`${s.visible} ${bgAnim}`} />
      </div>

      <div className={s.header}>
        <button className={s.backBtn} onClick={() => screen === SCREENS.INTRO ? navigate('/') : goIntro()}>←</button>
        <span className={s.headerTitle}>Reset Mode</span>
        <div className={s.headerRight}>
          {screen === SCREENS.BREATHING && (
            <>
              <button className={s.muteBtn} onClick={toggleMute} title={muted ? 'Unmute' : 'Mute'}>
                {muted ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <line x1="23" y1="9" x2="17" y2="15"/>
                    <line x1="17" y1="9" x2="23" y2="15"/>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                    <path d="M15.54 8.46a5 5 0 010 7.07"/>
                    <path d="M19.07 4.93a10 10 0 010 14.14"/>
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={muted ? 0 : volume}
                onChange={e => {
                  const v = parseFloat(e.target.value)
                  setVolume(v)
                  if (audioRef.current) {
                    audioRef.current.muted = false
                    audioRef.current.volume = v
                    setMuted(false)
                  }
                }}
                className={s.volumeSlider}
              />
              <button className={s.altBtn} onClick={() => setSheet(true)}>Try something else</button>
            </>
          )}
        </div>
      </div>

      <div className={s.content}>

        {screen === SCREENS.INTRO && (
          <>
            <p className={s.introText}>You are safe.<br />You are here.<br />You are enough.</p>
            <p className={s.introSub}>Follow the steps to ground yourself.</p>
            <button className={s.startBtn} onClick={startBreathing}>Start Reset</button>
          </>
        )}

        {screen === SCREENS.BREATHING && (
          <>
            <p className={s.phaseLabel}>{phase.label}</p>
            <div className={s.circleWrap}>
              <div className={`${s.glow} ${isExpanded ? s.glowExpanded : ''}`} />
              <svg className={s.ringSvg} viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="88" fill="none" stroke="var(--color-border)" strokeWidth="2" />
                <circle
                  cx="100" cy="100" r="88"
                  fill="none"
                  stroke="var(--color-accent)"
                  strokeWidth="2.5"
                  strokeDasharray={CIRCUMFERENCE}
                  strokeDashoffset={ringOffset}
                  strokeLinecap="round"
                  style={{ transform: 'rotate(-90deg)', transformOrigin: 'center', transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <div className={`${s.innerCircle} ${isExpanded ? s.innerExpanded : ''}`}>
                <span className={s.countdownNum}>{secondsLeft}</span>
                <span className={s.countdownSub}>seconds</span>
              </div>
            </div>
            <p className={s.cycleText}>Cycle {cycleCount + 1} of {TOTAL_CYCLES}</p>
            <button className={s.pauseBtn} onClick={() => setSheet(true)}>Pause</button>
          </>
        )}

        {screen === SCREENS.GROUNDING && (
          <>
            <div className={s.dots}>
              {GROUNDING_STEPS.map((_, i) => (
                <div key={i} className={`${s.dot} ${i === gsStep ? s.dotActive : ''}`} />
              ))}
            </div>
            <p className={s.gsNum}>{gsData.num}</p>
            <p className={s.gsSense}>{gsData.sense}</p>
            <p className={s.gsPrompt}>{gsData.prompt}</p>
            <button className={s.nextBtn} onClick={nextGroundingStep}>{gsData.btn}</button>
          </>
        )}

        {screen === SCREENS.RETURN && (
          <>
            <div className={s.returnIcon}>✦</div>
            <p className={s.returnQ}>Do you feel more settled?</p>
            <p className={s.returnSub}>You did something kind for yourself just now.</p>
            <button className={s.returnYes} onClick={() => navigate('/')}>Yes — return home</button>
            <button className={s.returnNo} onClick={startBreathing}>Not yet — try again</button>
          </>
        )}
      </div>

      {sheetOpen && (
        <BottomSheet
          title="Try something else"
          options={sheetOptions}
          onClose={() => setSheet(false)}
        />
      )}

      <BottomNav />
    </div>
  )
}
