import type {
  Entity,
  EntityId,
  Profile,
  Project,
  Technology,
  Skill,
  TimelineEntry,
} from '../types'
import {
  getEntity,
  getFeaturedProjects,
  getProjects,
  getSkills,
  getTechnologies,
} from '../registry'
import {
  getTechnologiesForProject,
  getSkillsForProject,
  getTimelineForProject,
  getProjectsForTechnology,
  getProjectsForSkill,
  getProjectsForTimeline,
  getRelatedProjectsWithReasons,
  getRelatedSkillsForTechnology,
  getRelatedTechnologiesForSkill,
  getRelatedTechnologiesForTechnology,
  getEntityRelationships,
} from './queries'
import type {
  ContextualAction,
  ProfileContext,
  ProjectContext,
  ResolvedContext,
  SkillContext,
  TechnologyContext,
  TimelineContext,
} from './types'

// ---------------------------------------------------------------------------
// Contextual Action Builders
// ---------------------------------------------------------------------------

function buildProjectActions(
  project: Project,
  technologies: readonly Technology[],
  skills: readonly Skill[],
  timeline: readonly TimelineEntry[],
  relatedProjects: ReturnType<typeof getRelatedProjectsWithReasons>
): readonly ContextualAction[] {
  const actions: ContextualAction[] = []

  // External live link
  if (project.liveUrl) {
    actions.push({
      id: `open-live-${project.id}`,
      label: `Launch Live Application`,
      type: 'open-external',
      kind: 'direct',
      url: project.liveUrl,
    })
  }

  // External repo link
  if (project.repositoryUrl) {
    actions.push({
      id: `open-repo-${project.id}`,
      label: `View GitHub Repository`,
      type: 'open-external',
      kind: 'direct',
      url: project.repositoryUrl,
    })
  }

  // Focus technologies (Direct relationship)
  for (const tech of technologies) {
    actions.push({
      id: `focus-tech-${tech.id}`,
      label: `Explore technology: ${tech.name}`,
      type: 'focus-entity',
      kind: 'direct',
      targetId: tech.id,
    })
  }

  // Inspect skills (Direct relationship)
  for (const skill of skills) {
    actions.push({
      id: `inspect-skill-${skill.id}`,
      label: `Inspect skill: ${skill.name}`,
      type: 'inspect-entity',
      kind: 'direct',
      targetId: skill.id,
    })
  }

  // View timeline milestones (Direct relationship)
  for (const milestone of timeline) {
    actions.push({
      id: `view-milestone-${milestone.id}`,
      label: `View milestone: ${milestone.name}`,
      type: 'focus-entity',
      kind: 'direct',
      targetId: milestone.id,
    })
  }

  // Explore related projects (Derived relationship)
  for (const rel of relatedProjects) {
    actions.push({
      id: `focus-related-${rel.project.id}`,
      label: `Explore related: ${rel.project.name} (${rel.matchReason})`,
      type: 'focus-entity',
      kind: 'derived',
      targetId: rel.project.id,
    })
  }

  return actions
}

function buildTechnologyActions(
  tech: Technology,
  projects: readonly Project[],
  skills: readonly Skill[]
): readonly ContextualAction[] {
  const actions: ContextualAction[] = []

  // Projects using this tech (Direct reverse relationship)
  for (const project of projects) {
    actions.push({
      id: `focus-project-${project.id}`,
      label: `Explore project: ${project.name} (${tech.name})`,
      type: 'focus-entity',
      kind: 'reverse',
      targetId: project.id,
    })
  }

  // Skills co-occurring with this tech in projects (Co-occurrence)
  for (const skill of skills) {
    actions.push({
      id: `inspect-skill-${skill.id}`,
      label: `Inspect skill: ${skill.name}`,
      type: 'inspect-entity',
      kind: 'co-occurrence',
      targetId: skill.id,
    })
  }

  return actions
}

function buildSkillActions(
  skill: Skill,
  projects: readonly Project[],
  technologies: readonly Technology[]
): readonly ContextualAction[] {
  const actions: ContextualAction[] = []

  // Projects demonstrating this skill (Direct reverse relationship)
  for (const project of projects) {
    actions.push({
      id: `focus-project-${project.id}`,
      label: `Explore project: ${project.name} (${skill.name})`,
      type: 'focus-entity',
      kind: 'reverse',
      targetId: project.id,
    })
  }

  // Technologies co-occurring with this skill in projects (Co-occurrence)
  for (const tech of technologies) {
    actions.push({
      id: `inspect-tech-${tech.id}`,
      label: `Inspect technology: ${tech.name}`,
      type: 'inspect-entity',
      kind: 'co-occurrence',
      targetId: tech.id,
    })
  }

  return actions
}

