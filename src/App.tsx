import { ThemeProvider } from './features/theme'
import { ExplorationProvider } from './state'
import { AppShell } from './components/layout/AppShell'

export function App() {
  return (
    <ThemeProvider>
      <ExplorationProvider>
        <AppShell />
      </ExplorationProvider>
    </ThemeProvider>
  )
}

export default App
