import { useTheme } from '../../features/theme'

export function AppShell() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 sm:p-10 max-w-4xl mx-auto">
      <header className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-widest text-fg-muted">
            Interactive Portfolio
          </span>
          <h1 className="text-lg font-medium text-fg-primary tracking-tight">Farhan Haris</h1>
        </div>

        <div className="flex items-center gap-1 bg-bg-surface-elevated p-1 rounded-md border border-border-subtle text-xs font-mono">
          {(['system', 'light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              id={`theme-btn-${mode}`}
              onClick={() => setTheme(mode)}
              className={`px-2.5 py-1 rounded capitalize transition-colors ${
                theme === mode
                  ? 'bg-accent-primary text-accent-fg font-medium'
                  : 'text-fg-secondary hover:text-fg-primary hover:bg-bg-subtle'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </header>

      <main className="my-auto py-12">
        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono bg-accent-subtle text-accent-primary border border-border-subtle mb-4">
          Phase 1 — Application Foundation
        </div>
        <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-fg-primary mb-3">
          Exploration System Shell
        </h2>
        <p className="text-fg-secondary text-base max-w-xl leading-relaxed mb-6">
          The application foundation and design token architecture have initialized successfully.
          Future phases will introduce the structured data model, exploration engine, and command
          palette.
        </p>

        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle font-mono text-xs space-y-1 text-fg-muted">
          <div>
            Active Theme Preference:{' '}
            <span className="text-fg-primary font-medium">{theme}</span>
          </div>
          <div>
            Resolved Color Scheme:{' '}
            <span className="text-fg-primary font-medium">{resolvedTheme}</span>
          </div>
          <div>
            Environment:{' '}
            <span className="text-fg-primary font-medium">Vite + React 19 + TypeScript + Tailwind v4</span>
          </div>
        </div>
      </main>

      <footer className="border-t border-border-subtle pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-fg-subtle font-mono">
        <span>Farhan Haris &copy; {new Date().getFullYear()}</span>
        <span className="text-[11px] text-fg-muted">Temporary Foundation Shell</span>
      </footer>
    </div>
  )
}
