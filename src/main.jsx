import { StrictMode, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import './styles/tokens.css'

import { useAuth } from './hooks/useAuth'
import { useUsageTracker } from './hooks/useUsageTracker'
import LockedScreen from './components/LockedScreen'
import Login from './routes/Login'
import Home from './routes/Home'
import Reset from './routes/Reset'
import Support from './routes/Support'
import Learn from './routes/Learn'
import Reflect from './routes/Reflect'
import Upgrade from './routes/Upgrade'
import UpgradeSuccess from './routes/UpgradeSuccess'
import TopBar from './components/TopBar'
import InstallBanner from './components/InstallBanner'

const BYPASS_KEY = 'amfh_bypass_until'

const router = createHashRouter([
  { path: '/',                element: <Home /> },
  { path: '/reset',           element: <Reset /> },
  { path: '/support',         element: <Support /> },
  { path: '/learn',           element: <Learn /> },
  { path: '/reflect',         element: <Reflect /> },
  { path: '/upgrade',         element: <Upgrade /> },
  { path: '/upgrade-success', element: <UpgradeSuccess /> },
])

const API_BASE_URL = import.meta.env.VITE_API_URL

function isBypassed() {
  const until = localStorage.getItem(BYPASS_KEY)
  return until && Date.now() < parseInt(until)
}

function App() {
  const { authed, login, email } = useAuth()
  const { isLocked, resetsAt } = useUsageTracker({
    userEmail: email,
    apiBaseUrl: API_BASE_URL,
  })
  const [bypassActive, setBypassActive] = useState(isBypassed)

  const handleBypass = useCallback(() => {
    setBypassActive(true)
  }, [])

  if (authed === null) return null
  if (!authed) return <Login onLogin={login} />

  const effectiveLocked = isLocked && !bypassActive

  return (
    <>
      <TopBar isLocked={isLocked && !bypassActive} onBypass={handleBypass} />
      <InstallBanner />
      <div style={{ paddingTop: 'var(--topbar-height)' }}>
        {effectiveLocked
          ? <LockedScreen resetsAt={resetsAt} apiBaseUrl={API_BASE_URL} />
          : <RouterProvider router={router} />
        }
      </div>
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
