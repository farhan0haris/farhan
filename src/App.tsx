import { ThemeProvider } from './features/theme'
import { AppShell } from './components/layout/AppShell'

export function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}

export default App
