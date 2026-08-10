import { useState } from 'react'
import BottomNav from '../components/BottomNav'
import { useQuiz, QUIZ_SCREENS } from '../hooks/useQuiz'
import quiz1 from '../data/quiz-emotional-overload.json'
import quiz2 from '../data/quiz-burnout-patterns.json'
import quiz3 from '../data/quiz-anxiety-panic.json'
import quiz4 from '../data/quiz-emotional-numbing.json'
import quiz5 from '../data/quiz-people-pleasing.json'
import quiz6 from '../data/quiz-shutdown-freeze.json'
import quiz7 from '../data/quiz-chronic-stress.json'
import quiz8 from '../data/quiz-workplace-stress.json'
import quiz9 from '../data/quiz-reset-recovery.json'
import { useNavigate } from 'react-router-dom'
import { ACTIVITY_MAP } from '../data/activityMap'
import articles from '../data/awareness-articles.json'
import GamesScreen from '../components/games/GamesScreen'
import s from './Learn.module.css'

const QUIZZES = [quiz1, quiz2, quiz3, quiz4, quiz5, quiz6, quiz7, quiz8, quiz9]

const SECTIONS = [
  {
    id: 'quizzes',
    title: 'Quizzes',
    desc: 'Quick check-ins to understand your stress patterns.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
    available: true,
  },
  {
    id: 'games',
    title: 'Games',
    desc: 'Light, calming activities to shift your focus.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="2"/>
        <path d="M6 12h4M8 10v4M15 11h.01M18 13h.01"/>
      </svg>
    ),
    available: true,
  },
  {
    id: 'awareness',
    title: 'Awareness',
    desc: 'Short articles on mental health topics.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    available: true,
  },
]

function ArticleView({ slug, onBack }) {
  const article = articles[slug]
  if (!article) return null

  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.header}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <div>
            <p className={s.headerTitle}>{article.title}</p>
            <p className={s.headerSub}>{article.summary}</p>
          </div>
        </div>
        <div className={s.content}>
          {article.what && (<><p className={s.articleSectionLabel}>What it is</p><p className={s.articleBody}>{article.what}</p></>)}
          {article.why && (<><p className={s.articleSectionLabel}>Why it matters</p><p className={s.articleBody}>{article.why}</p></>)}
          {article.body && <p className={s.articleBody}>{article.body}</p>}
          {article.signs && article.signs.length > 0 && (
            <><p className={s.articleSectionLabel}>Signs to look for</p>
            <ul className={s.articleList}>{article.signs.map((item, i) => <li key={i} className={s.articleListItem}>{item}</li>)}</ul></>
          )}
          {article.strategies && article.strategies.length > 0 && (
            <><p className={s.articleSectionLabel}>What helps</p>
            <ul className={s.articleList}>{article.strategies.map((item, i) => <li key={i} className={s.articleListItem}>{item}</li>)}</ul></>
          )}
          <a href={article.link} target="_blank" rel="noopener noreferrer" className={s.articleLink}>Read more →</a>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

