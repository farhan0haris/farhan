import { useState, useCallback } from 'react'
import { useExploration } from '../../state'
import { getEntity } from '../../core'
import { setEnvironmentHover } from '../environment'
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
        onMouseEnter={() => setEnvironmentHover(prevEntry.focusedEntityId)}
        onMouseLeave={() => setEnvironmentHover(null)}
        className="group inline-flex items-center gap-2 px-2.5 py-1 rounded-full hover:bg-fg-primary/5 transition-all cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary"
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
// Shared Satellite Node (Deterministic Safe Zone Entity)
// ---------------------------------------------------------------------------

interface SatelliteNodeProps {
  id: string
  name: string
  subtitle?: string
  isHovered: boolean
  isDimmed: boolean
  onFocus: () => void
  onInspect: () => void
  onHoverStart: () => void
  onHoverEnd: () => void
}

function SatelliteNode({
  name,
  subtitle,
  isHovered,
  isDimmed,
  onFocus,
  onInspect,
  onHoverStart,
  onHoverEnd,
}: SatelliteNodeProps) {
  return (
    <div
      className={`group flex items-center gap-2 transition-all duration-300 ${
        isDimmed ? 'opacity-25 scale-95' : isHovered ? 'opacity-100 scale-105' : 'opacity-80 hover:opacity-100'
      }`}
    >
      <button
        type="button"
        onClick={onFocus}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={onHoverEnd}
        className="px-3.5 py-2 rounded-lg text-left cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary transition-all duration-200"
      >
        <div
          className={`text-base sm:text-lg font-bold tracking-tight transition-colors ${
            isHovered ? 'text-accent-primary' : 'text-fg-primary group-hover:text-accent-primary'
          }`}
        >
          {name}
        </div>
        {subtitle && (
          <div className="text-[10px] font-mono text-fg-muted uppercase tracking-wider mt-0.5">
            {subtitle}
          </div>
        )}
      </button>

      <button
        type="button"
        onClick={onInspect}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        className="p-1.5 rounded text-fg-subtle hover:text-accent-primary transition-colors cursor-pointer"
        title={`Inspect ${name}`}
        aria-label={`Inspect ${name}`}
      >
        <EyeIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 1. Profile Exploration Stage (Progressive Discovery, Vast Empty Space)
// ---------------------------------------------------------------------------

function ProfileStage({ context }: { context: ProfileContext }) {
  const { focus } = useExploration()
  const { entity } = context
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleDestinationHover = (domain: 'projects' | 'technologies' | 'skills' | 'timeline' | null) => {
    if (domain === 'projects') {
      setWhisper({
        badge: 'PROJECTS DOMAIN',
        title: 'Verified Software Systems',
        detail: '5 full-stack web applications and developer tools with live codebases',
        kind: 'direct',
      })
      setEnvironmentHover('project:deadcode')
    } else if (domain === 'technologies') {
      setWhisper({
        badge: 'TECHNOLOGIES DOMAIN',
        title: 'Technical Stack',
        detail: '23 frameworks, languages, and databases powering production systems',
        kind: 'direct',
      })
      setEnvironmentHover('technology:typescript')
    } else if (domain === 'skills') {
      setWhisper({
        badge: 'SKILLS DOMAIN',
        title: 'Core Competencies',
        detail: '7 demonstrated capability domains verified by codebase architectures',
        kind: 'direct',
      })
      setEnvironmentHover('skill:fullstack-development')
    } else if (domain === 'timeline') {
      setWhisper({
        badge: 'TIMELINE AXIS',
        title: 'Chronological Milestones',
        detail: 'Temporal deployment history spanning foundation to production releases',
        kind: 'direct',
      })
      setEnvironmentHover('timeline:2026-08-deadcode')
    } else {
      setWhisper(null)
      setEnvironmentHover(null)
    }
  }

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-6 sm:p-10 lg:p-14 animate-stage relative select-text">
      {/* Top / North: PROJECTS Destination (Clean & Vast) */}
      <div className="w-full flex justify-center pt-2">
        <button
          type="button"
          id="domain-projects"
          onClick={() => focus('project:deadcode')}
          onMouseEnter={() => handleDestinationHover('projects')}
          onMouseLeave={() => handleDestinationHover(null)}
          onFocus={() => handleDestinationHover('projects')}
          onBlur={() => handleDestinationHover(null)}
          className="group px-6 py-2 rounded-full text-xs font-mono tracking-[0.25em] uppercase text-fg-secondary hover:text-accent-primary transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary hover:scale-105"
        >
          <span className="text-accent-primary/60 group-hover:text-accent-primary mr-2 transition-colors">▲</span>
          <span>PROJECTS</span>
        </button>
      </div>

      {/* Middle Equator: West (TECHNOLOGIES) ── Center (THE IDENTITY) ── East (SKILLS) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center my-auto py-8">
        {/* West Flank: TECHNOLOGIES Destination */}
        <div className="md:col-span-3 flex justify-start order-2 md:order-1">
          <button
            type="button"
            id="domain-technologies"
            onClick={() => focus('technology:typescript')}
            onMouseEnter={() => handleDestinationHover('technologies')}
            onMouseLeave={() => handleDestinationHover(null)}
            onFocus={() => handleDestinationHover('technologies')}
            onBlur={() => handleDestinationHover(null)}
            className="group px-4 py-2 rounded-full text-xs font-mono tracking-[0.25em] uppercase text-fg-secondary hover:text-accent-primary transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary hover:scale-105"
          >
            <span className="text-accent-primary/60 group-hover:text-accent-primary mr-2 transition-colors">◀</span>
            <span>TECHNOLOGIES</span>
          </button>
        </div>

        {/* Center: THE FOCAL IDENTITY (FARHAN HARIS) */}
        <div className="md:col-span-6 text-center space-y-4 order-1 md:order-2 px-4">
          <div className="w-full max-w-xl mx-auto flex flex-col items-center justify-center select-none py-2">
            <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl font-light tracking-tight leading-[0.88] text-center">
              <span className="block italic text-fg-primary">
                Farhan
              </span>
              <span className="block font-normal not-italic tracking-[0.22em] uppercase text-accent-primary text-4xl sm:text-6xl lg:text-7xl mt-2">
                Haris
              </span>
            </h1>
          </div>

          <div className="text-sm sm:text-base text-fg-secondary font-sans font-medium tracking-wide">
            Developer / BCA Student
          </div>

          <p className="text-xs sm:text-sm text-fg-muted max-w-md mx-auto leading-relaxed font-sans pt-1">
            {entity.summary}
          </p>

          {/* Social Presence Links: Clean, spaced pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-mono">
            {entity.links.github && (
              <a
                href={entity.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-fg-muted hover:text-accent-primary transition-colors cursor-pointer hover:bg-accent-subtle/30"
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
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-fg-muted hover:text-accent-primary transition-colors cursor-pointer hover:bg-accent-subtle/30"
              >
                <LinkedinIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
                <ExternalLinkIcon className="w-3 h-3 text-fg-subtle" />
              </a>
            )}
            {entity.links.email && (
              <a
                href={`mailto:${entity.links.email}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-fg-muted hover:text-accent-primary transition-colors cursor-pointer hover:bg-accent-subtle/30"
              >
                <MailIcon className="w-3.5 h-3.5" />
                <span>{entity.links.email}</span>
              </a>
            )}
          </div>
        </div>

        {/* East Flank: SKILLS Destination */}
        <div className="md:col-span-3 flex justify-end order-3">
          <button
            type="button"
            id="domain-skills"
            onClick={() => focus('skill:fullstack-development')}
            onMouseEnter={() => handleDestinationHover('skills')}
            onMouseLeave={() => handleDestinationHover(null)}
            onFocus={() => handleDestinationHover('skills')}
            onBlur={() => handleDestinationHover(null)}
            className="group px-4 py-2 rounded-full text-xs font-mono tracking-[0.25em] uppercase text-fg-secondary hover:text-accent-primary transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary hover:scale-105"
          >
            <span>SKILLS</span>
            <span className="text-accent-primary/60 group-hover:text-accent-primary ml-2 transition-colors">▶</span>
          </button>
        </div>
      </div>

      {/* Bottom / South: TIMELINE Destination */}
      <div className="w-full flex flex-col items-center pb-2">
        <button
          type="button"
          id="domain-timeline"
          onClick={() => focus('timeline:2026-08-deadcode')}
          onMouseEnter={() => handleDestinationHover('timeline')}
          onMouseLeave={() => handleDestinationHover(null)}
          onFocus={() => handleDestinationHover('timeline')}
          onBlur={() => handleDestinationHover(null)}
          className="group px-6 py-2 rounded-full text-xs font-mono tracking-[0.25em] uppercase text-fg-secondary hover:text-accent-primary transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent-primary hover:scale-105 mb-3"
        >
          <span className="text-accent-primary/60 group-hover:text-accent-primary mr-2 transition-colors">▼</span>
          <span>TIMELINE</span>
        </button>

        {/* Ambient Relationship Whisper */}
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 2. Project Stage (Deterministic Safe Zones: DeadCode)
// ---------------------------------------------------------------------------

function ProjectStage({ context }: { context: ProjectContext }) {
  const { focus, inspect } = useExploration()
  const { entity, technologies, timeline, relatedProjects } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      setEnvironmentHover(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  // Deterministic safe-zone allocations (Center, Top, Top-Left, Top-Right, Bottom-Left, Bottom-Right)
  const topTech = technologies[0] // TypeScript
  const leftTech = technologies[1] // React
  const rightTech = technologies[2] // Next.js
  const bottomTech1 = technologies[3] // Prisma
  const bottomTech2 = technologies[4] // PostgreSQL
  const milestone = timeline[0]
  const peripheralProject = relatedProjects[0]?.project

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 animate-stage relative select-text">
      {/* Top Header Row: Reserved Origin Zone (History) on Left, Type Badge on Right */}
      <div className="w-full flex items-center justify-between z-20">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-widest text-accent-primary font-semibold">
          <span>Project</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.category.replace('-', ' ')}</span>
        </div>
      </div>

      {/* Main Spatial Stage: Deterministic Safe Zones */}
      <div className="w-full max-w-5xl mx-auto my-auto relative flex flex-col items-center py-6">
        {/* Zone 1: TOP SATELLITE (TypeScript) */}
        {topTech && (
          <div className="mb-6 sm:mb-8 z-10">
            <SatelliteNode
              id={topTech.id}
              name={topTech.name}
              subtitle={topTech.category}
              isHovered={hoveredEntityId === topTech.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== topTech.id}
              onFocus={() => focus(topTech.id)}
              onInspect={() => inspect(topTech.id)}
              onHoverStart={() => handleEntityHover(topTech.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          </div>
        )}

        {/* Zone 2: UPPER EQUATOR (Top-Left React ── Center Focus ── Top-Right Next.js) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-items-center">
          {/* Top-Left: React */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start z-10 order-2 lg:order-1">
            {leftTech && (
              <SatelliteNode
                id={leftTech.id}
                name={leftTech.name}
                subtitle={leftTech.category}
                isHovered={hoveredEntityId === leftTech.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== leftTech.id}
                onFocus={() => focus(leftTech.id)}
                onInspect={() => inspect(leftTech.id)}
                onHoverStart={() => handleEntityHover(leftTech.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>

          {/* CENTER ZONE: THE FOCUSED PROJECT (DEADCODE) */}
          <div className="lg:col-span-6 text-center space-y-4 z-20 order-1 lg:order-2 px-2 max-w-lg">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-fg-primary leading-none">
              {entity.name}
            </h1>

            <p className="text-sm sm:text-base text-fg-secondary font-sans leading-relaxed">
              {entity.summary}
            </p>

            {/* Launchers */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {entity.liveUrl && (
                <a
                  href={entity.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2 rounded-full bg-accent-primary text-accent-fg hover:bg-accent-hover text-xs font-mono font-medium flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                >
                  <span>Launch Live</span>
                  <ExternalLinkIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {entity.repositoryUrl && (
                <a
                  href={entity.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-full border border-border-strong hover:border-accent-primary/50 text-fg-secondary hover:text-accent-primary text-xs font-mono flex items-center gap-2 transition-all cursor-pointer"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                  <span>Repository</span>
                  <ExternalLinkIcon className="w-3 h-3 text-fg-subtle" />
                </a>
              )}
            </div>
          </div>

          {/* Top-Right: Next.js */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end z-10 order-3">
            {rightTech && (
              <SatelliteNode
                id={rightTech.id}
                name={rightTech.name}
                subtitle={rightTech.category}
                isHovered={hoveredEntityId === rightTech.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== rightTech.id}
                onFocus={() => focus(rightTech.id)}
                onInspect={() => inspect(rightTech.id)}
                onHoverStart={() => handleEntityHover(rightTech.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>
        </div>

        {/* Zone 3: LOWER SATELLITES (Bottom-Left Prisma ── Bottom-Right PostgreSQL) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-6 sm:mt-10 z-10">
          {bottomTech1 && (
            <SatelliteNode
              id={bottomTech1.id}
              name={bottomTech1.name}
              subtitle={bottomTech1.category}
              isHovered={hoveredEntityId === bottomTech1.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== bottomTech1.id}
              onFocus={() => focus(bottomTech1.id)}
              onInspect={() => inspect(bottomTech1.id)}
              onHoverStart={() => handleEntityHover(bottomTech1.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
          {bottomTech2 && (
            <SatelliteNode
              id={bottomTech2.id}
              name={bottomTech2.name}
              subtitle={bottomTech2.category}
              isHovered={hoveredEntityId === bottomTech2.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== bottomTech2.id}
              onFocus={() => focus(bottomTech2.id)}
              onInspect={() => inspect(bottomTech2.id)}
              onHoverStart={() => handleEntityHover(bottomTech2.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
        </div>

        {/* Peripheral Related Lineage (1 only, discrete) */}
        {peripheralProject && (
          <div className="mt-8 z-10">
            <button
              type="button"
              onClick={() => focus(peripheralProject.id)}
              onMouseEnter={() => handleEntityHover(peripheralProject.id)}
              onMouseLeave={() => handleEntityHover(null)}
              className="text-xs font-mono text-fg-muted hover:text-accent-primary transition-colors cursor-pointer"
            >
              Related: {peripheralProject.name} →
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar: Milestone Marker & Relationship Whisper */}
      <div className="w-full flex flex-col items-center pb-2 z-20">
        {milestone && (
          <button
            type="button"
            onClick={() => focus(milestone.id)}
            onMouseEnter={() => handleEntityHover(milestone.id)}
            onMouseLeave={() => handleEntityHover(null)}
            onFocus={() => handleEntityHover(milestone.id)}
            onBlur={() => handleEntityHover(null)}
            className="text-xs font-mono text-fg-muted hover:text-accent-primary transition-colors cursor-pointer mb-2 flex items-center gap-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent-primary/70" />
            <span>Deployed {milestone.date} · {milestone.name}</span>
          </button>
        )}
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 3. Technology Stage (Deterministic Safe Zones: TypeScript)
// ---------------------------------------------------------------------------

function TechnologyStage({ context }: { context: TechnologyContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects, relatedTechnologies, relatedSkills } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      setEnvironmentHover(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  // Near projects built with this technology
  const topProj = projects[0] // DeadCode
  const leftProj = projects[1] // NODE
  const rightProj = projects[2] // VaultX
  // Further technologies used alongside
  const coTech1 = relatedTechnologies[0] // React
  const coTech2 = relatedTechnologies[1] // Next.js
  const primarySkill = relatedSkills[0]

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 animate-stage relative select-text">
      {/* Top Header Row: Reserved Origin Zone on Left, Type Badge on Right */}
      <div className="w-full flex items-center justify-between z-20">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-widest text-accent-primary font-semibold">
          <span>Technology</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.category}</span>
        </div>
      </div>

      {/* Main Spatial Stage */}
      <div className="w-full max-w-5xl mx-auto my-auto relative flex flex-col items-center py-6">
        {/* Zone 1: TOP SATELLITE (DeadCode) */}
        {topProj && (
          <div className="mb-6 sm:mb-8 z-10">
            <SatelliteNode
              id={topProj.id}
              name={topProj.name}
              subtitle="Built with TypeScript"
              isHovered={hoveredEntityId === topProj.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== topProj.id}
              onFocus={() => focus(topProj.id)}
              onInspect={() => inspect(topProj.id)}
              onHoverStart={() => handleEntityHover(topProj.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          </div>
        )}

        {/* Zone 2: UPPER EQUATOR (Top-Left NODE ── Center Focus ── Top-Right VaultX) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-items-center">
          {/* Top-Left: NODE */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start z-10 order-2 lg:order-1">
            {leftProj && (
              <SatelliteNode
                id={leftProj.id}
                name={leftProj.name}
                subtitle="Built with TypeScript"
                isHovered={hoveredEntityId === leftProj.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== leftProj.id}
                onFocus={() => focus(leftProj.id)}
                onInspect={() => inspect(leftProj.id)}
                onHoverStart={() => handleEntityHover(leftProj.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>

          {/* CENTER ZONE: THE FOCUSED TECHNOLOGY (TYPESCRIPT) */}
          <div className="lg:col-span-6 text-center space-y-4 z-20 order-1 lg:order-2 px-2 max-w-lg">
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-fg-primary leading-none">
              {entity.name}
            </h1>

            <p className="text-sm sm:text-base text-fg-secondary font-sans leading-relaxed">
              {entity.summary}
            </p>
          </div>

          {/* Top-Right: VaultX */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end z-10 order-3">
            {rightProj && (
              <SatelliteNode
                id={rightProj.id}
                name={rightProj.name}
                subtitle="Built with TypeScript"
                isHovered={hoveredEntityId === rightProj.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== rightProj.id}
                onFocus={() => focus(rightProj.id)}
                onInspect={() => inspect(rightProj.id)}
                onHoverStart={() => handleEntityHover(rightProj.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>
        </div>

        {/* Zone 3: LOWER SATELLITES (Used Alongside: React ── Next.js) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-6 sm:mt-10 z-10">
          {coTech1 && (
            <SatelliteNode
              id={coTech1.id}
              name={coTech1.name}
              subtitle="Used Alongside"
              isHovered={hoveredEntityId === coTech1.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== coTech1.id}
              onFocus={() => focus(coTech1.id)}
              onInspect={() => inspect(coTech1.id)}
              onHoverStart={() => handleEntityHover(coTech1.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
          {coTech2 && (
            <SatelliteNode
              id={coTech2.id}
              name={coTech2.name}
              subtitle="Used Alongside"
              isHovered={hoveredEntityId === coTech2.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== coTech2.id}
              onFocus={() => focus(coTech2.id)}
              onInspect={() => inspect(coTech2.id)}
              onHoverStart={() => handleEntityHover(coTech2.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
        </div>

        {/* Associated Skill Lineage */}
        {primarySkill && (
          <div className="mt-8 z-10">
            <button
              type="button"
              onClick={() => focus(primarySkill.id)}
              onMouseEnter={() => handleEntityHover(primarySkill.id)}
              onMouseLeave={() => handleEntityHover(null)}
              className="text-xs font-mono text-fg-muted hover:text-accent-primary transition-colors cursor-pointer"
            >
              Competency: {primarySkill.name} →
            </button>
          </div>
        )}
      </div>

      {/* Bottom Bar: Relationship Whisper */}
      <div className="w-full flex flex-col items-center pb-2 z-20">
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 4. Skill Stage (Deterministic Safe Zones: Full-Stack Development)
// ---------------------------------------------------------------------------

function SkillStage({ context }: { context: SkillContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects, relatedTechnologies } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      setEnvironmentHover(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  // Near proving projects
  const topProj = projects[0] // DeadCode
  const leftProj = projects[1] // VaultX or NODE
  const rightProj = projects[2] // NODE or VaultX
  // Further tools used
  const tool1 = relatedTechnologies[0] // TypeScript
  const tool2 = relatedTechnologies[1] // PostgreSQL

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 animate-stage relative select-text">
      {/* Top Header Row: Reserved Origin Zone on Left, Type Badge on Right */}
      <div className="w-full flex items-center justify-between z-20">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-widest text-accent-primary font-semibold">
          <span>Competency</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>Core Skill</span>
        </div>
      </div>

      {/* Main Spatial Stage */}
      <div className="w-full max-w-5xl mx-auto my-auto relative flex flex-col items-center py-6">
        {/* Zone 1: TOP SATELLITE (DeadCode) */}
        {topProj && (
          <div className="mb-6 sm:mb-8 z-10">
            <SatelliteNode
              id={topProj.id}
              name={topProj.name}
              subtitle="Evidencing Project"
              isHovered={hoveredEntityId === topProj.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== topProj.id}
              onFocus={() => focus(topProj.id)}
              onInspect={() => inspect(topProj.id)}
              onHoverStart={() => handleEntityHover(topProj.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          </div>
        )}

        {/* Zone 2: UPPER EQUATOR (Top-Left ── Center Focus ── Top-Right) */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 items-center justify-items-center">
          {/* Top-Left: Proving Project */}
          <div className="lg:col-span-3 flex justify-center lg:justify-start z-10 order-2 lg:order-1">
            {leftProj && (
              <SatelliteNode
                id={leftProj.id}
                name={leftProj.name}
                subtitle="Evidencing Project"
                isHovered={hoveredEntityId === leftProj.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== leftProj.id}
                onFocus={() => focus(leftProj.id)}
                onInspect={() => inspect(leftProj.id)}
                onHoverStart={() => handleEntityHover(leftProj.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>

          {/* CENTER ZONE: THE FOCUSED SKILL */}
          <div className="lg:col-span-6 text-center space-y-4 z-20 order-1 lg:order-2 px-2 max-w-lg">
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-fg-primary leading-tight">
              {entity.name}
            </h1>

            <p className="text-sm sm:text-base text-fg-secondary font-sans leading-relaxed">
              {entity.summary}
            </p>
          </div>

          {/* Top-Right: Proving Project */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end z-10 order-3">
            {rightProj && (
              <SatelliteNode
                id={rightProj.id}
                name={rightProj.name}
                subtitle="Evidencing Project"
                isHovered={hoveredEntityId === rightProj.id}
                isDimmed={hoveredEntityId !== null && hoveredEntityId !== rightProj.id}
                onFocus={() => focus(rightProj.id)}
                onInspect={() => inspect(rightProj.id)}
                onHoverStart={() => handleEntityHover(rightProj.id)}
                onHoverEnd={() => handleEntityHover(null)}
              />
            )}
          </div>
        </div>

        {/* Zone 3: LOWER SATELLITES (Practice Tools: TypeScript ── PostgreSQL) */}
        <div className="w-full flex flex-wrap items-center justify-center gap-8 sm:gap-16 mt-6 sm:mt-10 z-10">
          {tool1 && (
            <SatelliteNode
              id={tool1.id}
              name={tool1.name}
              subtitle="Supporting Tool"
              isHovered={hoveredEntityId === tool1.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== tool1.id}
              onFocus={() => focus(tool1.id)}
              onInspect={() => inspect(tool1.id)}
              onHoverStart={() => handleEntityHover(tool1.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
          {tool2 && (
            <SatelliteNode
              id={tool2.id}
              name={tool2.name}
              subtitle="Supporting Tool"
              isHovered={hoveredEntityId === tool2.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== tool2.id}
              onFocus={() => focus(tool2.id)}
              onInspect={() => inspect(tool2.id)}
              onHoverStart={() => handleEntityHover(tool2.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          )}
        </div>
      </div>

      {/* Bottom Bar: Relationship Whisper */}
      <div className="w-full flex flex-col items-center pb-2 z-20">
        <RelationshipWhisper whisper={whisper} />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// 5. Timeline Stage (Temporal Spine & Focused Milestone)
// ---------------------------------------------------------------------------

function TimelineStage({ context }: { context: TimelineContext }) {
  const { focus, inspect } = useExploration()
  const { entity, projects } = context
  const [hoveredEntityId, setHoveredEntityId] = useState<string | null>(null)
  const [whisper, setWhisper] = useState<HoverWhisperInfo | null>(null)

  const handleEntityHover = useCallback(
    (id: string | null) => {
      setHoveredEntityId(id)
      setEnvironmentHover(id)
      if (id) {
        setWhisper(resolveEntityProvenance(id, context))
      } else {
        setWhisper(null)
      }
    },
    [context]
  )

  const launchedProject = projects[0]

  return (
    <div className="w-full min-h-[calc(100vh-5rem)] flex flex-col justify-between p-6 sm:p-10 lg:p-12 animate-stage relative select-text">
      {/* Top Header Row: Reserved Origin Zone on Left, Type Badge on Right */}
      <div className="w-full flex items-center justify-between z-20">
        <SpatialMemory />
        <div className="text-xs font-mono uppercase tracking-widest text-accent-primary font-semibold">
          <span>Temporal Milestone</span>
          <span className="text-fg-subtle mx-2">·</span>
          <span>{entity.date}</span>
        </div>
      </div>

      {/* Main Temporal Stage */}
      <div className="w-full max-w-4xl mx-auto my-auto relative flex flex-col items-center py-6">
        {/* Clean Temporal Line Spine: 2025 ───────── 2026 (Focused) ───────── 2026 NODE */}
        <div className="flex items-center gap-4 sm:gap-8 text-xs font-mono text-fg-muted mb-8 select-none">
          <button
            type="button"
            onClick={() => focus('timeline:2025-06-foundations')}
            className="hover:text-accent-primary transition-colors cursor-pointer"
          >
            2025 Foundations
          </button>
          <span className="w-10 sm:w-16 h-px bg-border-strong" />
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-subtle/40 border border-accent-primary/30 text-accent-primary font-bold">
            <span className="w-2 h-2 rounded-full bg-accent-primary" />
            <span>{entity.date}</span>
          </div>
          <span className="w-10 sm:w-16 h-px bg-border-strong" />
          <button
            type="button"
            onClick={() => focus('timeline:2026-08-node')}
            className="hover:text-accent-primary transition-colors cursor-pointer"
          >
            2026 NODE
          </button>
        </div>

        {/* Center: Focused Milestone Title & Details */}
        <div className="text-center space-y-4 max-w-lg mx-auto">
          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight text-fg-primary leading-tight">
            {entity.name}
          </h1>

          <p className="text-sm sm:text-base text-fg-secondary font-sans leading-relaxed">
            {entity.summary}
          </p>
        </div>

        {/* Associated Project Launched at this Milestone */}
        {launchedProject && (
          <div className="mt-8">
            <SatelliteNode
              id={launchedProject.id}
              name={launchedProject.name}
              subtitle={`Launched at ${entity.date}`}
              isHovered={hoveredEntityId === launchedProject.id}
              isDimmed={hoveredEntityId !== null && hoveredEntityId !== launchedProject.id}
              onFocus={() => focus(launchedProject.id)}
              onInspect={() => inspect(launchedProject.id)}
              onHoverStart={() => handleEntityHover(launchedProject.id)}
              onHoverEnd={() => handleEntityHover(null)}
            />
          </div>
        )}
      </div>

      {/* Bottom Bar: Relationship Whisper */}
      <div className="w-full flex flex-col items-center pb-2 z-20">
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

