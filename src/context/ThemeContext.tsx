import { ThemeProvider as MuiThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark'

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('theme') as Theme | null
    return saved || 'light'
  })

  useEffect(() => {
    document.body.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  const muiTheme = createTheme({
    palette: {
      mode: theme,
      primary: { main: '#ff6b00' },
      background: {
        default: theme === 'dark' ? '#121212' : '#ffffff',
        paper: theme === 'dark' ? '#1e1e1e' : '#f5f5f5',
      },
      text: {
        primary: theme === 'dark' ? '#ffffff' : '#121212',
      },
    },
    shape: {
      borderRadius: 8,
    },
  })

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    </MuiThemeProvider>
  )
}

export const useTheme = (): ThemeContextType => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme deve ser usado dentro de ThemeProvider')
  return ctx
}