import { useState, useEffect } from 'react'

const AUTH_KEY = 'amfh_auth'
const SIX_MONTHS_MS = 1000 * 60 * 60 * 24 * 180

export function useAuth() {
  const [authed, setAuthed] = useState(null) // null = loading

  useEffect(() => {
    const raw = localStorage.getItem(AUTH_KEY)
    if (raw) {
      try {
        const { email, expiry } = JSON.parse(raw)
        if (email && Date.now() < expiry) {
          setAuthed(true)
          return
        }
      } catch {}
    }
    setAuthed(false)
  }, [])

  function login(email) {
    localStorage.setItem(AUTH_KEY, JSON.stringify({
      email,
      expiry: Date.now() + SIX_MONTHS_MS,
    }))
    setAuthed(true)
  }

  function logout() {
    localStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }

  return { authed, login, logout }
}
