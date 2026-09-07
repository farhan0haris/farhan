import { useState, useCallback } from 'react'
import { useExploration } from '../../state'
import { useTheme } from '../../features/theme'
import { getEntity } from '../../core'
import TextTrail from '../originkit/ui/motion-text-trail'
import type {
  ProjectContext,
  TechnologyContext,
  SkillContext,
  TimelineContext,
  ProfileContext,
  ResolvedContext,
} from '../../core/relationships'
import {
  ExternalLinkIcon,
  EyeIcon,
  GithubIcon,
  LinkedinIcon,
  MailIcon,
  ArrowLeftIcon,
} from '../common/Icons'

// ---------------------------------------------------------------------------
// Relationship Provenance Information Interface & Resolver
// ---------------------------------------------------------------------------

interface HoverWhisperInfo {
  badge: string
  title: string
  detail: string
  kind: 'direct' | 'reverse' | 'derived' | 'co-occurrence'
}

function resolveEntityProvenance(
  hoveredId: string,
  context: ResolvedContext
): HoverWhisperInfo | null {
  const entity = getEntity(hoveredId as import('../../core/types').EntityId)
  if (!entity) return null

  // 1. In ProjectContext (e.g. DeadCode)
  if (context.type === 'project') {
    const tech = context.technologies.find((t) => t.id === hoveredId)
    if (tech) {
      return {
        badge: 'USES TECHNOLOGY',
        title: 'Direct relationship',
        detail: `Core architecture component (${tech.category}) powering ${context.entity.name}`,
        kind: 'direct',
      }
    }

    const rel = context.relatedProjects.find((r) => r.project.id === hoveredId)
    if (rel) {
      return {
        badge: 'RELATED PROJECT',
        title: 'Derived relationship',
        detail: rel.matchReason,
        kind: 'derived',
      }
    }

    const skill = context.skills.find((s) => s.id === hoveredId)
    if (skill) {
      return {
        badge: 'DEMONSTRATED SKILL',
        title: 'Direct competency',
        detail: `Production architecture evidencing ${skill.name}`,
        kind: 'direct',
      }
    }

    const tm = context.timeline.find((t) => t.id === hoveredId)
    if (tm) {
      return {
        badge: 'CHRONOLOGICAL MILESTONE',
        title: 'Temporal milestone',
        detail: `Launched on ${tm.date} (${tm.name})`,
        kind: 'direct',
      }
    }
  }

  // 2. In TechnologyContext (e.g. TypeScript)
  if (context.type === 'technology') {
    const proj = context.projects.find((p) => p.id === hoveredId)
    if (proj) {
      return {
        badge: `POWERED BY ${context.entity.name.toUpperCase()}`,
        title: 'Reverse deployment',
        detail: `${proj.name} is built and deployed using ${context.entity.name}`,
        kind: 'reverse',
      }
    }

    const coTech = context.relatedTechnologies.find((t) => t.id === hoveredId)
    if (coTech) {
      return {
        badge: 'CO-OCCURS WITH',
        title: 'Associative relationship',
        detail: `Frequently used alongside ${context.entity.name} in production systems`,
        kind: 'co-occurrence',
      }
    }

    const skill = context.relatedSkills.find((s) => s.id === hoveredId)
    if (skill) {
      return {
        badge: 'ASSOCIATED COMPETENCY',
        title: 'Direct application',
        detail: `Competency demonstrated through real-world ${context.entity.name} implementation`,
        kind: 'direct',
      }
    }
  }

  // 3. In SkillContext (e.g. Full-Stack Development)
  if (context.type === 'skill') {
    const proj = context.projects.find((p) => p.id === hoveredId)
    if (proj) {
      return {
        badge: 'EVIDENTIARY ARTIFACT',
        title: 'Concrete evidence',
        detail: `${proj.name} demonstrates verified competency in ${context.entity.name}`,
        kind: 'reverse',
      }
    }

    const tech = context.relatedTechnologies.find((t) => t.id === hoveredId)
    if (tech) {
      return {
        badge: 'PRACTICE TOOL',
        title: 'Supporting technology',
        detail: `Tooling used to implement and realize ${context.entity.name}`,
        kind: 'direct',
      }
    }
  }

  // 4. In TimelineContext
  if (context.type === 'timeline') {
    const proj = context.projects.find((p) => p.id === hoveredId)
    if (proj) {
      return {
        badge: 'LAUNCHED AT MILESTONE',
        title: 'Temporal deployment',
        detail: `${proj.name} deployed during milestone ${context.entity.name} (${context.entity.date})`,
        kind: 'direct',
      }
    }
  }

  // Profile or domain node fallback
  return {
    badge: 'EXPLORATION NODE',
    title: entity.name,
    detail: entity.summary,
    kind: 'direct',
  }
}

// ---------------------------------------------------------------------------
// Ambient Relationship Whisper (Exploration Cue on Hover/Focus)
// ---------------------------------------------------------------------------

