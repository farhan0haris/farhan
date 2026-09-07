import type { Skill } from '../types/skill'

/**
 * Demonstrated skills and areas of practice derived from actual repository implementations.
 * Represents demonstrated capabilities rather than subjective claims of mastery.
 * Stable identifier format: `skill:<slug>`
 */
export const skillsData: readonly Skill[] = [
  {
    id: 'skill:frontend-development',
    type: 'skill',
    name: 'Frontend Development',
    summary:
      'Designing and developing modern, responsive, and accessible user interfaces using React, Next.js, and CSS design systems.',
  },
  {
    id: 'skill:fullstack-development',
    type: 'skill',
    name: 'Full-Stack Development',
    summary:
      'Architecting end-to-end web applications uniting declarative client frontends with server runtime logic and database persistence.',
  },
  {
    id: 'skill:creative-webgl-3d',
    type: 'skill',
    name: 'Creative WebGL & 3D',
    summary:
      'Crafting real-time interactive 3D particle systems and GPU-accelerated canvas experiences with Three.js and React Three Fiber.',
  },
  {
    id: 'skill:database-architecture',
    type: 'skill',
    name: 'Database Architecture',
    summary:
      'Designing relational schemas, indexing strategies, and type-safe ORM migrations across PostgreSQL and SQLite databases.',
  },
  {
    id: 'skill:ai-integration',
    type: 'skill',
    name: 'AI & LLM Integration',
    summary:
      'Integrating large language model inference APIs and prompt workflows for codebase auditing, automated documentation, and generative tools.',
  },
  {
    id: 'skill:authentication-security',
    type: 'skill',
    name: 'Authentication & Security',
    summary:
      'Implementing OAuth authentication flows, secure credential storage, and client-side privacy-first architecture.',
  },
  {
    id: 'skill:information-architecture',
    type: 'skill',
    name: 'Information Architecture',
    summary:
      'Structuring relational knowledge graphs, traversal algorithms, and relevance decay scoring models for interactive data discovery.',
  },
] as const