function AwarenessList({ onBack, onSelectArticle }) {
  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.header}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <div>
            <p className={s.headerTitle}>Awareness</p>
            <p className={s.headerSub}>Short reads on mental health topics.</p>
          </div>
        </div>
        <div className={s.content}>
          {Object.entries(articles).map(([slug, article]) => (
            <div key={slug} className={s.quizCard} onClick={() => onSelectArticle(slug)}>
              <p className={s.quizCardTitle}>{article.title}</p>
              <p className={s.quizCardIntro}>{article.summary}</p>
              <div className={s.quizCardMeta}><span className={s.quizCardCta}>Read →</span></div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

function QuizFlow({ quiz, onBack, onArticleOpen }) {
  const navigate = useNavigate()
  const {
    screen, currentQ, result, progress,
    start, answer, restart, question, totalQuestions,
  } = useQuiz(quiz)

  function handleBack() {
    if (screen === QUIZ_SCREENS.INTRO) {
      sessionStorage.removeItem('amfh_quiz_result')
      onBack()
    }
    else restart()
  }

  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.quizPage}>
          <div className={s.quizHeader}>
            <button className={s.backBtn} onClick={handleBack}>←</button>
            <span className={s.quizTitle}>
              {screen === QUIZ_SCREENS.QUESTION ? `Question ${currentQ + 1}` : 'Check-in'}
            </span>
            {screen === QUIZ_SCREENS.QUESTION
              ? <span className={s.quizCount}>{currentQ + 1} / {totalQuestions}</span>
              : <div style={{ width: 32 }} />
            }
          </div>

          {screen === QUIZ_SCREENS.QUESTION && (
            <div className={s.progressBar}>
              <div className={s.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}

          {screen === QUIZ_SCREENS.INTRO && (
            <div className={s.introWrap}>
              <p className={s.introTitle}>{quiz.title}</p>
              <p className={s.introText}>{quiz.intro}</p>
              <button className={s.startBtn} onClick={start}>Begin check-in</button>
            </div>
          )}

          {screen === QUIZ_SCREENS.QUESTION && question && (
            <div className={s.questionWrap}>
              <p className={s.questionText}>{question.text}</p>
              {question.options.map(opt => (
                <button key={opt.letter} className={s.optionBtn} onClick={() => answer(opt.letter)}>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {screen === QUIZ_SCREENS.RESULT && result && (
            <div className={s.resultWrap}>
              <div className={s.resultIcon}>✦</div>
              <p className={s.resultProfile}>Your profile</p>
              <p className={s.resultTitle}>{result.profile}</p>
              <p className={s.resultDesc}>{result.description}</p>
              <p className={s.supportLabel}>Suggested support</p>
              <div className={s.supportTags}>
                {result.support.map(t => {
                  const mapping = ACTIVITY_MAP[t]
                  return (
                    <button
                      key={t}
                      className={s.supportTag}
                      onClick={() => {
                        if (!mapping) return
                        if (mapping.type === 'route') navigate(mapping.target)
                        else onArticleOpen(mapping.target)
                      }}
                    >
                      {t}
                    </button>
                  )
                })}
              </div>
              <button className={s.retakeBtn} onClick={restart}>Retake quiz</button>
              <button className={s.doneBtn} onClick={() => { sessionStorage.removeItem('amfh_quiz_result'); onBack() }}>Back to Learn</button>
            </div>
          )}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

function QuizList({ onBack, onSelectQuiz }) {
  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.header}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <div>
            <p className={s.headerTitle}>Quizzes</p>
            <p className={s.headerSub}>Check-ins to understand yourself better.</p>
          </div>
        </div>
        <div className={s.content}>
          {QUIZZES.map(quiz => (
            <div key={quiz.id} className={s.quizCard} onClick={() => onSelectQuiz(quiz)}>
              <p className={s.quizCardTitle}>{quiz.title}</p>
              <p className={s.quizCardIntro}>{quiz.intro}</p>
              <div className={s.quizCardMeta}>
                <span className={s.quizCardTag}>5 questions</span>
                <span className={s.quizCardCta}>Start →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}

function ComingSoon({ section, onBack }) {
  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.header}>
          <button className={s.backBtn} onClick={onBack}>←</button>
          <div>
            <p className={s.headerTitle}>{section.title}</p>
            <p className={s.headerSub}>{section.desc}</p>
          </div>
        </div>
        <div className={s.comingSoonWrap}>
          <div className={s.comingSoonIcon}>{section.icon}</div>
          <p className={s.comingSoonTitle}>Coming soon</p>
          <p className={s.comingSoonText}>{section.title} are on the way. Check back in a future update.</p>
        </div>
      </div>
      <BottomNav />
    </>
  )
}

export default function Learn() {
  const [section, setSection] = useState(null)
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [activeArticle, setActiveArticle] = useState(null)
  const [articleFromAwareness, setArticleFromAwareness] = useState(false)

  if (activeArticle && articleFromAwareness) {
    return (
      <ArticleView
        slug={activeArticle}
        onBack={() => { setActiveArticle(null); setArticleFromAwareness(false); setSection('awareness') }}
      />
    )
  }

  if (activeArticle && activeQuiz) {
    return (
      <ArticleView
        slug={activeArticle}
        onBack={() => setActiveArticle(null)}
      />
    )
  }

  if (activeQuiz) {
    return (
      <QuizFlow
        quiz={activeQuiz}
        onBack={() => { setActiveQuiz(null); setSection('quizzes') }}
        onArticleOpen={(slug) => setActiveArticle(slug)}
      />
    )
  }

  if (section === 'quizzes') {
    return <QuizList onBack={() => setSection(null)} onSelectQuiz={setActiveQuiz} />
  }

  if (section === 'awareness') {
    return (
      <AwarenessList
        onBack={() => setSection(null)}
        onSelectArticle={(slug) => { setArticleFromAwareness(true); setActiveArticle(slug) }}
      />
    )
  }

  if (section === 'games') {
    return <GamesScreen onBack={() => setSection(null)} />
  }

  return (
    <>
      <div className={s.page}>
        <div className={s.bg}><img src="/learn-background.svg" alt="" /></div>
        <div className={s.menuHeader}>
          <p className={s.headerTitle}>Learn</p>
          <p className={s.headerSub}>What do you want to do today?</p>
        </div>
        <div className={s.content}>
          {SECTIONS.map(sec => (
            <div key={sec.id} className={s.sectionCard} onClick={() => setSection(sec.id)}>
              <div className={s.sectionIcon}>{sec.icon}</div>
              <div className={s.sectionText}>
                <div className={s.sectionTitleRow}>
                  <p className={s.sectionTitle}>{sec.title}</p>
                  {!sec.available && <span className={s.soonBadge}>Coming soon</span>}
                </div>
                <p className={s.sectionDesc}>{sec.desc}</p>
              </div>
              <span className={s.sectionArrow}>→</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
