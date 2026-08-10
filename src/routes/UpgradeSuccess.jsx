import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import s from './Upgrade.module.css'

export default function UpgradeSuccess() {
  const navigate = useNavigate()

  useEffect(() => {
    // Set isPremium in localStorage so app unlocks immediately
    try {
      const raw = localStorage.getItem('amfh_usage')
      const usage = raw ? JSON.parse(raw) : {}
      localStorage.setItem('amfh_usage', JSON.stringify({ ...usage, isPremium: true }))
    } catch {}
  }, [])

  return (
    <div className={s.page}>
      <div className={s.bg} />
      <div className={s.content}>
        <img src="/logo.png" alt="AMFH" className={s.logo} />
        <p className={s.eyebrow}>Welcome to Premium</p>
        <h1 className={s.title}>You're all set ✦</h1>
        <p className={s.sub}>
          Your subscription is active. Enjoy unlimited access to all tools and features.
        </p>
        <div className={s.features}>
          {[
            'Unlimited weekly usage unlocked',
            'Journal entries synced across devices',
            'Full access to all tools',
          ].map(f => (
            <div key={f} className={s.featureRow}>
              <span className={s.check}>✓</span>
              <span className={s.featureText}>{f}</span>
            </div>
          ))}
        </div>
        <button className={s.upgradeBtn} onClick={() => navigate('/')}>
          Continue to app →
        </button>
      </div>
    </div>
  )
}
