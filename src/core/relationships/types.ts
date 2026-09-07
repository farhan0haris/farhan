import type {
  EntityId,
  Profile,
  Project,
  Technology,
  Skill,
  TimelineEntry,
} from '../types'

// ---------------------------------------------------------------------------
// Relationship Semantics & Provenance
// ---------------------------------------------------------------------------

/**
 * Distinguishes the semantic provenance and strength of relationships:
 * - 'direct': Explicitly declared canonical relationship in author data (e.g. Project uses Technology).
 * - 'reverse': Exact 1-to-1 inversion of a canonical relationship (e.g. Technology used in Project).
 * - 'derived': Deterministic multi-factor overlap based on concrete evidence (e.g. Project shares stack with Project).
 * - 'co-occurrence': Associative presence across shared projects (e.g. Technology co-occurs with Technology/Skill).
 */
export type RelationshipKind =
  | 'direct'
  | 'reverse'
  | 'derived'
  | 'co-occurrence'

/**
 * Semantic classification of directed relationships between portfolio entities.
 */
export type RelationshipType =
  | 'uses-technology'
  | 'used-by-project'
  | 'demonstrates-skill'
  | 'demonstrated-in-project'
  | 'associated-with-timeline'
  | 'milestone-for-project'
  | 'shares-technology'
  | 'shares-skill'
  | 'co-occurs-with-technology'
  | 'co-occurs-with-skill'
  | 'featured-in-profile'

/**
 * Structured, metadata-rich relationship connecting two entities.
 * Includes explicit semantic provenance ('kind') so UI and CLI can distinguish
 * direct facts from associative co-occurrence without reverse-engineering.
 */
export interface EntityRelationship {
  readonly sourceId: EntityId
  readonly targetId: EntityId
  readonly type: RelationshipType
  readonly kind: RelationshipKind
  readonly description: string
  readonly sharedIds?: readonly EntityId[]
}

/**
 * Explains how and why a target project is related to the source project.
 */
export interface RelatedProject {
  readonly project: Project
  readonly sharedTechnologies: readonly Technology[]
  readonly sharedSkills: readonly Skill[]
  /**
   * Deterministic sorting rank based on the quantity of shared stack elements.
   * Used strictly for sorting relevance (most shared elements first);
   * NOT an objective measure of project quality or importance.
   */
  readonly matchScore: number
  readonly matchReason: string
}

// ---------------------------------------------------------------------------
// Contextual Actions
// ---------------------------------------------------------------------------

export type ContextualActionType =
  | 'focus-entity'
  | 'inspect-entity'
  | 'explore-entity'
  | 'open-external'

/**
 * A domain-level next action discovered dynamically from the current context.
 * Includes provenance ('kind') to allow UI to visually differentiate primary actions
 * from associative suggestions.
 */
export interface ContextualAction {
  readonly id: string
  readonly label: string
  readonly type: ContextualActionType
  readonly kind?: RelationshipKind
  readonly targetId?: EntityId
  readonly url?: string
}

// ---------------------------------------------------------------------------
// Resolved Context Models (Discriminated Union by entity type)
// ---------------------------------------------------------------------------

export interface ProjectContext {
  readonly type: 'project'
  readonly entity: Project
  readonly technologies: readonly Technology[]
  readonly skills: readonly Skill[]
  readonly timeline: readonly TimelineEntry[]
  readonly relatedProjects: readonly RelatedProject[]
  readonly relationships: readonly EntityRelationship[]
  readonly availableActions: readonly ContextualAction[]
}

export interface TechnologyContext {
  readonly type: 'technology'
  readonly entity: Technology
  /** Direct reverse relationships: projects that explicitly use this technology */
  readonly projects: readonly Project[]
  /** Associative: skills practiced in projects that use this technology */
  readonly relatedSkills: readonly Skill[]
  /** Associative: technologies co-occurring in projects that use this technology */
  readonly relatedTechnologies: readonly Technology[]
  readonly relationships: readonly EntityRelationship[]
  readonly availableActions: readonly ContextualAction[]
}

export interface SkillContext {
  readonly type: 'skill'
  readonly entity: Skill
  /** Direct reverse relationships: projects that explicitly demonstrate this skill */
  readonly projects: readonly Project[]
  /** Associative: technologies utilized in projects that demonstrate this skill */
  readonly relatedTechnologies: readonly Technology[]
  readonly relationships: readonly EntityRelationship[]
  readonly availableActions: readonly ContextualAction[]
}

export interface TimelineContext {
  readonly type: 'timeline'
  readonly entity: TimelineEntry
  /** Direct reverse relationships: projects created on this milestone */
  readonly projects: readonly Project[]
  readonly relationships: readonly EntityRelationship[]
  readonly availableActions: readonly ContextualAction[]
}

export interface ProfileContext {
  readonly type: 'profile'
  readonly entity: Profile
  readonly featuredProjects: readonly Project[]
  readonly allProjects: readonly Project[]
  readonly coreSkills: readonly Skill[]
  readonly primaryTechnologies: readonly Technology[]
  readonly relationships: readonly EntityRelationship[]
  readonly availableActions: readonly ContextualAction[]
}

/**
 * Discriminated union of all fully resolved exploration contexts.
 */
export type ResolvedContext =
  | ProjectContext
  | TechnologyContext
  | SkillContext
  | TimelineContext
  | ProfileContext
