import type { Technology } from '../types/technology'

/**
 * Technology entities derived from verifiable repository code and documentation evidence.
 * Stable identifier format: `technology:<slug>`
 */
export const technologiesData: readonly Technology[] = [
  // Languages
  {
    id: 'technology:typescript',
    type: 'technology',
    name: 'TypeScript',
    category: 'language',
    summary:
      'Typed superset of JavaScript providing static type definitions across modern full-stack web applications.',
  },
  {
    id: 'technology:javascript',
    type: 'technology',
    name: 'JavaScript',
    category: 'language',
    summary:
      'Core web programming language used for client-side scripting and modern web application logic.',
  },
  {
    id: 'technology:python',
    type: 'technology',
    name: 'Python',
    category: 'language',
    summary:
      'High-level programming language used for scripting, backend automation, and data workflows.',
  },
  {
    id: 'technology:html',
    type: 'technology',
    name: 'HTML5',
    category: 'language',
    summary:
      'Standard markup language for modern web browser document structure and semantic layout.',
  },
  {
    id: 'technology:css',
    type: 'technology',
    name: 'CSS3',
    category: 'language',
    summary:
      'Cascading style sheets for responsive presentation, animations, custom themes, and typography.',
  },
  {
    id: 'technology:sql',
    type: 'technology',
    name: 'SQL',
    category: 'language',
    summary:
      'Structured Query Language for relational database querying, schema definition, and data management.',
  },

  // Frameworks & Runtimes
  {
    id: 'technology:react',
    type: 'technology',
    name: 'React',
    category: 'framework',
    summary:
      'Component-driven declarative user interface library for building single-page and server-rendered web applications.',
  },
  {
    id: 'technology:nextjs',
    type: 'technology',
    name: 'Next.js',
    category: 'framework',
    summary:
      'Full-stack React framework featuring the App Router, server components, API routes, and optimized rendering.',
  },
  {
    id: 'technology:vite',
    type: 'technology',
    name: 'Vite',
    category: 'tool',
    summary:
      'Next-generation frontend tooling providing lightning-fast development server and optimized rollup production bundling.',
  },
  {
    id: 'technology:nodejs',
    type: 'technology',
    name: 'Node.js',
    category: 'platform',
    summary:
      'JavaScript runtime environment for executing server-side scripts, APIs, and build tooling.',
  },

  // Libraries & Graphics
  {
    id: 'technology:tailwindcss',
    type: 'technology',
    name: 'Tailwind CSS',
    category: 'library',
    summary:
      'Utility-first CSS framework for rapidly composing expressive, responsive, and maintainable user interfaces.',
  },
  {
    id: 'technology:threejs',
    type: 'technology',
    name: 'Three.js',
    category: 'library',
    summary:
      'Cross-browser 3D JavaScript graphics library utilizing WebGL for real-time hardware-accelerated rendering.',
  },
  {
    id: 'technology:react-three-fiber',
    type: 'technology',
    name: 'React Three Fiber',
    category: 'library',
    summary:
      'Declarative React reconciler for Three.js, enabling reusable 3D component scenes with reactive state.',
  },
  {
    id: 'technology:framer-motion',
    type: 'technology',
    name: 'Framer Motion',
    category: 'library',
    summary:
      'Production-ready animation and gesture library for React applications with spring physics and layout transitions.',
  },
  {
    id: 'technology:prisma',
    type: 'technology',
    name: 'Prisma ORM',
    category: 'tool',
    summary:
      'Next-generation TypeScript ORM providing type-safe database access, automated migrations, and schema modeling.',
  },
  {
    id: 'technology:groq',
    type: 'technology',
    name: 'Groq AI',
    category: 'platform',
    summary:
      'Ultra-fast inference platform executing large language models (e.g. Llama 3.3 70B) for text generation.',
  },

  // Databases & Backend Services
  {
    id: 'technology:postgresql',
    type: 'technology',
    name: 'PostgreSQL',
    category: 'database',
    summary:
      'Powerful open-source object-relational database system with advanced indexing, JSON support, and strong ACID guarantees.',
  },
  {
    id: 'technology:sqlite',
    type: 'technology',
    name: 'SQLite',
    category: 'database',
    summary:
      'Self-contained, serverless, zero-configuration embedded SQL database engine for reliable local and lightweight storage.',
  },
  {
    id: 'technology:firebase-auth',
    type: 'technology',
    name: 'Firebase Auth',
    category: 'platform',
    summary:
      'Identity management service providing drop-in authentication with OAuth providers such as Google Sign-In.',
  },
  {
    id: 'technology:firestore',
    type: 'technology',
    name: 'Cloud Firestore',
    category: 'database',
    summary:
      'NoSQL document database from Firebase offering real-time data synchronization and flexible cloud storage.',
  },

  // Developer Tooling & Platforms
  {
    id: 'technology:git',
    type: 'technology',
    name: 'Git',
    category: 'tool',
    summary:
      'Distributed version control system tracking codebase history, commit diffs, branches, and collaboration.',
  },
  {
    id: 'technology:github-api',
    type: 'technology',
    name: 'GitHub API & OAuth',
    category: 'platform',
    summary:
      'REST and GraphQL developer APIs providing access to repository data, commit logs, issue tracking, and OAuth security.',
  },
  {
    id: 'technology:vercel',
    type: 'technology',
    name: 'Vercel',
    category: 'platform',
    summary:
      'Frontend cloud platform delivering automated CI/CD deployments, edge network distribution, and serverless compute.',
  },
] as const
