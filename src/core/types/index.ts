export * from './entity'
export * from './profile'
export * from './project'
export * from './technology'
export * from './skill'
export * from './timeline'

import type { Profile } from './profile'
import type { Project } from './project'
import type { Technology } from './technology'
import type { Skill } from './skill'
import type { TimelineEntry } from './timeline'

/**
 * Discriminated union of all portfolio entities.
 */
export type Entity =
  | Profile
  | Project
  | Technology
  | Skill
  | TimelineEntry
