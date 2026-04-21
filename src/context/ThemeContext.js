import { createContext, useContext, useState } from 'react'

export const ACCENT_COLORS = ['#00C896', '#9B59B6', '#F1C40F', '#E91E8C', '#E74C3C']

const ThemeContext = createContext()

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode]             = useState(true)
  const [selectedAccent, setSelectedAccent] = useState(0)
  const [fontSize, setFontSize]             = useState('Mediana')
  const [order, setOrder]                   = useState('Por fecha de modificación')
  const [design, setDesign]                 = useState('Ver en cuadrícula')

  const accent     = ACCENT_COLORS[selectedAccent]
  const bg         = darkMode ? '#111111' : '#F2F2F7'
  const cardBg     = darkMode ? '#1e1e1e' : '#FFFFFF'
  const textColor  = darkMode ? '#FFFFFF' : '#000000'
  const subColor   = darkMode ? '#888888' : '#666666'
  const divColor   = darkMode ? '#2a2a2a' : '#E5E5EA'
  const labelColor = darkMode ? '#666666' : '#999999'

  return (
    <ThemeContext.Provider value={{
      darkMode, setDarkMode,
      selectedAccent, setSelectedAccent,
      fontSize, setFontSize,
      order, setOrder,
      design, setDesign,
      accent, bg, cardBg, textColor, subColor, divColor, labelColor,
      ACCENT_COLORS,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}