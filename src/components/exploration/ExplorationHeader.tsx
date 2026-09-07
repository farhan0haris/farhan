import { useExploration } from '../../state'
import { useTheme } from '../../features/theme'
import { getEntity } from '../../core'
import { ArrowLeftIcon, RotateCcwIcon, CompassIcon } from '../common/Icons'

export function ExplorationHeader() {
  const { state, canGoBack, back, reset, focus, focusedEntity } = useExploration()
  const { theme, setTheme } = useTheme()

  // Breadcrumb sequence up to the active history point
  const historyEntries = state.history.slice(0, state.historyIndex + 1)

  return (
    <header className="h-14 border-b border-border-subtle bg-bg-surface/90 backdrop-blur-md sticky top-0 z-30 transition-colors flex-shrink-0">
      <div className="max-w-7xl h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left: Identity and Reset to Profile */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex items-center gap-2.5 text-left group focus-visible:outline-2 focus-visible:outline-accent-primary rounded transition-all cursor-pointer"
            aria-label="Return to Profile"
            title="Reset to Farhan Haris profile"
          >
            <div className="w-7 h-7 rounded-md bg-bg-surface-elevated border border-border-strong flex items-center justify-center text-accent-primary group-hover:border-accent-primary transition-colors">
              <CompassIcon className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="font-semibold text-sm tracking-tight text-fg-primary group-hover:text-accent-primary transition-colors">
                Farhan Haris
              </span>
              <span className="text-[11px] text-fg-muted font-mono ml-2 hidden sm:inline">
                Interactive Portfolio
              </span>
            </div>
          </button>

          {/* Retrace / Navigation Controls */}
          <div className="flex items-center gap-1 pl-3 border-l border-border-subtle">
            <button
              type="button"
              id="nav-back-btn"
              onClick={back}
              disabled={!canGoBack}
              className={`px-2.5 py-1 rounded text-xs font-mono flex items-center gap-1.5 transition-all ${
                canGoBack
                  ? 'text-fg-primary hover:bg-bg-subtle hover:text-accent-primary border border-border-strong cursor-pointer shadow-2xs'
                  : 'text-fg-subtle opacity-35 cursor-not-allowed border border-transparent'
              }`}
              title={canGoBack ? 'Back to previous exploration step' : 'At root'}
              aria-label="Navigate back"
            >
              <ArrowLeftIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Back</span>
            </button>

            <button
              type="button"
              id="nav-reset-btn"
              onClick={reset}
              className="px-2.5 py-1 rounded text-xs font-mono text-fg-secondary hover:text-fg-primary hover:bg-bg-subtle border border-border-subtle flex items-center gap-1.5 transition-all cursor-pointer"
              title="Return to profile"
              aria-label="Return to profile"
            >
              <RotateCcwIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </button>
          </div>
        </div>

        {/* Center: Context & Path Trail */}
        <nav
          aria-label="Exploration trail"
          className="hidden md:flex items-center gap-1.5 overflow-x-auto py-1 text-xs font-mono scrollbar-none"
        >
          {historyEntries.map((entry, idx) => {
            const isLast = idx === historyEntries.length - 1
            const entity = getEntity(entry.focusedEntityId)
            const label = entity ? entity.name : entry.focusedEntityId.split(':')[1]

            return (
              <div key={`${entry.focusedEntityId}-${idx}`} className="flex items-center gap-1.5 flex-shrink-0">
                {idx > 0 && <span className="text-fg-subtle select-none">→</span>}
                <button
                  type="button"
                  onClick={() => focus(entry.focusedEntityId)}
                  className={`px-2 py-0.5 rounded text-xs transition-colors cursor-pointer ${
                    isLast
                      ? 'bg-accent-subtle text-accent-primary font-medium border border-accent-primary/25'
                      : 'text-fg-secondary hover:text-fg-primary hover:bg-bg-subtle'
                  }`}
                  aria-current={isLast ? 'step' : undefined}
                >
                  {label}
                </button>
              </div>
            )
          })}
        </nav>

        {/* Right: Active Entity Indicator & Theme Selector */}
        <div className="flex items-center gap-3">
          {focusedEntity && (
            <div className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-fg-muted">
              <span>Focus:</span>
              <span className="text-fg-primary font-medium truncate max-w-[140px]">
                {focusedEntity.name}
              </span>
            </div>
          )}

          <div className="flex items-center gap-1 bg-bg-surface-elevated p-1 rounded-md border border-border-strong text-xs font-mono">
            {(['light', 'dark'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                id={`theme-btn-${mode}`}
                onClick={() => setTheme(mode)}
                className={`px-2 py-0.5 rounded capitalize transition-all cursor-pointer ${
                  theme === mode
                    ? 'bg-bg-surface text-fg-primary font-medium border border-border-strong shadow-2xs'
                    : 'text-fg-muted hover:text-fg-primary hover:bg-bg-subtle'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  )
}
