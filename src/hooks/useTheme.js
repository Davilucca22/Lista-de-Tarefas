import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'taskflow:theme'

function getSystemTheme() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyThemeToDom(theme) {
  const root = document.documentElement
  root.classList.toggle('dark', theme === 'dark')
}

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') return stored
    return getSystemTheme()
  })

  useEffect(() => {
    applyThemeToDom(theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return

    function onChange() {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') return
      setTheme(getSystemTheme())
    }

    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const isDark = theme === 'dark'

  const label = useMemo(() => (isDark ? 'Modo escuro' : 'Modo claro'), [isDark])

  function toggleTheme() {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }

  return { theme, isDark, label, toggleTheme, setTheme }
}

