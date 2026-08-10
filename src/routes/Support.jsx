import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import { ROLES, ROLE_CATEGORIES } from '../data/roles'
import { ROLE_ICON_MAP, CATEGORY_ICON_MAP } from '../components/icons/RoleIcons'
import { searchRoles, getRolesByCategory } from '../utils/roleSearch'
import s from './Support.module.css'

const STEPS = [
  { key: 'stressors',   label: 'Common stressors',       title: 'What people in your role often carry' },
  { key: 'notices',     label: 'What you might notice',  title: 'Signs to watch for in yourself' },
  { key: 'tip',         label: 'Practical tip',          title: 'Something you can try today' },
  { key: 'fact',        label: 'Evidence-informed',      title: 'What the research says' },
  { key: 'reflection',  label: 'Reflection prompt',      title: 'A question to sit with' },
  { key: 'reset',       label: 'Quick reset tool',       title: 'When you need to regulate now' },
]

function RoleDetail({ role, onBack }) {
  const [step, setStep] = useState(0)
  const [tapped, setTapped] = useState(new Set())
  const navigate = useNavigate()
  const current = STEPS[step]

  function handleStepChange(next) {
    setStep(next)
    setTapped(new Set()) // reset tapped state for new step
  }

  return (
    <>
      <div className={s.detailPage}>
        <div className={s.detailHeader}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <span className={s.detailEmoji}>{(() => { const Icon = ROLE_ICON_MAP[role.slug]; return Icon ? <Icon /> : role.emoji })()}</span>
          <span className={s.detailName}>{role.roleName}</span>
        </div>

        <div className={s.stepProgress}>
          {STEPS.map((_, i) => (
            <div key={i} className={`${s.stepDot} ${i <= step ? s.stepDotActive : ''}`} />
          ))}
        </div>

        <div className={s.stepContent}>
          <p className={s.stepLabel}>{current.label}</p>
          <p className={s.stepTitle}>{current.title}</p>

          {(current.key === 'stressors' || current.key === 'notices') && (() => {
            const items = current.key === 'stressors' ? role.commonStressors : role.whatYouMightNotice
            const allTapped = items.every((_, i) => tapped.has(i))
            return (
              <div className={s.tappableList}>
                {items.map((item, i) => (
                  <button
                    key={i}
                    className={`${s.tappableItem} ${tapped.has(i) ? s.tappableItemDone : ''}`}
                    onClick={() => setTapped(prev => new Set([...prev, i]))}
                  >
                    <span className={s.tappableCheck}>{tapped.has(i) ? '✓' : ''}</span>
                    <span className={s.tappableText}>{item}</span>
                  </button>
                ))}
                {allTapped && (
                  <p className={s.allReadText}>You've read them all. Continue when ready.</p>
                )}
              </div>
            )
          })()}

          {current.key === 'tip' && (
            <p className={s.stepBody}>{role.practicalTip}</p>
          )}

          {current.key === 'fact' && (
            <p className={s.stepBody}>{role.evidenceInformedFact}</p>
          )}

          {current.key === 'reflection' && (
            <div className={s.reflectionBox}>
              <p className={s.reflectionText}>"{role.reflectionPrompt}"</p>
            </div>
          )}

          {current.key === 'reset' && (
            <div className={s.resetCard}>
              <p className={s.resetCardTitle}>{role.quickResetTool.name}</p>
              <p className={s.resetCardDesc}>{role.quickResetTool.description}</p>
              <button className={s.resetCardBtn} onClick={() => navigate('/reset')}>
                Open Reset Mode →
              </button>
            </div>
          )}
        </div>

        <div className={s.carouselNav}>
          <button
            className={s.arrowBtn}
            onClick={() => handleStepChange(step - 1)}
            disabled={step === 0}
          >
            ‹
          </button>
          <span className={s.carouselCount}>{step + 1} / {STEPS.length}</span>
          {step < STEPS.length - 1 ? (
            <button className={s.arrowBtn} onClick={() => handleStepChange(step + 1)}>›</button>
          ) : (
            <button className={s.arrowBtnDone} onClick={onBack}>✓</button>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

export default function Support() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState(null)
  const [results, setResults] = useState([])
  const [selectedRole, setSelectedRole] = useState(null)

  useEffect(() => {
    if (query.trim().length >= 2) {
      setActiveCategory(null)
      setResults(searchRoles(query))
    } else if (activeCategory) {
      setResults(getRolesByCategory(activeCategory))
    } else {
      setResults([])
    }
  }, [query, activeCategory])

  function handleCategoryTap(id) {
    setQuery('')
    setActiveCategory(prev => prev === id ? null : id)
  }

  if (selectedRole) {
    return <RoleDetail role={selectedRole} onBack={() => setSelectedRole(null)} />
  }

  return (
    <>
      <div className={s.page}>
        <div className={s.header}>
          <p className={s.headerTitle}>Support</p>
          <p className={s.headerSub}>Mental health resources tailored to your profession.</p>
        </div>

        <div className={s.searchWrap}>
          <input
            className={s.searchInput}
            type="text"
            placeholder="Tell us your profession or line of work…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className={s.categoryRow}>
          {ROLE_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${s.categoryPill} ${activeCategory === cat.id ? s.categoryPillActive : ''}`}
              onClick={() => handleCategoryTap(cat.id)}
            >
              {(() => { const Icon = CATEGORY_ICON_MAP[cat.id]; return Icon ? <><Icon />{' '}</> : cat.emoji + ' ' })()}{cat.label}
            </button>
          ))}
        </div>

        <div className={s.results}>
          {results.length > 0 ? results.map(role => (
            <div key={role.slug} className={s.roleCard} onClick={() => setSelectedRole(role)}>
              <span className={s.roleEmoji}>{(() => { const Icon = ROLE_ICON_MAP[role.slug]; return Icon ? <Icon /> : role.emoji })()}</span>
              <div className={s.roleInfo}>
                <p className={s.roleName}>{role.roleName}</p>
                <p className={s.roleTagline}>{role.tagline}</p>
              </div>
              <span className={s.roleArrow}>→</span>
            </div>
          )) : (
            <div className={s.emptyState}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <p className={s.emptyText}>
                {query.length >= 2
                  ? `No match for "${query}". Try a different term or browse by category.`
                  : 'Type your profession above or tap a category to browse.'}
              </p>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
