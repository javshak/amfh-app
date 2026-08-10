import { useState } from 'react'
import s from './Games.module.css'

const STEPS = [
  { num: 5, sense: 'see',   prompt: 'Look around. Name 5 things you can see right now.' },
  { num: 4, sense: 'touch', prompt: 'Reach out. Name 4 things you can physically touch.' },
  { num: 3, sense: 'hear',  prompt: 'Go still. Name 3 sounds you can hear right now.' },
  { num: 2, sense: 'smell', prompt: 'Breathe slowly. Name 2 things you can smell.' },
  { num: 1, sense: 'taste', prompt: 'Notice. Name 1 thing you can taste right now.' },
]

export default function GroundingGame() {
  const [step, setStep] = useState(0)
  const [inputs, setInputs] = useState(Array(5).fill(''))
  const [done, setDone] = useState(false)

  const current = STEPS[step]
  const currentInput = inputs[step]

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else setDone(true)
  }

  function restart() {
    setStep(0)
    setInputs(Array(5).fill(''))
    setDone(false)
  }

  if (done) {
    return (
      <div className={s.gameCard}>
        <div className={s.gameHeader}>
          <span className={s.gameEmoji}>✋</span>
          <div><p className={s.gameSubtitle}>Grounding complete</p><h2 className={s.gameTitle}>5-4-3-2-1</h2></div>
        </div>
        <div style={{textAlign:'center',padding:'12px 0'}}>
          <p className={s.feedbackCorrect} style={{fontSize:15}}>✦ You are here. You are present.</p>
          <p style={{color:'var(--color-text-secondary)',fontSize:13,marginTop:8,fontFamily:'var(--font-main)'}}>Take a slow breath before you continue.</p>
          <button className={s.smallBtn} style={{marginTop:16}} onClick={restart}>Start again</button>
        </div>
      </div>
    )
  }

  return (
    <div className={s.gameCard}>
      <div className={s.gameHeader}>
        <span className={s.gameEmoji}>✋</span>
        <div><p className={s.gameSubtitle}>Grounding exercise</p><h2 className={s.gameTitle}>5-4-3-2-1</h2></div>
      </div>
      <div className={s.gs2Dots}>
        {STEPS.map((_, i) => <div key={i} className={`${s.gs2Dot} ${i === step ? s.gs2DotActive : i < step ? s.gs2DotDone : ''}`} />)}
      </div>
      <p className={s.gs2Num}>{current.num}</p>
      <p className={s.gs2Sense}>things you can {current.sense}</p>
      <p className={s.gs2Prompt}>{current.prompt}</p>
      <input
        className={s.gs2Input}
        type="text"
        placeholder={`I ${current.sense}…`}
        value={currentInput}
        onChange={e => {
          const next = [...inputs]
          next[step] = e.target.value
          setInputs(next)
        }}
        onKeyDown={e => e.key === 'Enter' && currentInput.trim() && next()}
      />
      <div className={s.wordControls} style={{marginTop:8}}>
        <button className={s.ghostBtn} onClick={next}>Skip</button>
        <button className={s.nextBtn} onClick={next} disabled={!currentInput.trim()} style={{flex:1}}>
          {step === STEPS.length - 1 ? 'Finish ✓' : 'Next →'}
        </button>
      </div>
    </div>
  )
}
