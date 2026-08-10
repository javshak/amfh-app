import { useState, useEffect, useCallback } from 'react'
import CryptoJS from 'crypto-js'
import { storage } from '../utils/storage'
import { EMOTION_TAGS } from '../components/icons/EmotionIcons'

const SECRET = 'amfh_phase1_secret'
const ENTRIES_KEY = 'journal_entries'
const PENDING_SYNC_KEY = 'amfh_journal_pending_sync'

export { EMOTION_TAGS }
export const VIEWS = { WRITE: 'write', SAVED: 'saved', ENTRIES: 'entries' }

function encrypt(text) { return CryptoJS.AES.encrypt(text, SECRET).toString() }
function decrypt(ciphertext) {
  try { return CryptoJS.AES.decrypt(ciphertext, SECRET).toString(CryptoJS.enc.Utf8) }
  catch { return '' }
}

function loadEntries() {
  const raw = storage.get(ENTRIES_KEY)
  if (!Array.isArray(raw)) return []
  return raw.map(e => ({ ...e, text: decrypt(e.text) }))
}

function saveEntries(entries) {
  storage.set(ENTRIES_KEY, entries.map(e => ({ ...e, text: encrypt(e.text) })))
}

async function syncToTurso(apiBaseUrl, email, entries) {
  if (!apiBaseUrl || !email || !navigator.onLine) {
    localStorage.setItem(PENDING_SYNC_KEY, 'true')
    return
  }
  try {
    const payload = entries.map(e => ({
      ...e,
      text: encrypt(e.text), // encrypted before sending
    }))
    const res = await fetch(`${apiBaseUrl}/entries/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, entries: payload }),
    })
    if (res.ok) localStorage.removeItem(PENDING_SYNC_KEY)
  } catch {
    localStorage.setItem(PENDING_SYNC_KEY, 'true')
  }
}

async function fetchFromTurso(apiBaseUrl, email) {
  if (!apiBaseUrl || !email) return null
  try {
    const res = await fetch(`${apiBaseUrl}/entries/${encodeURIComponent(email)}`)
    if (!res.ok) return null
    const rows = await res.json()
    return rows.map(row => ({
      id: row.id,
      date: row.date,
      tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags,
      text: decrypt(row.encrypted_text),
    }))
  } catch { return null }
}

export function useReflect({ email, apiBaseUrl } = {}) {
  const [view, setView] = useState(VIEWS.WRITE)
  const [selectedTags, setSelectedTags] = useState([])
  const [text, setText] = useState('')
  const [entries, setEntries] = useState([])

  useEffect(() => {
    const local = loadEntries()
    setEntries(local)

    // Pull from Turso and merge if online
    if (email && apiBaseUrl && navigator.onLine) {
      fetchFromTurso(apiBaseUrl, email).then(remote => {
        if (!remote) return
        // Merge: remote entries take precedence, keyed by id
        const map = new Map()
        remote.forEach(e => map.set(e.id, e))
        local.forEach(e => { if (!map.has(e.id)) map.set(e.id, e) })
        const merged = Array.from(map.values()).sort((a, b) => b.id - a.id)
        setEntries(merged)
        saveEntries(merged)
      })
    }

    // Sync pending if back online
    if (localStorage.getItem(PENDING_SYNC_KEY) && navigator.onLine) {
      syncToTurso(apiBaseUrl, email, local)
    }
  }, [email, apiBaseUrl])

  function toggleTag(id) {
    setSelectedTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  function save() {
    const now = new Date()
    const entry = {
      id: now.getTime(),
      date: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        + ' · ' + now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      tags: selectedTags,
      text: text.trim(),
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    saveEntries(updated)
    syncToTurso(apiBaseUrl, email, updated)
    setView(VIEWS.SAVED)
  }

  function newEntry() {
    setSelectedTags([])
    setText('')
    setView(VIEWS.WRITE)
  }

  const canSave = text.trim().length > 0 || selectedTags.length > 0

  return { view, setView, selectedTags, toggleTag, text, setText, entries, canSave, save, newEntry }
}
