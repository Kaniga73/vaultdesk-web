import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  // Load saved preference
  useEffect(() => {
    const saved = localStorage.getItem('vaultdesk_theme')
    if (saved === 'dark') {
      setIsDark(true)
      document.documentElement.setAttribute('data-theme', 'dark')
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)
    document.documentElement.setAttribute(
      'data-theme',
      newTheme ? 'dark' : 'light'
    )
    localStorage.setItem(
      'vaultdesk_theme',
      newTheme ? 'dark' : 'light'
    )
  }

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)