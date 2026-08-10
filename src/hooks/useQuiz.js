import { useState } from 'react'

export const QUIZ_SCREENS = {
  INTRO: 'intro',
  QUESTION: 'question',
  RESULT: 'result',
}

const SESSION_KEY = 'amfh_quiz_result'

export function useQuiz(quizData) {
  // Restore result from sessionStorage if available
  const getInitialResult = () => {
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.quizId === quizData.id) return parsed.result
      }
    } catch {}
    return null
  }

  const initialResult = getInitialResult()

  const [screen, setScreen]     = useState(initialResult ? QUIZ_SCREENS.RESULT : QUIZ_SCREENS.INTRO)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers]   = useState([])
  const [result, setResult]     = useState(initialResult)

  function start() {
    setCurrentQ(0)
    setAnswers([])
    setResult(null)
    sessionStorage.removeItem(SESSION_KEY)
    setScreen(QUIZ_SCREENS.QUESTION)
  }

  function answer(letter) {
    const updated = [...answers, letter]
    setAnswers(updated)

    const isLast = currentQ >= quizData.questions.length - 1
    if (isLast) {
      const calculated = calculateResult(updated)
      setResult(calculated)
      setScreen(QUIZ_SCREENS.RESULT)
      // Persist to sessionStorage so it survives article overlay
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        quizId: quizData.id,
        result: calculated,
      }))
    } else {
      setCurrentQ(q => q + 1)
    }
  }

  function restart() {
    setCurrentQ(0)
    setAnswers([])
    setResult(null)
    sessionStorage.removeItem(SESSION_KEY)
    setScreen(QUIZ_SCREENS.INTRO)
  }

  function calculateResult(ans) {
    const counts = { a: 0, b: 0, c: 0, d: 0, e: 0 }
    ans.forEach(l => { if (counts[l] !== undefined) counts[l]++ })
    const winner = Object.entries(counts).sort((x, y) => y[1] - x[1])[0][0]
    return quizData.results[winner]
  }

  const progress = quizData
    ? (currentQ / quizData.questions.length) * 100
    : 0

  return {
    screen,
    currentQ,
    answers,
    result,
    progress,
    start,
    answer,
    restart,
    question: quizData?.questions[currentQ],
    totalQuestions: quizData?.questions.length,
  }
}