function buildTimelineActions(
  entry: TimelineEntry,
  projects: readonly Project[]
): readonly ContextualAction[] {
  // Projects launched on milestone (Direct reverse relationship)
  return projects.map((proj) => ({
    id: `focus-project-${proj.id}`,
    label: `Explore project: ${proj.name} (${entry.name})`,
    type: 'focus-entity',
    kind: 'reverse' as const,
    targetId: proj.id,
  }))
}

function buildProfileActions(
  profile: Profile,
  featuredProjects: readonly Project[]
): readonly ContextualAction[] {
  const actions: ContextualAction[] = []

  for (const project of featuredProjects) {
    actions.push({
      id: `focus-featured-${project.id}`,
      label: `Explore featured: ${project.name}`,
      type: 'focus-entity',
      kind: 'direct',
      targetId: project.id,
    })
  }

  if (profile.links.github) {
    actions.push({
      id: `open-profile-github`,
      label: `GitHub Profile`,
      type: 'open-external',
      kind: 'direct',
      url: profile.links.github,
    })
  }

  if (profile.links.linkedin) {
    actions.push({
      id: `open-profile-linkedin`,
      label: `LinkedIn Profile`,
      type: 'open-external',
      kind: 'direct',
      url: profile.links.linkedin,
    })
  }

  return actions
}

// ---------------------------------------------------------------------------
// Context Resolver Function
// ---------------------------------------------------------------------------

/**
 * Resolves comprehensive contextual information and meaningful next actions
 * for any focused entity.
 *
 * Safe handling:
 * - If entity is invalid / unregistered: returns undefined.
 * - If entity has no relationships: returns empty collections safely without throwing.
 */
export function resolveContext(
  entityOrId: Entity | EntityId
): ResolvedContext | undefined {
  const entity = typeof entityOrId === 'string' ? getEntity(entityOrId) : entityOrId
  if (!entity) return undefined

  switch (entity.type) {
    case 'project': {
      const project = entity as Project
      const technologies = getTechnologiesForProject(project)
      const skills = getSkillsForProject(project)
      const timeline = getTimelineForProject(project)
      const relatedProjects = getRelatedProjectsWithReasons(project)
      const relationships = getEntityRelationships(project.id)
      const availableActions = buildProjectActions(
        project,
        technologies,
        skills,
        timeline,
        relatedProjects
      )

      const ctx: ProjectContext = {
        type: 'project',
        entity: project,
        technologies,
        skills,
        timeline,
        relatedProjects,
        relationships,
        availableActions,
      }
      return ctx
    }

    case 'technology': {
      const tech = entity as Technology
      const projects = getProjectsForTechnology(tech.id)
      const relatedSkills = getRelatedSkillsForTechnology(tech.id)
      const relatedTechnologies = getRelatedTechnologiesForTechnology(tech.id)
      const relationships = getEntityRelationships(tech.id)
      const availableActions = buildTechnologyActions(tech, projects, relatedSkills)

      const ctx: TechnologyContext = {
        type: 'technology',
        entity: tech,
        projects,
        relatedSkills,
        relatedTechnologies,
        relationships,
        availableActions,
      }
      return ctx
    }

    case 'skill': {
      const skill = entity as Skill
      const projects = getProjectsForSkill(skill.id)
      const relatedTechnologies = getRelatedTechnologiesForSkill(skill.id)
      const relationships = getEntityRelationships(skill.id)
      const availableActions = buildSkillActions(skill, projects, relatedTechnologies)

      const ctx: SkillContext = {
        type: 'skill',
        entity: skill,
        projects,
        relatedTechnologies,
        relationships,
        availableActions,
      }
      return ctx
    }

    case 'timeline': {
      const entry = entity as TimelineEntry
      const projects = getProjectsForTimeline(entry.id)
      const relationships = getEntityRelationships(entry.id)
      const availableActions = buildTimelineActions(entry, projects)

      const ctx: TimelineContext = {
        type: 'timeline',
        entity: entry,
        projects,
        relationships,
        availableActions,
      }
      return ctx
    }

    case 'profile': {
      const profile = entity as Profile
      const featuredProjects = getFeaturedProjects()
      const allProjects = getProjects()
      const coreSkills = getSkills()
      const primaryTechnologies = getTechnologies()
      const relationships = getEntityRelationships(profile.id)
      const availableActions = buildProfileActions(profile, featuredProjects)

      const ctx: ProfileContext = {
        type: 'profile',
        entity: profile,
        featuredProjects,
        allProjects,
        coreSkills,
        primaryTechnologies,
        relationships,
        availableActions,
      }
      return ctx
    }
  }
}
