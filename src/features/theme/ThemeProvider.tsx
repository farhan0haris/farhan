import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { ResolvedTheme, ThemeContextValue, ThemePreference } from './themeTypes'

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>('dark')

  const resolvedTheme: ResolvedTheme = 'dark'

  // Apply dark class and color-scheme to documentElement unconditionally
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('dark')
    root.style.colorScheme = 'dark'
  }, [])

  const setTheme = (newTheme: ThemePreference) => {
    setThemeState(newTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
