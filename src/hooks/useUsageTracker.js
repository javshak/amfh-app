import { useState, useEffect, useRef, useCallback } from 'react';

const WEEKLY_LIMIT_SECONDS = 2 * 60 * 60; // 2 hours
//const WEEKLY_LIMIT_SECONDS = 55 * 60; // 15 min for testing
const STORAGE_KEY = 'amfh_usage_v1';
const PREMIUM_KEY = 'amfh_is_premium';

function getNextMondayReset(fromDate = new Date()) {
  const d = new Date(fromDate);
  const day = d.getDay();
  const daysUntilMonday = day === 1 ? 7 : (8 - day) % 7 || 7;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + daysUntilMonday);
  return d.toISOString();
}

function getWeekStart(fromDate = new Date()) {
  const d = new Date(fromDate);
  const day = d.getDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - diffToMonday);
  return d.toISOString();
}

function loadUsage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch { return null; }
}

function saveUsage(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

function loadPremium() {
  return localStorage.getItem(PREMIUM_KEY) === 'true'
}

function savePremium(val) {
  localStorage.setItem(PREMIUM_KEY, val ? 'true' : 'false')
}

export function useUsageTracker({ userEmail, apiBaseUrl } = {}) {
  const weekStart = getWeekStart();
  const [isPremium, setIsPremium] = useState(loadPremium)

  const [secondsUsed, setSecondsUsed] = useState(() => {
    const stored = loadUsage();
    if (stored && stored.weekStart === weekStart) return stored.secondsUsed;
    return 0;
  });

  const [isLocked, setIsLocked] = useState(() => !loadPremium() && secondsUsed >= WEEKLY_LIMIT_SECONDS)
  const tickRef = useRef(null);
  const lastTickRef = useRef(Date.now());

  // Check premium status from backend on mount
  useEffect(() => {
    if (!userEmail || !apiBaseUrl) return
    async function checkPremium() {
      try {
        const res = await fetch(`${apiBaseUrl}/premium/${encodeURIComponent(userEmail)}`)
        if (!res.ok) return
        const data = await res.json()
        if (data.isPremium) {
          savePremium(true)
          setIsPremium(true)
          setIsLocked(false)
        }
      } catch {}
    }
    checkPremium()
  }, [userEmail, apiBaseUrl])

  // Persist usage and check lock
  useEffect(() => {
    saveUsage({ weekStart, secondsUsed });
    if (!isPremium && secondsUsed >= WEEKLY_LIMIT_SECONDS) {
      setIsLocked(true);
    }
  }, [secondsUsed, weekStart, isPremium]);

  const syncToBackend = useCallback(
    async (nextSeconds) => {
      if (!userEmail || !apiBaseUrl) return;
      try {
        await fetch(`${apiBaseUrl}/usage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail, weekStart, secondsUsed: nextSeconds }),
        });
      } catch {}
    },
    [userEmail, apiBaseUrl, weekStart]
  );

  useEffect(() => {
    if (isLocked || isPremium) return;
    lastTickRef.current = Date.now();
    tickRef.current = setInterval(() => {
      if (document.hidden) return;
      const now = Date.now();
      const elapsed = Math.floor((now - lastTickRef.current) / 1000);
      lastTickRef.current = now;
      if (elapsed <= 0) return;
      setSecondsUsed((prev) => {
        const next = Math.min(prev + elapsed, WEEKLY_LIMIT_SECONDS);
        syncToBackend(next);
        return next;
      });
    }, 5000);
    return () => clearInterval(tickRef.current);
  }, [isLocked, isPremium, syncToBackend]);

  const secondsRemaining = Math.max(0, WEEKLY_LIMIT_SECONDS - secondsUsed);
  const resetsAt = getNextMondayReset();

  return {
    isLocked,
    isPremium,
    secondsUsed,
    secondsRemaining,
    weeklyLimitSeconds: WEEKLY_LIMIT_SECONDS,
    resetsAt,
  };
}
