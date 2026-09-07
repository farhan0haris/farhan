import {
  profileData,
  projectsData,
  technologiesData,
  skillsData,
  timelineData,
} from './data'
import { getAllEntities } from './registry'

export interface ValidationIssue {
  readonly level: 'error' | 'warning'
  readonly message: string
  readonly entityId?: string
}

export interface ValidationResult {
  readonly valid: boolean
  readonly issues: readonly ValidationIssue[]
  readonly stats: {
    readonly totalEntities: number
    readonly projectCount: number
    readonly technologyCount: number
    readonly skillCount: number
    readonly timelineCount: number
  }
}

/**
 * Lightweight, zero-dependency validation for the canonical portfolio data layer.
 * Validates entity uniqueness, reference integrity, required fields, and live URLs.
 */
export function validatePortfolioData(): ValidationResult {
  const issues: ValidationIssue[] = []
  const allEntities = getAllEntities()

  // 1. Check entity ID uniqueness across entire registry
  const seenEntityIds = new Set<string>()
  for (const entity of allEntities) {
    if (seenEntityIds.has(entity.id)) {
      issues.push({
        level: 'error',
        message: `Duplicate entity ID detected: "${entity.id}"`,
        entityId: entity.id,
      })
    }
    seenEntityIds.add(entity.id)

    // Check ID pattern: type:slug
    const [prefix, slug] = entity.id.split(':')
    if (prefix !== entity.type || !slug || slug.trim() === '') {
      issues.push({
        level: 'error',
        message: `Entity ID "${entity.id}" does not conform to pattern "${entity.type}:<slug>"`,
        entityId: entity.id,
      })
    }
  }

  // 2. Build reference lookup sets
  const techIdSet = new Set(technologiesData.map((t) => t.id))
  const skillIdSet = new Set(skillsData.map((s) => s.id))
  const timelineIdSet = new Set(timelineData.map((m) => m.id))
  const projectIdSet = new Set(projectsData.map((p) => p.id))

  // 3. Validate Projects
  for (const project of projectsData) {
    // Check mandatory liveUrl
    if (!project.liveUrl || project.liveUrl.trim() === '') {
      issues.push({
        level: 'error',
        message: `Project "${project.name}" (${project.id}) is missing a verified liveUrl`,
        entityId: project.id,
      })
    }

    // Check mandatory repositoryUrl
    if (!project.repositoryUrl || project.repositoryUrl.trim() === '') {
      issues.push({
        level: 'error',
        message: `Project "${project.name}" (${project.id}) is missing repositoryUrl`,
        entityId: project.id,
      })
    }

    // Verify foreign keys: technologyIds
    for (const techId of project.technologyIds) {
      if (!techIdSet.has(techId)) {
        issues.push({
          level: 'error',
          message: `Project "${project.name}" (${project.id}) references non-existent technology "${techId}"`,
          entityId: project.id,
        })
      }
    }

    // Verify foreign keys: skillIds
    for (const skillId of project.skillIds) {
      if (!skillIdSet.has(skillId)) {
        issues.push({
          level: 'error',
          message: `Project "${project.name}" (${project.id}) references non-existent skill "${skillId}"`,
          entityId: project.id,
        })
      }
    }

    // Verify foreign keys: timelineIds
    for (const timelineId of project.timelineIds) {
      if (!timelineIdSet.has(timelineId)) {
        issues.push({
          level: 'error',
          message: `Project "${project.name}" (${project.id}) references non-existent timeline "${timelineId}"`,
          entityId: project.id,
        })
      }
    }
  }

  // 4. Validate Timeline reverse project references
  for (const entry of timelineData) {
    for (const pId of entry.projectIds) {
      if (!projectIdSet.has(pId)) {
        issues.push({
          level: 'error',
          message: `Timeline entry "${entry.name}" (${entry.id}) references non-existent project "${pId}"`,
          entityId: entry.id,
        })
      }
    }
  }

  // 5. Validate Profile links
  if (!profileData.links.github || !profileData.links.email || !profileData.links.linkedin) {
    issues.push({
      level: 'error',
      message: 'Profile entity is missing essential contact links (github, email, or linkedin)',
      entityId: profileData.id,
    })
  }

  const valid = issues.filter((i) => i.level === 'error').length === 0

  return {
    valid,
    issues,
    stats: {
      totalEntities: allEntities.length,
      projectCount: projectsData.length,
      technologyCount: technologiesData.length,
      skillCount: skillsData.length,
      timelineCount: timelineData.length,
    },
  }
}
