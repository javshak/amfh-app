import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import s from './Upgrade.module.css'

const API_BASE = import.meta.env.VITE_API_URL

export default function Upgrade() {
  const navigate = useNavigate()
  const { email: authEmail } = useAuth()
  const email = authEmail || (() => {
    try { return JSON.parse(localStorage.getItem('amfh_auth'))?.email } catch { return null }
  })()
  const [error, setError] = useState(null)

  useEffect(() => {
    async function startCheckout() {
      try {
        const res = await fetch(`${API_BASE}/create-checkout-session`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Failed')
        window.open(data.url, '_blank')
      } catch (e) {
        setError('Could not connect to payment. Please try again.')
      }
    }
    startCheckout()
  }, [email])

  return (
    <div className={s.page}>
      <div className={s.bg} />
      <div className={s.header}>
        <button className={s.backBtn} onClick={() => navigate(-1)}>←</button>
      </div>
      <div className={s.content}>
        <img src="/logo.png" alt="AMFH" className={s.logo} />
        {error ? (
          <>
            <p className={s.title}>Something went wrong</p>
            <p className={s.sub}>{error}</p>
            <button className={s.upgradeBtn} onClick={() => window.location.reload()}>
              Try again
            </button>
            <button className={s.skipBtn} onClick={() => navigate('/')}>Go back</button>
          </>
        ) : (
          <>
            <p className={s.eyebrow}>Redirecting to checkout</p>
            <p className={s.title}>AMFH Premium</p>
            <p className={s.sub}>Taking you to secure payment…</p>
            <div className={s.spinner} />
          </>
        )}
      </div>
    </div>
  )
}
