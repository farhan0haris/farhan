import type { BaseEntity } from './entity'

// ---------------------------------------------------------------------------
// Technology Category
// ---------------------------------------------------------------------------

export type TechnologyCategory =
  | 'language'
  | 'framework'
  | 'library'
  | 'database'
  | 'platform'
  | 'tool'

// ---------------------------------------------------------------------------
// Technology
// ---------------------------------------------------------------------------

export interface Technology extends BaseEntity {
  readonly type: 'technology'
  readonly category: TechnologyCategory
}
