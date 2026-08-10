import { useState, useEffect } from 'react'
import s from './InstallBanner.module.css'

const DISMISSED_KEY = 'amfh_install_dismissed'

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches
    || window.navigator.standalone === true
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [show, setShow] = useState(false)
  const [ios, setIos] = useState(false)

  useEffect(() => {
    // Don't show if already installed or dismissed
    if (isInStandaloneMode()) return
    if (localStorage.getItem(DISMISSED_KEY)) return

    setIos(isIOS())

    if (isIOS()) {
      // Show iOS guide banner after short delay
      const t = setTimeout(() => setShow(true), 2000)
      return () => clearTimeout(t)
    }

    // Android/Desktop — wait for browser install prompt
    const handler = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  function handleInstall() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then(() => {
        setDeferredPrompt(null)
        setShow(false)
      })
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className={s.banner}>
      <div className={s.iconWrap}>
        <img src="/apple-touch-icon.png" alt="AMFH" className={s.icon} />
      </div>
      <div className={s.text}>
        <p className={s.title}>Install the app</p>
        {ios ? (
          <p className={s.sub}>Tap <strong>Share</strong> then <strong>Add to Home Screen</strong></p>
        ) : (
          <p className={s.sub}>Get the full experience — works offline too</p>
        )}
      </div>
      {!ios && (
        <button className={s.installBtn} onClick={handleInstall}>Install</button>
      )}
      <button className={s.closeBtn} onClick={handleDismiss} aria-label="Dismiss">✕</button>
    </div>
  )
}
