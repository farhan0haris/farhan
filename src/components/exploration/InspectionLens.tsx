import { useEffect, useCallback } from 'react'
import { useExploration } from '../../state'
import {
  CloseIcon,
  CompassIcon,
  ExternalLinkIcon,
  EyeIcon,
} from '../common/Icons'
import type { Project, Technology, Skill, TimelineEntry } from '../../core/types'

export function InspectionLens() {
  const {
    inspectedEntity,
    focusedEntity,
    resolvedContext,
    clearInspection,
    focus,
  } = useExploration()

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearInspection()
      }
    },
    [clearInspection]
  )

  useEffect(() => {
    if (inspectedEntity) {
      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [inspectedEntity, handleKeyDown])

  if (!inspectedEntity) return null

  // Find exact connection metadata between focused and inspected entities if available
  const bridgeRelationship = resolvedContext?.relationships.find(
    (r) => r.targetId === inspectedEntity.id || r.sourceId === inspectedEntity.id
  )

  const handlePromoteToFocus = () => {
    focus(inspectedEntity.id)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/55 backdrop-blur-xs transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lens-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) clearInspection()
      }}
    >
      <div className="w-full max-w-xl bg-bg-surface h-full shadow-2xl border-l border-border-strong flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200">
        {/* Top Header & Connection Bridge */}
        <div className="p-6 border-b border-border-strong space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-accent-subtle text-accent-primary">
                <EyeIcon className="w-4 h-4" />
              </span>
              <span className="text-xs font-mono uppercase tracking-widest text-accent-primary font-semibold">
                Inspection Lens
              </span>
            </div>

            <button
              type="button"
              onClick={clearInspection}
              className="p-1.5 rounded text-fg-muted hover:text-fg-primary hover:bg-bg-subtle transition-colors flex items-center gap-1.5 text-xs font-mono cursor-pointer border border-border-subtle"
              aria-label="Close inspection lens (Escape)"
            >
              <span className="text-[10px] text-fg-subtle border border-border-subtle px-1 rounded">
                ESC
              </span>
              <CloseIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Explicit Relationship Bridge in Antique Gold & Deep Violet */}
          {focusedEntity && (
            <div className="p-4 rounded-lg bg-bg-surface-elevated/70 border border-accent-primary/30 text-xs font-mono space-y-3">
              <div className="text-[10px] text-accent-primary uppercase tracking-widest font-bold flex items-center justify-between">
                <span>ARCHITECTURAL PROVENANCE</span>
                <span className="px-2 py-0.5 rounded-full bg-accent-subtle text-accent-primary text-[9px] uppercase font-semibold">
                  {bridgeRelationship ? bridgeRelationship.kind : 'contextual'}
                </span>
              </div>
              <div className="flex flex-col items-center justify-center gap-1.5 py-1 text-center select-none">
                <span className="font-bold text-sm tracking-wider uppercase text-fg-primary">
                  {focusedEntity.name}
                </span>
                <div className="flex flex-col items-center gap-0.5 text-accent-primary my-0.5">
                  <span className="text-sm leading-none font-bold">↓</span>
                  <span className="text-[10px] font-bold tracking-widest uppercase py-0.5 px-2 rounded bg-accent-subtle border border-accent-primary/25">
                    {bridgeRelationship
                      ? `${bridgeRelationship.type.replace(/-/g, ' ')} · ${bridgeRelationship.kind}`
                      : 'CONTEXTUAL RELATIONSHIP'}
                  </span>
                  <span className="text-sm leading-none font-bold">↓</span>
                </div>
                <span className="font-bold text-sm tracking-wider uppercase text-accent-primary">
                  {inspectedEntity.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-bg-surface-elevated text-fg-muted border border-border-strong">
                {inspectedEntity.type}
              </span>
              <span className="text-xs font-mono text-fg-subtle">
                {inspectedEntity.id}
              </span>
            </div>
            <h2 id="lens-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg-primary">
              {inspectedEntity.name}
            </h2>
          </div>

          {/* Type-Specific Inspection Readout */}
          {inspectedEntity.type === 'project' && (() => {
            const proj = inspectedEntity as Project
            return (
              <div className="space-y-5">
                <div className="text-xs font-mono uppercase text-accent-primary font-medium">
                  Category: {proj.category.replace('-', ' ')}
                </div>
                <p className="text-sm text-fg-secondary leading-relaxed font-medium">
                  {proj.summary}
                </p>
                <p className="text-xs text-fg-muted leading-relaxed font-normal">
                  {proj.description}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-mono uppercase tracking-wider text-fg-muted">
                    Stack Elements ({proj.technologyIds.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {proj.technologyIds.map((tid) => (
                      <span
                        key={tid}
                        className="px-2 py-0.5 rounded text-[11px] font-mono bg-bg-surface-elevated text-fg-secondary border border-border-subtle"
                      >
                        {tid.split(':')[1]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-3">
                  {proj.liveUrl && (
                    <a
                      href={proj.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded text-xs font-mono bg-accent-primary text-accent-fg hover:bg-accent-hover inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Launch App</span>
                      <ExternalLinkIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {proj.repositoryUrl && (
                    <a
                      href={proj.repositoryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded text-xs font-mono bg-bg-surface border border-border-strong text-fg-primary hover:border-accent-primary inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>GitHub</span>
                      <ExternalLinkIcon className="w-3.5 h-3.5 text-fg-subtle" />
                    </a>
                  )}
                </div>
              </div>
            )
          })()}

          {inspectedEntity.type === 'technology' && (() => {
            const tech = inspectedEntity as Technology
            return (
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-accent-primary font-medium">
                  Category: {tech.category}
                </div>
                <p className="text-sm sm:text-base text-fg-secondary leading-relaxed font-medium">
                  {tech.summary}
                </p>
              </div>
            )
          })()}

          {inspectedEntity.type === 'skill' && (() => {
            const skill = inspectedEntity as Skill
            return (
              <div className="space-y-4">
                <div className="text-xs font-mono uppercase text-accent-primary font-medium">
                  Competency Domain
                </div>
                <p className="text-sm sm:text-base text-fg-secondary leading-relaxed font-medium">
                  {skill.summary}
                </p>
              </div>
            )
          })()}

          {inspectedEntity.type === 'timeline' && (() => {
            const entry = inspectedEntity as TimelineEntry
            return (
              <div className="space-y-4">
                <div className="text-xs font-mono text-accent-primary font-medium">
                  Date: {entry.date}
                </div>
                <p className="text-sm sm:text-base text-fg-secondary leading-relaxed font-medium">
                  {entry.summary}
                </p>
              </div>
            )
          })()}
        </div>

        {/* Action Vector Footer */}
        <div className="p-6 border-t border-border-strong bg-bg-surface-elevated/50 flex items-center gap-3">
          <button
            type="button"
            onClick={handlePromoteToFocus}
            className="flex-1 px-5 py-3 rounded-md bg-accent-primary text-accent-fg hover:bg-accent-hover text-xs font-mono font-medium flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <CompassIcon className="w-4 h-4" />
            <span>Make Primary Focus</span>
          </button>

          <button
            type="button"
            onClick={clearInspection}
            className="px-4 py-3 rounded-md bg-bg-surface border border-border-strong hover:border-border-subtle text-fg-secondary hover:text-fg-primary text-xs font-mono transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