function RelationshipWhisper({ whisper }: { whisper: HoverWhisperInfo | null }) {
  if (!whisper) {
    return (
      <div className="h-7 flex items-center justify-center text-[11px] font-mono text-fg-subtle opacity-60 select-none">
        Hover or Tab to any entity to inspect architectural connections · Click to enter
      </div>
    )
  }

  return (
    <div className="h-7 flex items-center justify-center gap-2 text-xs font-mono animate-in fade-in duration-150 select-none">
      <span className="font-bold uppercase tracking-wider text-accent-primary">
        {whisper.badge}
      </span>
      <span className="text-fg-subtle">·</span>
      <span className="text-fg-primary font-medium">{whisper.title}</span>
      <span className="text-fg-subtle hidden sm:inline">·</span>
      <span className="text-fg-muted hidden sm:inline truncate max-w-lg">{whisper.detail}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Spatial Memory Indicator (Receding Origin Node)
// ---------------------------------------------------------------------------

function SpatialMemory() {
  const { state, canGoBack, back } = useExploration()

  if (!canGoBack || state.historyIndex <= 0) return null

  const prevEntry = state.history[state.historyIndex - 1]
  if (!prevEntry) return null

  const prevEntity = getEntity(prevEntry.focusedEntityId)
  const prevName = prevEntity ? prevEntity.name : prevEntry.focusedEntityId.split(':')[1]

  return (
    <div className="flex items-center gap-2 text-xs font-mono text-fg-muted mb-2 select-none">
      <button
        type="button"
        onClick={back}
        className="group inline-flex items-center gap-2 px-3 py-1 rounded-full bg-bg-surface/80 hover:bg-bg-surface border border-border-strong hover:border-accent-primary transition-all cursor-pointer shadow-2xs backdrop-blur-xs focus-visible:ring-2 focus-visible:ring-accent-primary"
        title={`Retrace spatial movement back to: ${prevName}`}
        aria-label={`Return to previous origin: ${prevName}`}
      >
        <ArrowLeftIcon className="w-3.5 h-3.5 text-accent-primary group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-fg-subtle">From:</span>
        <span className="font-semibold text-fg-primary group-hover:text-accent-primary transition-colors">
          {prevName}
        </span>
      </button>
      <span className="text-[11px] text-fg-subtle hidden sm:inline">
        · spatial memory active (click to return)
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 1. Profile Exploration Stage (Asymmetric 2D Spatial Environment)
// ---------------------------------------------------------------------------

function ProfileStage({ context }: { context: ProfileContext }) {
  const { focus, inspect } = useExploration()
  const { resolvedTheme } = useTheme()
  const { entity } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)
  const [activeDomain, setActiveDomain] = useState<'projects' | 'technologies' | 'skills' | 'timeline' | null>(null)

  const nameColor = resolvedTheme === 'dark' ? '#f2f3f5' : '#121316'
  const trailColor = resolvedTheme === 'dark' ? '#3b82f6' : '#2563eb'

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  const handleDomainHover = (domain: 'projects' | 'technologies' | 'skills' | 'timeline' | null) => {
    setActiveDomain(domain)
    if (domain === 'projects') {
      setWhisper({
        badge: 'PROJECTS DOMAIN',
        title: 'Verified Software Systems',
        detail: '5 full-stack web applications and developer tools with live URLs',
        kind: 'direct',
      })
    } else if (domain === 'technologies') {
      setWhisper({
        badge: 'TECHNOLOGIES DOMAIN',
        title: 'Technical Stack',
        detail: '23 frameworks, languages, and databases mapped to production code',
        kind: 'direct',
      })
    } else if (domain === 'skills') {
      setWhisper({
        badge: 'SKILLS DOMAIN',
        title: 'Core Competencies',
        detail: '7 demonstrated capability domains verified by codebase architectures',
        kind: 'direct',
      })
    } else if (domain === 'timeline') {
      setWhisper({
        badge: 'TIMELINE AXIS',
        title: 'Chronological Milestones',
        detail: 'Temporal deployment history spanning foundation to production releases',
        kind: 'direct',
      })
    } else {
      setWhisper(null)
    }
  }

  // Progressive emergence flag: Projects domain active if hovered or clicked
  const isProjectsExpanded = activeDomain === 'projects' || hoveredEntityId?.startsWith('project:')
  const isTechExpanded = activeDomain === 'technologies' || hoveredEntityId?.startsWith('technology:')
  const isSkillsExpanded = activeDomain === 'skills' || hoveredEntityId?.startsWith('skill:')

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-stage relative select-text">
      {/* North / Top: PROJECTS Domain (Progressive Discovery) */}
      <div className="w-full flex flex-col items-center pt-2">
        <div
          className="text-center group"
          onMouseEnter={() => handleDomainHover('projects')}
          onMouseLeave={() => handleDomainHover(null)}
        >
          <button
            type="button"
            id="domain-projects"
            onClick={() => focus('project:deadcode')}
            className="text-xs font-mono tracking-[0.25em] text-accent-primary uppercase font-bold hover:text-fg-primary transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary px-3 py-1 rounded-full"
          >
            ▲ PROJECTS DOMAIN
          </button>

          {/* Emergent Project Entities Cluster */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-2">
            {/* Primary Seed: DeadCode */}
            <div
              className={`group/item flex items-center gap-1.5 transition-all duration-300 ${
                hoveredEntityId && hoveredEntityId !== 'project:deadcode' ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                id="node-deadcode"
                onClick={() => focus('project:deadcode')}
                onMouseEnter={() => handleEntityHover('project:deadcode')}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover('project:deadcode')}
                onBlur={() => handleEntityHover(null)}
                className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary p-1 rounded"
              >
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-fg-primary group-hover/item:text-accent-primary transition-colors">
                  DeadCode
                </div>
                <div className="text-[11px] font-mono text-fg-muted">Git Time Machine</div>
              </button>
              <button
                type="button"
                onClick={() => inspect('project:deadcode')}
                className="p-1 rounded text-fg-subtle hover:text-fg-primary transition-colors cursor-pointer"
                title="Inspect DeadCode"
                aria-label="Inspect DeadCode"
              >
                <EyeIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Primary Seed: NODE */}
            <div
              className={`group/item flex items-center gap-1.5 transition-all duration-300 ${
                hoveredEntityId && hoveredEntityId !== 'project:node' ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                id="node-node"
                onClick={() => focus('project:node')}
                onMouseEnter={() => handleEntityHover('project:node')}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover('project:node')}
                onBlur={() => handleEntityHover(null)}
                className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary p-1 rounded"
              >
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-fg-primary group-hover/item:text-accent-primary transition-colors">
                  NODE
                </div>
                <div className="text-[11px] font-mono text-fg-muted">Knowledge Graph</div>
              </button>
              <button
                type="button"
                onClick={() => inspect('project:node')}
                className="p-1 rounded text-fg-subtle hover:text-fg-primary transition-colors cursor-pointer"
                title="Inspect NODE"
                aria-label="Inspect NODE"
              >
                <EyeIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Emergent Seed: VaultX */}
            <div
              className={`group/item flex items-center gap-1.5 transition-all duration-300 ${
                hoveredEntityId && hoveredEntityId !== 'project:vault-x' ? 'opacity-35' : 'opacity-100'
              }`}
            >
              <button
                type="button"
                id="node-vaultx"
                onClick={() => focus('project:vault-x')}
                onMouseEnter={() => handleEntityHover('project:vault-x')}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover('project:vault-x')}
                onBlur={() => handleEntityHover(null)}
                className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary p-1 rounded"
              >
                <div className="text-xl sm:text-2xl font-bold tracking-tight text-fg-primary group-hover/item:text-accent-primary transition-colors">
                  VaultX
                </div>
                <div className="text-[11px] font-mono text-fg-muted">Zero-Knowledge Vault</div>
              </button>
              <button
                type="button"
                onClick={() => inspect('project:vault-x')}
                className="p-1 rounded text-fg-subtle hover:text-fg-primary transition-colors cursor-pointer"
                title="Inspect VaultX"
                aria-label="Inspect VaultX"
              >
                <EyeIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Progressive Disclosure: Further Projects (AuraShelf, Letterly AI) */}
            {isProjectsExpanded && (
              <>
                <div
                  className={`group/item flex items-center gap-1.5 transition-all duration-300 animate-in fade-in duration-200 ${
                    hoveredEntityId && hoveredEntityId !== 'project:aurashelf' ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => focus('project:aurashelf')}
                    onMouseEnter={() => handleEntityHover('project:aurashelf')}
                    onMouseLeave={() => handleEntityHover(null)}
                    onFocus={() => handleEntityHover('project:aurashelf')}
                    onBlur={() => handleEntityHover(null)}
                    className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary p-1 rounded"
                  >
                    <div className="text-lg sm:text-xl font-bold tracking-tight text-fg-primary group-hover/item:text-accent-primary transition-colors">
                      AuraShelf
                    </div>
                    <div className="text-[10px] font-mono text-fg-muted">Smart Inventory</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => inspect('project:aurashelf')}
                    className="p-1 rounded text-fg-subtle hover:text-fg-primary transition-colors cursor-pointer"
                    title="Inspect AuraShelf"
                    aria-label="Inspect AuraShelf"
                  >
                    <EyeIcon className="w-3 h-3" />
                  </button>
                </div>

                <div
                  className={`group/item flex items-center gap-1.5 transition-all duration-300 animate-in fade-in duration-200 ${
                    hoveredEntityId && hoveredEntityId !== 'project:letterly-ai' ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => focus('project:letterly-ai')}
                    onMouseEnter={() => handleEntityHover('project:letterly-ai')}
                    onMouseLeave={() => handleEntityHover(null)}
                    onFocus={() => handleEntityHover('project:letterly-ai')}
                    onBlur={() => handleEntityHover(null)}
                    className="text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary p-1 rounded"
                  >
                    <div className="text-lg sm:text-xl font-bold tracking-tight text-fg-primary group-hover/item:text-accent-primary transition-colors">
                      Letterly AI
                    </div>
                    <div className="text-[10px] font-mono text-fg-muted">Writing Assistant</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => inspect('project:letterly-ai')}
                    className="p-1 rounded text-fg-subtle hover:text-fg-primary transition-colors cursor-pointer"
                    title="Inspect Letterly AI"
                    aria-label="Inspect Letterly AI"
                  >
                    <EyeIcon className="w-3 h-3" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Middle Equator: West (TECHNOLOGIES) ── Center (IDENTITY) ── East (SKILLS) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-center my-auto py-6">
        {/* West Flank: TECHNOLOGIES Cluster (Presence over buttons) */}
        <div
          className="lg:col-span-3 flex flex-col items-start space-y-3 order-2 lg:order-1"
          onMouseEnter={() => handleDomainHover('technologies')}
          onMouseLeave={() => handleDomainHover(null)}
        >
          <button
            type="button"
            id="domain-technologies"
            onClick={() => focus('technology:typescript')}
            className="text-[11px] font-mono tracking-widest text-accent-primary uppercase font-bold hover:text-fg-primary transition-colors cursor-pointer"
          >
            ◀ TECHNOLOGIES
          </button>

          <div className="flex flex-col space-y-2 text-left">
            <button
              type="button"
              onClick={() => focus('technology:typescript')}
              onMouseEnter={() => handleEntityHover('technology:typescript')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('technology:typescript')}
              onBlur={() => handleEntityHover(null)}
              className="text-base sm:text-lg font-bold text-fg-primary hover:text-accent-primary transition-colors cursor-pointer text-left group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">TypeScript</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Strict Typing &amp; AST</span>
            </button>

            <button
              type="button"
              onClick={() => focus('technology:react')}
              onMouseEnter={() => handleEntityHover('technology:react')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('technology:react')}
              onBlur={() => handleEntityHover(null)}
              className="text-sm sm:text-base font-medium text-fg-secondary hover:text-accent-primary transition-colors cursor-pointer text-left group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">React &amp; Next.js</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Full-Stack SSR</span>
            </button>

            <button
              type="button"
              onClick={() => focus('technology:postgresql')}
              onMouseEnter={() => handleEntityHover('technology:postgresql')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('technology:postgresql')}
              onBlur={() => handleEntityHover(null)}
              className="text-sm sm:text-base font-medium text-fg-secondary hover:text-accent-primary transition-colors cursor-pointer text-left group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">PostgreSQL &amp; Prisma</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Persistent Storage</span>
            </button>

            {isTechExpanded && (
              <button
                type="button"
                onClick={() => focus('technology:tailwind-css')}
                onMouseEnter={() => handleEntityHover('technology:tailwind-css')}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover('technology:tailwind-css')}
                onBlur={() => handleEntityHover(null)}
                className="text-xs font-medium text-fg-muted hover:text-accent-primary transition-colors cursor-pointer text-left animate-in fade-in duration-200"
              >
                Tailwind CSS &amp; Node.js
                <span className="text-[9px] font-mono text-fg-subtle block">Design Systems &amp; Runtimes</span>
              </button>
            )}
          </div>
        </div>

        {/* Central Identity Anchor (Farhan Haris) */}
        <div className="lg:col-span-6 text-center space-y-4 order-1 lg:order-2 px-2">
          <div className="text-xs font-mono text-accent-primary uppercase tracking-widest font-semibold inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
            <span>Interactive Portfolio</span>
          </div>

          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center relative">
            <h1 className="sr-only">Farhan Haris</h1>
            <div className="w-full h-32 sm:h-40 flex items-center justify-center relative select-none">
              <TextTrail
                text={"FARHAN\nHARIS"}
                color={nameColor}
                trailColor={trailColor}
                font={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "56px",
                  fontWeight: 900,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.95,
                }}
                trail={16}
                drift={18}
                warp={6}
                speed={20}
                push={6}
                style={{ width: "100%", height: "100%" }}
              />
            </div>
          </div>

          <div className="text-base sm:text-lg text-fg-secondary font-medium flex flex-wrap items-center justify-center gap-2 pt-1">
            <span>Developer</span>
            <span className="text-fg-subtle">/</span>
            <span>BCA Student</span>
            <span className="text-fg-subtle">·</span>
            <span className="text-accent-primary italic font-serif">"Explore the work."</span>
          </div>

          <p className="text-xs sm:text-sm text-fg-muted max-w-lg mx-auto leading-relaxed">
            {entity.summary}
          </p>

          {/* Social Presence Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs font-mono">
            {entity.links.github && (
              <a
                href={entity.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface/80 border border-border-strong hover:border-accent-primary text-fg-primary transition-all shadow-2xs"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub</span>
                <ExternalLinkIcon className="w-3 h-3 text-fg-subtle" />
              </a>
            )}
            {entity.links.linkedin && (
              <a
                href={entity.links.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface/80 border border-border-strong hover:border-accent-primary text-fg-primary transition-all shadow-2xs"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLinkIcon className="w-3 h-3 text-fg-subtle" />
              </a>
            )}
            {entity.links.email && (
              <a
                href={`mailto:${entity.links.email}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg-surface/80 border border-border-strong hover:border-accent-primary text-fg-primary transition-all shadow-2xs"
              >
                <MailIcon className="w-3.5 h-3.5" />
                <span>{entity.links.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* East Flank: SKILLS Domain (Presence over buttons) */}
        <div
          className="lg:col-span-3 flex flex-col items-start lg:items-end space-y-3 order-3"
          onMouseEnter={() => handleDomainHover('skills')}
          onMouseLeave={() => handleDomainHover(null)}
        >
          <button
            type="button"
            id="domain-skills"
            onClick={() => focus('skill:fullstack-development')}
            className="text-[11px] font-mono tracking-widest text-accent-primary uppercase font-bold hover:text-fg-primary transition-colors cursor-pointer"
          >
            SKILLS DOMAIN ▶
          </button>

          <div className="flex flex-col space-y-2 text-left lg:text-right">
            <button
              type="button"
              onClick={() => focus('skill:fullstack-development')}
              onMouseEnter={() => handleEntityHover('skill:fullstack-development')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('skill:fullstack-development')}
              onBlur={() => handleEntityHover(null)}
              className="text-base sm:text-lg font-bold text-fg-primary hover:text-accent-primary transition-colors cursor-pointer text-left lg:text-right group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">Full-Stack</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Production Web Architecture</span>
            </button>

            <button
              type="button"
              onClick={() => focus('skill:frontend-architecture')}
              onMouseEnter={() => handleEntityHover('skill:frontend-architecture')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('skill:frontend-architecture')}
              onBlur={() => handleEntityHover(null)}
              className="text-sm sm:text-base font-medium text-fg-secondary hover:text-accent-primary transition-colors cursor-pointer text-left lg:text-right group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">Frontend Systems</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Interactive UIs &amp; Design</span>
            </button>

            <button
              type="button"
              onClick={() => focus('skill:database-engineering')}
              onMouseEnter={() => handleEntityHover('skill:database-engineering')}
              onMouseLeave={() => handleEntityHover(null)}
              onFocus={() => handleEntityHover('skill:database-engineering')}
              onBlur={() => handleEntityHover(null)}
              className="text-sm sm:text-base font-medium text-fg-secondary hover:text-accent-primary transition-colors cursor-pointer text-left lg:text-right group"
            >
              <span className="group-hover:underline underline-offset-4 decoration-accent-primary/60">Data Engineering</span>
              <span className="text-[10px] font-mono text-fg-subtle block">Relational &amp; Vector Data</span>
            </button>

            {isSkillsExpanded && (
              <button
                type="button"
                onClick={() => focus('skill:systems-performance')}
                onMouseEnter={() => handleEntityHover('skill:systems-performance')}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover('skill:systems-performance')}
                onBlur={() => handleEntityHover(null)}
                className="text-xs font-medium text-fg-muted hover:text-accent-primary transition-colors cursor-pointer text-left lg:text-right animate-in fade-in duration-200"
              >
                Systems &amp; Architecture
                <span className="text-[9px] font-mono text-fg-subtle block">Security &amp; Performance</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* South / Bottom: TIMELINE Domain */}
      <div
        className="w-full flex flex-col items-center pb-2 pt-4 border-t border-border-subtle/50"
        onMouseEnter={() => handleDomainHover('timeline')}
        onMouseLeave={() => handleDomainHover(null)}
      >
        <button
          type="button"
          id="domain-timeline"
          onClick={() => focus('timeline:2026-08-deadcode')}
          className="text-[11px] font-mono tracking-[0.25em] text-accent-primary uppercase font-bold hover:text-fg-primary transition-colors cursor-pointer mb-2"
        >
          ▼ CHRONOLOGICAL TIMELINE AXIS
        </button>

        <div className="flex items-center justify-center gap-4 sm:gap-10 text-xs font-mono text-fg-muted overflow-x-auto w-full max-w-4xl px-4 py-1">
          <button
            type="button"
            onClick={() => focus('timeline:2025-06-foundations')}
            onMouseEnter={() => handleEntityHover('timeline:2025-06-foundations')}
            onMouseLeave={() => handleEntityHover(null)}
            onFocus={() => handleEntityHover('timeline:2025-06-foundations')}
            onBlur={() => handleEntityHover(null)}
            className="hover:text-accent-primary transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
            <span>2025 Foundation</span>
          </button>
          <span className="text-fg-subtle">──</span>
          <button
            type="button"
            onClick={() => focus('timeline:2026-08-deadcode')}
            onMouseEnter={() => handleEntityHover('timeline:2026-08-deadcode')}
            onMouseLeave={() => handleEntityHover(null)}
            onFocus={() => handleEntityHover('timeline:2026-08-deadcode')}
            onBlur={() => handleEntityHover(null)}
            className="hover:text-accent-primary transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap font-medium text-fg-primary"
          >
            <span className="w-2 h-2 rounded-full bg-accent-primary animate-ping" />
            <span>2026 DeadCode</span>
          </button>
          <span className="text-fg-subtle">──</span>
          <button
            type="button"
            onClick={() => focus('timeline:2026-08-node')}
            onMouseEnter={() => handleEntityHover('timeline:2026-08-node')}
            onMouseLeave={() => handleEntityHover(null)}
            onFocus={() => handleEntityHover('timeline:2026-08-node')}
            onBlur={() => handleEntityHover(null)}
            className="hover:text-accent-primary transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-border-strong" />
            <span>NODE Launch</span>
          </button>
        </div>

        {/* Ambient Relationship Whisper */}
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2. Project Stage (Spatial Proximity Environment with Progressive Emergence)
// ---------------------------------------------------------------------------

function ProjectStage({ context }: { context: ProjectContext }) {
  const { focus, inspect } = useExploration()
  const { entity, technologies, skills, timeline, relatedProjects } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)
  const [showFullNotes, setShowFullNotes] = useState(false)
  const [revealedArchitecture, setRevealedArchitecture] = useState(false)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  // Core Satellites: Initially reveal strongest technologies (TypeScript, Next.js, React)
  const coreTech = technologies.slice(0, 3)
  // Architecture Depth: Discoverable secondary tier (Prisma, PostgreSQL)
  const secondaryTech = technologies.slice(3, 5)

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-stage relative select-text">
      {/* Top Bar: Spatial Memory Retrace */}
      <div className="w-full flex items-center justify-between">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-wider text-accent-primary font-semibold">
          <span>Project Artifact</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.category.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Main 2D Spatial Environment */}
      <div className="my-auto py-4 flex flex-col items-center relative max-w-5xl mx-auto w-full">
        {/* Directly Satellite: High-Proximity Core Satellites (TypeScript, Next.js, React) */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mb-6">
          {coreTech.map((tech) => {
            const isHovered = hoveredEntityId === tech.id
            const isDimmed = hoveredEntityId !== null && !isHovered

            return (
              <div
                key={tech.id}
                className={`group flex items-center gap-1.5 transition-all duration-300 ${
                  isDimmed ? 'opacity-35' : 'opacity-100 scale-100'
                }`}
              >
                <button
                  type="button"
                  onClick={() => focus(tech.id)}
                  onMouseEnter={() => handleEntityHover(tech.id)}
                  onMouseLeave={() => handleEntityHover(null)}
                  onFocus={() => handleEntityHover(tech.id)}
                  onBlur={() => handleEntityHover(null)}
                  className="group/tech text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary px-2 py-1 rounded"
                >
                  <div className="text-sm sm:text-base font-bold text-fg-primary group-hover/tech:text-accent-primary transition-colors flex items-center gap-1.5">
                    <span className="text-accent-primary text-xs">●</span>
                    <span className="group-hover/tech:underline underline-offset-4 decoration-accent-primary/60">
                      {tech.name}
                    </span>
                  </div>
                  <div className="text-[10px] font-mono text-fg-muted">{tech.category}</div>
                </button>
                <button
                  type="button"
                  onClick={() => inspect(tech.id)}
                  onMouseEnter={() => handleEntityHover(tech.id)}
                  onMouseLeave={() => handleEntityHover(null)}
                  className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer transition-colors"
                  title={`Inspect ${tech.name} relationship bridge`}
                  aria-label={`Inspect ${tech.name}`}
                >
                  <EyeIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>

        {/* Central Focal Center (The Project Presence) */}
        <div className="text-center space-y-3 max-w-2xl px-4 py-2">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-fg-primary leading-none">
            {entity.name}
          </h1>

          <p className="text-base sm:text-xl text-fg-secondary font-medium leading-snug">
            {entity.summary}
          </p>

          {/* Action Launchers */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {entity.liveUrl && (
              <a
                href={entity.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2 rounded-full bg-accent-primary text-accent-fg hover:bg-accent-hover text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <span>Launch Live Application</span>
                <ExternalLinkIcon className="w-3.5 h-3.5" />
              </a>
            )}
            {entity.repositoryUrl && (
              <a
                href={entity.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-full bg-bg-surface border border-border-strong hover:border-accent-primary text-fg-primary text-xs font-mono flex items-center gap-2 transition-all shadow-2xs cursor-pointer"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
                <ExternalLinkIcon className="w-3 h-3 text-fg-subtle" />
              </a>
            )}
          </div>

          {/* Expandable Architectural Details */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowFullNotes(!showFullNotes)}
              className="text-[11px] font-mono text-fg-muted hover:text-accent-primary cursor-pointer transition-colors"
            >
              {showFullNotes ? 'Hide Architectural Details ▲' : 'Read Architectural Details ▼'}
            </button>
            {showFullNotes && (
              <p className="text-xs text-fg-muted max-w-lg mx-auto pt-2 leading-relaxed animate-in fade-in duration-200">
                {entity.description}
              </p>
            )}
          </div>
        </div>

        {/* Lower Satellites & Progressive Architecture Emergence */}
        <div className="flex flex-col items-center mt-6 space-y-3">
          {/* Architecture Depth Emergence Toggle */}
          {!revealedArchitecture && secondaryTech.length > 0 && (
            <button
              type="button"
              onClick={() => setRevealedArchitecture(true)}
              onMouseEnter={() => setRevealedArchitecture(true)}
              className="text-[11px] font-mono text-accent-primary hover:text-fg-primary cursor-pointer transition-colors flex items-center gap-1.5"
            >
              <span>✦ Discover Architecture Depth (Prisma, PostgreSQL, Full-Stack) ↓</span>
            </button>
          )}

          {/* Emergent Architectural Satellites (Prisma, PostgreSQL, Full-Stack Development) */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8">
            {secondaryTech.map((tech) => {
              const isHovered = hoveredEntityId === tech.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <div
                  key={tech.id}
                  className={`group flex items-center gap-1.5 transition-all duration-300 ${
                    !revealedArchitecture ? 'opacity-0 scale-95 pointer-events-none' : isDimmed ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => focus(tech.id)}
                    onMouseEnter={() => handleEntityHover(tech.id)}
                    onMouseLeave={() => handleEntityHover(null)}
                    onFocus={() => handleEntityHover(tech.id)}
                    onBlur={() => handleEntityHover(null)}
                    className="group/tech text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary px-2 py-1 rounded"
                  >
                    <div className="text-sm sm:text-base font-bold text-fg-primary group-hover/tech:text-accent-primary transition-colors flex items-center gap-1.5">
                      <span className="text-accent-primary text-xs">●</span>
                      <span className="group-hover/tech:underline underline-offset-4 decoration-accent-primary/60">
                        {tech.name}
                      </span>
                    </div>
                    <div className="text-[10px] font-mono text-fg-muted">{tech.category}</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => inspect(tech.id)}
                    className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer"
                    title={`Inspect ${tech.name}`}
                    aria-label={`Inspect ${tech.name}`}
                  >
                    <EyeIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              )
            })}

            {skills.slice(0, 2).map((skill) => {
              const isHovered = hoveredEntityId === skill.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <button
                  key={skill.id}
                  type="button"
                  onClick={() => focus(skill.id)}
                  onMouseEnter={() => handleEntityHover(skill.id)}
                  onMouseLeave={() => handleEntityHover(null)}
                  onFocus={() => handleEntityHover(skill.id)}
                  onBlur={() => handleEntityHover(null)}
                  className={`text-xs font-mono text-fg-secondary hover:text-accent-primary transition-all cursor-pointer group/skill ${
                    !revealedArchitecture ? 'opacity-0 scale-95 pointer-events-none' : isDimmed ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  <span className="group-hover/skill:underline underline-offset-4 decoration-accent-primary/60">
                    {skill.name} →
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Peripheral Related Lineages (NODE, VaultX, AuraShelf, Letterly AI) */}
        {relatedProjects.length > 0 && (
          <div className="w-full flex flex-col sm:flex-row items-center justify-between mt-8 pt-4 border-t border-border-subtle/50 text-xs font-mono gap-2">
            <span className="text-fg-muted">Peripheral Architecture:</span>
            <div className="flex flex-wrap items-center gap-4">
              {relatedProjects.map((rel) => {
                const isHovered = hoveredEntityId === rel.project.id
                const isDimmed = hoveredEntityId !== null && !isHovered

                return (
                  <div
                    key={rel.project.id}
                    className={`flex items-center gap-1.5 transition-all duration-300 ${
                      isDimmed ? 'opacity-35' : 'opacity-100'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => focus(rel.project.id)}
                      onMouseEnter={() => handleEntityHover(rel.project.id)}
                      onMouseLeave={() => handleEntityHover(null)}
                      onFocus={() => handleEntityHover(rel.project.id)}
                      onBlur={() => handleEntityHover(null)}
                      className="text-fg-secondary hover:text-accent-primary font-medium cursor-pointer hover:underline underline-offset-4 decoration-accent-primary/60"
                    >
                      {rel.project.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => inspect(rel.project.id)}
                      className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer"
                      title={`Inspect ${rel.project.name}`}
                      aria-label={`Inspect ${rel.project.name}`}
                    >
                      <EyeIcon className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Marker: Milestone Date */}
      <div className="w-full flex flex-col items-center pb-2">
        {timeline.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-mono text-fg-muted mb-1">
            <span className="text-fg-subtle">Milestone Anchor:</span>
            {timeline.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => focus(entry.id)}
                onMouseEnter={() => handleEntityHover(entry.id)}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover(entry.id)}
                onBlur={() => handleEntityHover(null)}
                className="hover:text-accent-primary transition-colors cursor-pointer text-accent-primary font-medium"
              >
                {entry.date} ({entry.name})
              </button>
            ))}
          </div>
        )}
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. Technology Stage (Center Anchor + Reverse Orbit)
// ---------------------------------------------------------------------------

function TechnologyStage({ context }: { context: TechnologyContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects, relatedSkills, relatedTechnologies } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-stage relative select-text">
      {/* Top Bar: Spatial Memory */}
      <div className="w-full flex items-center justify-between">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-wider text-accent-primary font-semibold">
          <span>Technology Anchor</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.category}</span>
        </div>
      </div>

      {/* Main 2D Scene Composition */}
      <div className="my-auto py-4 flex flex-col items-center relative max-w-5xl mx-auto w-full">
        {/* Outer Orbit Top: Frequently Used Alongside (Co-occurrence) */}
        {relatedTechnologies.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mb-4 text-xs font-mono">
            <span className="text-[11px] text-fg-subtle uppercase tracking-wider mr-1">
              Frequently Used Alongside:
            </span>
            {relatedTechnologies.slice(0, 6).map((tech) => {
              const isHovered = hoveredEntityId === tech.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <button
                  key={tech.id}
                  type="button"
                  onClick={() => focus(tech.id)}
                  onMouseEnter={() => handleEntityHover(tech.id)}
                  onMouseLeave={() => handleEntityHover(null)}
                  onFocus={() => handleEntityHover(tech.id)}
                  onBlur={() => handleEntityHover(null)}
                  className={`px-2.5 py-0.5 rounded-full bg-bg-surface/50 hover:bg-bg-surface border border-border-subtle hover:border-accent-primary text-fg-muted hover:text-fg-primary transition-all cursor-pointer ${
                    isDimmed ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  {tech.name}
                </button>
              )
            })}
          </div>
        )}

        {/* Central Technology Anchor */}
        <div className="text-center space-y-3 max-w-2xl px-4 py-2">
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-fg-primary leading-none">
            {entity.name}
          </h1>

          <p className="text-base sm:text-lg text-fg-secondary font-medium max-w-xl mx-auto">
            {entity.summary}
          </p>
        </div>

        {/* Direct Reverse Deployments: Projects Implemented with this Technology */}
        <div className="w-full mt-6 space-y-3 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-fg-muted">
            Projects Implemented with {entity.name} (0{projects.length} Verified Deployments)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {projects.map((project) => {
              const isHovered = hoveredEntityId === project.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <div
                  key={project.id}
                  className={`group text-left transition-all duration-300 ${
                    isDimmed ? 'opacity-35' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => focus(project.id)}
                      onMouseEnter={() => handleEntityHover(project.id)}
                      onMouseLeave={() => handleEntityHover(null)}
                      onFocus={() => handleEntityHover(project.id)}
                      onBlur={() => handleEntityHover(null)}
                      className="text-xl sm:text-2xl font-bold text-fg-primary hover:text-accent-primary transition-colors cursor-pointer group-hover:underline underline-offset-4 decoration-accent-primary/60"
                    >
                      {project.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => inspect(project.id)}
                      className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer"
                      title={`Inspect ${project.name}`}
                      aria-label={`Inspect ${project.name}`}
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-fg-muted line-clamp-1 max-w-xs">{project.summary}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Nearby Associated Skills */}
        {relatedSkills.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 pt-4 border-t border-border-subtle/50 text-xs font-mono">
            <span className="text-fg-muted">Demonstrated Skills:</span>
            {relatedSkills.map((skill) => (
              <button
                key={skill.id}
                type="button"
                onClick={() => focus(skill.id)}
                onMouseEnter={() => handleEntityHover(skill.id)}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover(skill.id)}
                onBlur={() => handleEntityHover(null)}
                className="text-fg-secondary hover:text-accent-primary cursor-pointer transition-colors hover:underline underline-offset-4 decoration-accent-primary/60"
              >
                {skill.name} →
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Axis Cue */}
      <div className="w-full flex flex-col items-center pb-2">
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 4. Skill Stage (Competency Area & Evidentiary Projects)
// ---------------------------------------------------------------------------

function SkillStage({ context }: { context: SkillContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects, relatedTechnologies } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-stage relative select-text">
      {/* Top Bar: Spatial Memory */}
      <div className="w-full flex items-center justify-between">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-wider text-accent-primary font-semibold">
          <span>Competency Area</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>Practice Domain</span>
        </div>
      </div>

      {/* Main 2D Environment */}
      <div className="my-auto py-4 flex flex-col items-center relative max-w-5xl mx-auto w-full">
        {/* Central Skill Anchor */}
        <div className="text-center space-y-3 max-w-2xl px-4 py-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-fg-primary leading-tight">
            {entity.name}
          </h1>

          <p className="text-base sm:text-lg text-fg-secondary font-medium max-w-xl mx-auto">
            {entity.summary}
          </p>
        </div>

        {/* Proving Projects Clustered Around Concept */}
        <div className="w-full mt-6 space-y-3 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-fg-muted">
            Projects Evidencing This Competency (0{projects.length} Verified)
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {projects.map((project) => {
              const isHovered = hoveredEntityId === project.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <div
                  key={project.id}
                  className={`group text-left transition-all duration-300 ${
                    isDimmed ? 'opacity-35' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => focus(project.id)}
                      onMouseEnter={() => handleEntityHover(project.id)}
                      onMouseLeave={() => handleEntityHover(null)}
                      onFocus={() => handleEntityHover(project.id)}
                      onBlur={() => handleEntityHover(null)}
                      className="text-xl sm:text-2xl font-bold text-fg-primary hover:text-accent-primary transition-colors cursor-pointer group-hover:underline underline-offset-4 decoration-accent-primary/60"
                    >
                      {project.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => inspect(project.id)}
                      className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer"
                      title={`Inspect ${project.name}`}
                      aria-label={`Inspect ${project.name}`}
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-fg-muted line-clamp-1 max-w-xs">{project.summary}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Associated Supporting Technologies */}
        {relatedTechnologies.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8 pt-4 border-t border-border-subtle/50 text-xs font-mono">
            <span className="text-fg-muted mr-1">Supporting Technologies:</span>
            {relatedTechnologies.map((tech) => (
              <button
                key={tech.id}
                type="button"
                onClick={() => focus(tech.id)}
                onMouseEnter={() => handleEntityHover(tech.id)}
                onMouseLeave={() => handleEntityHover(null)}
                onFocus={() => handleEntityHover(tech.id)}
                onBlur={() => handleEntityHover(null)}
                className="px-2.5 py-0.5 rounded-full bg-bg-surface/50 hover:bg-bg-surface border border-border-subtle hover:border-accent-primary text-fg-secondary hover:text-fg-primary transition-colors cursor-pointer"
              >
                {tech.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Axis Cue */}
      <div className="w-full flex flex-col items-center pb-2">
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. Timeline Stage (Temporal Environment & Branching Projects)
// ---------------------------------------------------------------------------

function TimelineStage({ context }: { context: TimelineContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  return (
    <div className="w-full h-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-4 sm:p-6 lg:p-8 animate-stage relative select-text">
      {/* Top Bar: Spatial Memory */}
      <div className="w-full flex items-center justify-between">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-wider text-accent-primary font-semibold">
          <span>Milestone Anchor</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.date}</span>
        </div>
      </div>

      {/* Main 2D Temporal Environment */}
      <div className="my-auto py-4 flex flex-col items-center relative max-w-5xl mx-auto w-full">
        {/* Temporal Axis Spine (Visual Temporal Lineage) */}
        <div className="flex items-center gap-6 text-xs font-mono text-fg-muted mb-6">
          <span>2025</span>
          <span className="w-12 h-px bg-border-strong" />
          <div className="inline-block text-xs font-mono text-accent-primary font-bold px-3 py-1 rounded-full bg-accent-subtle border border-accent-primary/25">
            {entity.date}
          </div>
          <span className="w-12 h-px bg-border-strong" />
          <span>2026</span>
        </div>

        {/* Central Milestone Anchor */}
        <div className="text-center space-y-3 max-w-2xl px-4 py-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-fg-primary leading-tight">
            {entity.name}
          </h1>

          <p className="text-base sm:text-lg text-fg-secondary font-medium max-w-xl mx-auto">
            {entity.summary}
          </p>
        </div>

        {/* Branching Associated Projects Attached to Time */}
        <div className="w-full mt-8 space-y-3 text-center">
          <div className="text-xs font-mono uppercase tracking-wider text-fg-muted">
            Associated Projects Launched at this Milestone (0{projects.length})
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 pt-2">
            {projects.map((project) => {
              const isHovered = hoveredEntityId === project.id
              const isDimmed = hoveredEntityId !== null && !isHovered

              return (
                <div
                  key={project.id}
                  className={`group text-left transition-all duration-300 ${
                    isDimmed ? 'opacity-35' : 'opacity-100 scale-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => focus(project.id)}
                      onMouseEnter={() => handleEntityHover(project.id)}
                      onMouseLeave={() => handleEntityHover(null)}
                      onFocus={() => handleEntityHover(project.id)}
                      onBlur={() => handleEntityHover(null)}
                      className="text-xl sm:text-2xl font-bold text-fg-primary hover:text-accent-primary transition-colors cursor-pointer group-hover:underline underline-offset-4 decoration-accent-primary/60"
                    >
                      {project.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => inspect(project.id)}
                      className="p-1 rounded text-fg-subtle hover:text-fg-primary cursor-pointer"
                      title={`Inspect ${project.name}`}
                      aria-label={`Inspect ${project.name}`}
                    >
                      <EyeIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-xs text-fg-muted mt-1 max-w-xs">{project.summary}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Bottom Axis Cue */}
      <div className="w-full flex flex-col items-center pb-2">
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main ExplorationStage Dispatcher
// ---------------------------------------------------------------------------

export function ExplorationStage() {
  const { resolvedContext } = useExploration()

  if (!resolvedContext) {
    return (
      <div className="p-8 text-center text-fg-muted font-mono text-xs border border-border-strong rounded-lg bg-bg-surface">
        Entity node could not be resolved in the portfolio registry.
      </div>
    )
  }

  switch (resolvedContext.type) {
    case 'profile':
      return <ProfileStage context={resolvedContext} />
    case 'project':
      return <ProjectStage context={resolvedContext} />
    case 'technology':
      return <TechnologyStage context={resolvedContext} />
    case 'skill':
      return <SkillStage context={resolvedContext} />
    case 'timeline':
      return <TimelineStage context={resolvedContext} />
  }
}
