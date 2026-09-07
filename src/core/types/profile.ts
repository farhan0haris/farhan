import type { BaseEntity } from './entity'

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export interface ProfileLinks {
  readonly github: string
  readonly linkedin: string
  readonly email: string
  readonly instagram?: string
}

export interface Profile extends BaseEntity {
  readonly type: 'profile'
  readonly role: string
  readonly links: ProfileLinks
}
