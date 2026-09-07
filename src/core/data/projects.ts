import type { Project } from '../types/project'

/**
 * Public GitHub projects discovered from https://github.com/farhan0haris
 * that have a verified, publicly accessible live URL.
 *
 * Sourced strictly from verified repository code, README files, and repository metadata.
 *
 * Repositories excluded due to no verified live URL:
 * - prune: No verified live URL found (local SQLite prototype).
 * - farhan: In-progress portfolio repository, no production deployment yet.
 * - farhan0haris: Special GitHub profile README repository, not a software project.
 *
 * Featured strategy:
 * - Featured (true): Substantial architectures with advanced capabilities and live deployments (DeadCode, NODE, VaultX).
 * - All Projects (false): Additional meaningful public repositories with live deployments (AuraShelf, Letterly AI).
 */
export const projectsData: readonly Project[] = [
  {
    id: 'project:deadcode',
    type: 'project',
    name: 'DeadCode',
    summary:
      'A privacy-first Git time machine, repository memory stream, and AI codebase intelligence platform.',
    description:
      'DeadCode turns raw commit history into an interactive developer memory bank. It automatically synchronizes public and private GitHub repositories, discovers historic commits pushed on this exact day over past years ("On This Day" line-by-line diff inspector), performs static code analysis to audit code health for security vulnerabilities and bugs, auto-generates production-grade READMEs and architecture summaries, and renders a 52-week activity heatmap with unlocked developer habit trophies.',
    featured: true,
    category: 'developer-tool',
    repositoryUrl: 'https://github.com/farhan0haris/Deadcode',
    liveUrl: 'https://deadcode-six.vercel.app',
    technologyIds: [
      'technology:typescript',
      'technology:nextjs',
      'technology:react',
      'technology:tailwindcss',
      'technology:prisma',
      'technology:postgresql',
      'technology:git',
      'technology:github-api',
      'technology:vercel',
    ],
    skillIds: [
      'skill:fullstack-development',
      'skill:frontend-development',
      'skill:database-architecture',
      'skill:ai-integration',
      'skill:authentication-security',
    ],
    timelineIds: ['timeline:2026-08-deadcode'],
    tags: [
      'developer-tools',
      'git',
      'ai-codebase',
      'analytics',
      'nextjs',
      'prisma',
      'postgresql',
    ],
  },
  {
    id: 'project:node',
    type: 'project',
    name: 'NODE',
    summary:
      'The Living Digital Knowledge Archive combining an archival brutalist aesthetic with a 3D WebGL particle cosmos and interactive relationship graphs.',
    description:
      'NODE is a high-signal discovery engine and community-powered knowledge platform. It features an interactive 3D particle cosmos rendered with Three.js and React Three Fiber utilizing 8,500 to 20,000 instanced particles with zero-lag offscreen culling, a living knowledge graph network with multi-layered depth and SVG laser transmission pulses, a Rabbit Hole traversal engine tracing conceptual lineages, and curated sequenced study playlists across 8 thematic knowledge worlds.',
    featured: true,
    category: 'knowledge-platform',
    repositoryUrl: 'https://github.com/farhan0haris/NODE',
    liveUrl: 'https://node-one-kappa.vercel.app/',
    technologyIds: [
      'technology:typescript',
      'technology:react',
      'technology:nextjs',
      'technology:threejs',
      'technology:react-three-fiber',
      'technology:tailwindcss',
      'technology:prisma',
      'technology:postgresql',
      'technology:vercel',
    ],
    skillIds: [
      'skill:fullstack-development',
      'skill:frontend-development',
      'skill:creative-webgl-3d',
      'skill:database-architecture',
      'skill:information-architecture',
    ],
    timelineIds: ['timeline:2026-08-node'],
    tags: [
      'knowledge-graph',
      'webgl',
      'threejs',
      '3d',
      'rabbit-hole',
      'nextjs',
      'postgresql',
    ],
  },
  {
    id: 'project:vault-x',
    type: 'project',
    name: 'VaultX',
    summary:
      'A modern cybersecurity dashboard and password manager with Firebase cloud sync and hacker-inspired glassmorphism UI.',
    description:
      'VaultX is a password and credentials manager interface featuring seamless Google OAuth sign-in, real-time cloud data persistence with Firebase Firestore, dynamic vault management for credentials, secure notes, and credit cards, and fluid animations built with Framer Motion and Tailwind CSS. Supports deep dark and neutral light modes with cyberpunk emerald/indigo accents, instant search filtering, and custom user avatars via DiceBear API.',
    featured: true,
    category: 'web-application',
    repositoryUrl: 'https://github.com/farhan0haris/vault-x',
    liveUrl: 'https://vault-x-ennz.vercel.app/',
    technologyIds: [
      'technology:typescript',
      'technology:react',
      'technology:nextjs',
      'technology:tailwindcss',
      'technology:framer-motion',
      'technology:firebase-auth',
      'technology:firestore',
      'technology:vercel',
    ],
    skillIds: [
      'skill:frontend-development',
      'skill:fullstack-development',
      'skill:authentication-security',
    ],
    timelineIds: ['timeline:2026-08-vault-x'],
    tags: [
      'security',
      'password-manager',
      'firebase',
      'firestore',
      'framer-motion',
      'nextjs',
    ],
  },
  {
    id: 'project:aurashelf',
    type: 'project',
    name: 'AuraShelf',
    summary:
      'A minimal, aesthetic web application for tracking personal books and movies categorized by mood.',
    description:
      'AuraShelf lets users build and manage a personal media library categorized across 8 emotional moods (Calm, Happy, Romantic, Dark, Emotional, Exciting, Inspirational, Mysterious). Features an interactive 3D hero scene that responds to cursor movement, media filtering by type, genre, mood, rating, and favorites, local data storage in SQLite via better-sqlite3 with zero external cloud dependencies, and custom light/dark theme persistence.',
    featured: false,
    category: 'web-application',
    repositoryUrl: 'https://github.com/farhan0haris/Aurashelf',
    liveUrl: 'https://aurashelf.vercel.app',
    technologyIds: [
      'technology:typescript',
      'technology:react',
      'technology:nextjs',
      'technology:tailwindcss',
      'technology:sqlite',
      'technology:vercel',
    ],
    skillIds: [
      'skill:frontend-development',
      'skill:fullstack-development',
      'skill:creative-webgl-3d',
    ],
    timelineIds: ['timeline:2026-08-aurashelf'],
    tags: [
      'media-tracker',
      'books-movies',
      'mood-tracking',
      'sqlite',
      'nextjs',
      'minimal-ui',
    ],
  },
  {
    id: 'project:letterly-ai',
    type: 'project',
    name: 'Letterly AI',
    summary:
      'An AI-powered cover letter generator leveraging Groq AI with 100% client-side privacy and local resume parsing.',
    description:
      'Letterly AI generates personalized, role-tailored cover letters in seconds using Groq AI (Llama 3.3 70B). Features client-side PDF, DOCX, and TXT resume parsing directly within the browser, 6 adjustable writing tones (Professional, Formal, Friendly, Confident, Concise, Persuasive), formatted PDF and Word export, in-browser editing, local application history cached in localStorage, and high-readability light/dark themes without server-side database requirements.',
    featured: false,
    category: 'ai-application',
    repositoryUrl: 'https://github.com/farhan0haris/letterly-ai-',
    liveUrl: 'https://letterly-ai.vercel.app',
    technologyIds: [
      'technology:javascript',
      'technology:html',
      'technology:css',
      'technology:groq',
      'technology:vercel',
    ],
    skillIds: [
      'skill:frontend-development',
      'skill:ai-integration',
    ],
    timelineIds: ['timeline:2026-07-letterly'],
    tags: [
      'ai-generator',
      'groq-ai',
      'llama-3',
      'cover-letter',
      'resume-parser',
      'client-side',
    ],
  },
] as const
