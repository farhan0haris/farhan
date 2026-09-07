/**
 * Core entity types for the portfolio exploration system.
 *
 * Every major piece of portfolio information is represented as an entity
 * with a stable identifier and a discriminated type.
 */

// ---------------------------------------------------------------------------
// Entity Type Discriminator
// ---------------------------------------------------------------------------

export type EntityType =
  | 'profile'
  | 'project'
  | 'technology'
  | 'skill'
  | 'timeline'

// ---------------------------------------------------------------------------
// Entity ID
// ---------------------------------------------------------------------------

/**
 * Branded string type for entity identifiers.
 *
 * Entity IDs follow the pattern: `type:slug`
 * Examples: `project:deadcode`, `technology:react`, `skill:frontend-development`
 */
export type EntityId = `${EntityType}:${string}`

// ---------------------------------------------------------------------------
// Base Entity
// ---------------------------------------------------------------------------

/**
 * Common fields shared by all portfolio entities.
 *
 * Specific entity types extend this base with additional fields.
 */
export interface BaseEntity {
  readonly id: EntityId
  readonly type: EntityType
  readonly name: string
  readonly summary: string
}
