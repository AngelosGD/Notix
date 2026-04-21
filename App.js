import { ThemeProvider } from './src/context/ThemeContext'
import { DatabaseProvider } from './src/context/DatabaseContext'
import AppNavigator from './src/navigation/AppNavigator'

export default function App() {
  return (
    <ThemeProvider>
      <DatabaseProvider>
        <AppNavigator />
      </DatabaseProvider>
    </ThemeProvider>
  )
}