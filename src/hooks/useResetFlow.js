import { useState, useEffect, useRef } from 'react'

export const SCREENS = {
  INTRO: 'intro',
  BREATHING: 'breathing',
  GROUNDING: 'grounding',
  RETURN: 'return',
}

const PHASES = [
  { label: 'Breathe in',  duration: 4, expand: true },
  { label: 'Hold',        duration: 4, expand: true },
  { label: 'Breathe out', duration: 6, expand: false },
]

const TOTAL_CYCLES = 4
const TOTAL_TICKS = TOTAL_CYCLES * 14 // 4+4+6 per cycle

const GROUNDING_STEPS = [
  { num: 5, sense: 'things you can see',   prompt: 'Look around you. Name 5 things you can see right now.',       btn: 'I notice them' },
  { num: 4, sense: 'things you can touch', prompt: 'Reach out and touch 4 things. Feel their texture.',           btn: 'I feel them' },
  { num: 3, sense: 'things you can hear',  prompt: 'Go still. Listen. Name 3 sounds you can hear right now.',     btn: 'I hear them' },
  { num: 2, sense: 'things you can smell', prompt: 'Take a slow breath. Name 2 things you can smell.',            btn: 'I smell them' },
  { num: 1, sense: 'thing you can taste',  prompt: 'Notice what is in your mouth right now. Name it.',            btn: 'I feel more present' },
]

export function useResetFlow() {
  const [screen, setScreen]       = useState(SCREENS.INTRO)
  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [cycleCount, setCycle]    = useState(0)
  const [secondsLeft, setSeconds] = useState(PHASES[0].duration)
  const [totalTicks, setTicks]    = useState(0)
  const [gsStep, setGsStep]       = useState(0)
  const [sheetOpen, setSheet]     = useState(false)

  const timerRef   = useRef(null)
  const stateRef   = useRef({ phaseIdx: 0, cycleCount: 0, secondsLeft: 4, totalTicks: 0 })

  function stopTimer() {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null }
  }

  function startBreathing() {
    stopTimer()
    stateRef.current = { phaseIdx: 0, cycleCount: 0, secondsLeft: PHASES[0].duration, totalTicks: 0 }
    setPhaseIdx(0); setCycle(0); setSeconds(PHASES[0].duration); setTicks(0)
    setScreen(SCREENS.BREATHING)

    timerRef.current = setInterval(() => {
      const st = stateRef.current
      const next = { ...st, secondsLeft: st.secondsLeft - 1, totalTicks: st.totalTicks + 1 }

      if (next.secondsLeft <= 0) {
        const nextPhase = (st.phaseIdx + 1) % PHASES.length
        let nextCycle = st.cycleCount
        if (nextPhase === 0) {
          nextCycle = st.cycleCount + 1
          if (nextCycle >= TOTAL_CYCLES) {
            stopTimer()
            stateRef.current = next
            setTicks(next.totalTicks)
            goGrounding()
            return
          }
        }
        next.phaseIdx = nextPhase
        next.cycleCount = nextCycle
        next.secondsLeft = PHASES[nextPhase].duration
        setPhaseIdx(nextPhase)
        setCycle(nextCycle)
      }

      stateRef.current = next
      setSeconds(Math.max(0, next.secondsLeft))
      setTicks(next.totalTicks)
    }, 1000)
  }

  function goGrounding() {
    stopTimer()
    setGsStep(0)
    setScreen(SCREENS.GROUNDING)
  }

  function nextGroundingStep() {
    const next = gsStep + 1
    if (next >= GROUNDING_STEPS.length) { setScreen(SCREENS.RETURN); return }
    setGsStep(next)
  }

  function goIntro() {
    stopTimer()
    setScreen(SCREENS.INTRO)
    setSheet(false)
  }

  useEffect(() => () => stopTimer(), [])

  const phase    = PHASES[phaseIdx]
  const progress = Math.min(totalTicks / TOTAL_TICKS, 1)
  const gsData   = GROUNDING_STEPS[gsStep]

  return {
    screen, phase, cycleCount, secondsLeft, progress,
    gsStep, gsData, GROUNDING_STEPS,
    sheetOpen, setSheet,
    startBreathing, goGrounding, nextGroundingStep, goIntro,
    TOTAL_CYCLES,
  }
}
