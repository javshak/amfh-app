import { useState } from 'react'
import s from './Login.module.css'

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('')

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  function handleContinue() {
    if (valid) onLogin(email)
  }

  return (
    <div className={s.page}>
      <div className={s.bgLayer}>
        <img src="/reset-background.svg" alt="" className={s.bgImg} />
      </div>
      <div className={s.inner}>
        <div className={s.logoWrap}>
          <span className={s.logoText}>A MINUTE<br />FOR<br />MENTAL<br />HEALTH</span>
        </div>
        <p className={s.title}>Welcome.</p>
        <p className={s.sub}>Enter your email to get started.<br />You won't need a password.</p>
        <input
          className={s.input}
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleContinue()}
          autoComplete="email"
        />
        <button
          className={s.continueBtn}
          onClick={handleContinue}
          disabled={!valid}
        >
          Continue
        </button>
        <p className={s.privacy}>Your email is stored only on this device.<br />It is never shared or sent anywhere.</p>
      </div>
    </div>
  )
}
