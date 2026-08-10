import { useState, useEffect } from 'react'
import styles from './LockedScreen.module.css'

function formatCountdown(msRemaining) {
  if (msRemaining <= 0) return '0h 0m 0s'
  const totalSeconds = Math.floor(msRemaining / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  return `${hours}h ${minutes}m ${seconds}s`
}

export default function LockedScreen({ resetsAt, apiBaseUrl }) {
  const [countdown, setCountdown] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  useEffect(() => {
    const target = new Date(resetsAt).getTime()
    const update = () => setCountdown(formatCountdown(target - Date.now()))
    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [resetsAt])

  async function handleNotifyMe(e) {
    e.preventDefault()
    if (!email || status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch(`${apiBaseUrl}/notify-premium`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Request failed')
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  function handleUpgrade() {
    window.location.href = '/#/upgrade'
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>You've used your time for this week</h1>
        <p className={styles.subtitle}>
          Take this as a sign to rest. Your access refreshes automatically.
        </p>

        <div className={styles.countdownBlock}>
          <span className={styles.countdownLabel}>Resets in</span>
          <span className={styles.countdownValue}>{countdown}</span>
        </div>

        {/* Upgrade CTA */}
        <div className={styles.upgradeBlock}>
          <p className={styles.upgradeTitle}>Want unlimited access?</p>
          <p className={styles.upgradeText}>
            Upgrade to AMFH Premium for $4.99/month and remove the weekly limit.
          </p>
          <button className={styles.upgradeBtn} onClick={handleUpgrade}>
            Upgrade now →
          </button>
        </div>

        <div className={styles.comingSoon}>
          <p className={styles.comingSoonTitle}>Get notified when premium launches</p>
          {status === 'success' ? (
            <p className={styles.successText}>You're on the list — we'll be in touch.</p>
          ) : (
            <form className={styles.form} onSubmit={handleNotifyMe}>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={styles.emailInput}
                disabled={status === 'submitting'}
              />
              <button
                type="submit"
                className={styles.notifyButton}
                disabled={status === 'submitting'}
              >
                {status === 'submitting' ? 'Sending…' : 'Notify me'}
              </button>
            </form>
          )}
          {status === 'error' && (
            <p className={styles.errorText}>Something went wrong — please try again.</p>
          )}
        </div>
      </div>
    </div>
  )
}
