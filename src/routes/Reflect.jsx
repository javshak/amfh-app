import BottomNav from '../components/BottomNav'
import { useReflect, VIEWS, EMOTION_TAGS } from '../hooks/useReflect'
import { useAuth } from '../hooks/useAuth'
import s from './Reflect.module.css'

const API_BASE = import.meta.env.VITE_API_URL

export default function Reflect() {
  const { email } = useAuth()
  const {
    view, setView,
    selectedTags, toggleTag,
    text, setText,
    entries,
    canSave,
    save,
    newEntry,
  } = useReflect({ email, apiBaseUrl: API_BASE })

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  }) + ' · ' + new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

  function getTagLabel(id) {
    return EMOTION_TAGS.find(t => t.id === id)?.label || id
  }

  return (
    <div className={s.page}>
      <div className={s.bgLayer}>
        <img src="/reflect-background.svg" alt="" className={s.bgImg} />
      </div>

      {view === VIEWS.WRITE && (
        <>
          <div className={s.header}>
            <span className={s.headerTitle}>Reflect</span>
            <div className={s.headerActions}>
              <button className={s.historyBtn} onClick={() => setView(VIEWS.ENTRIES)}>History</button>
              <button className={s.saveBtn} onClick={save} disabled={!canSave}>Save</button>
            </div>
          </div>
          <div className={s.content}>
            <p className={s.dateText}>{today}</p>
            <p className={s.tagLabel}>How are you feeling?</p>
            <div className={s.tagRow}>
              {EMOTION_TAGS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  className={`${s.tag} ${selectedTags.includes(id) ? s.tagSelected : ''}`}
                  onClick={() => toggleTag(id)}
                >
                  <Icon />{label}
                </button>
              ))}
            </div>
            <div className={s.divider} />
            <textarea
              className={s.textarea}
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={1000}
              placeholder="What's on your mind right now..."
            />
            <p className={s.charCount}>{text.length} / 1000</p>
          </div>
        </>
      )}

      {view === VIEWS.SAVED && (
        <>
          <div className={s.header}>
            <span className={s.headerTitle}>Reflect</span>
            <button className={s.newBtn} onClick={() => setView(VIEWS.ENTRIES)}>All entries</button>
          </div>
          <div className={s.savedWrap}>
            <div className={s.savedIcon}>✦</div>
            <p className={s.savedTitle}>Entry saved.</p>
            <p className={s.savedSub}>Your words are safe and private.<br />Only you can read them.</p>
            <button className={s.primaryBtn} onClick={newEntry}>Write another</button>
            <button className={s.secondaryBtn} onClick={() => setView(VIEWS.ENTRIES)}>View past entries</button>
          </div>
        </>
      )}

      {view === VIEWS.ENTRIES && (
        <>
          <div className={s.entriesHeader}>
            <span className={s.entriesTitle}>Past Entries</span>
            <button className={s.newBtn} onClick={newEntry}>+ New</button>
          </div>
          <div className={s.entriesList}>
            {entries.length === 0 ? (
              <div className={s.emptyState}>
                <span className={s.emptyIcon}>✎</span>
                <p className={s.emptyText}>No entries yet.<br />Your first one is waiting.</p>
              </div>
            ) : entries.map(e => (
              <div key={e.id} className={s.entryCard}>
                <div className={s.entryMeta}>
                  <span className={s.entryDate}>{e.date}</span>
                  <div className={s.entryTags}>
                    {e.tags.map(t => (
                      <span key={t} className={s.entryTag}>{getTagLabel(t)}</span>
                    ))}
                  </div>
                </div>
                {e.text && <p className={s.entryPreview}>{e.text}</p>}
              </div>
            ))}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
