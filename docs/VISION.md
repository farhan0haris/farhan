# Farhan — Interactive Portfolio

## Vision

This project is an interactive personal portfolio designed as an experience rather than a collection of static web pages.

The portfolio should allow visitors to explore Farhan Haris's work, skills, technologies, learning journey, and development progression through interaction, context, and discovery.

The objective is not to make the portfolio look like a game. The objective is to apply useful game and software interaction principles to portfolio exploration.

The experience should feel dynamic, responsive, and intentional.

A visitor should not simply move through:

> Home → About → Skills → Projects → Contact

Instead, they should be able to start from an area of interest and explore related information naturally.

For example:

> Project → Technology → Related Skills → Other Projects → Timeline

or:

> Skill → Technologies → Projects → Development Progression

The portfolio should adapt its presentation based on what the visitor is currently exploring.

---

## Core Idea

The portfolio is an **interactive exploration system**.

Its information is represented as connected entities:

* Profile
* Projects
* Skills
* Technologies
* Timeline and milestones

The relationships between these entities are part of the portfolio itself.

The interface uses those relationships to provide contextual exploration rather than relying only on traditional navigation and static pages.

---

## Interaction Philosophy

Interaction must have a purpose.

The project should not add animations, effects, or mechanics merely to make the interface appear advanced.

Every major interaction should help the visitor do at least one of the following:

* Explore information
* Discover relationships
* Change context
* Focus on something
* Navigate through previous exploration
* Access information more efficiently

The portfolio should reward curiosity without requiring the visitor to learn complicated controls.

---

## Web First

The first implementation is the web experience.

The web application should support multiple natural ways of interacting with the portfolio:

* Mouse and touch interaction
* Keyboard interaction
* Contextual navigation
* Exploration history
* Command palette

The command palette is part of the interaction model and not merely a search feature.

It should allow users to perform actions such as:

```text
projects
skills
timeline
profile
open <entity>
focus <entity>
back
forward
home
help
```

Commands must affect the real portfolio state.

For example, `focus react` should focus the React entity and update the visual experience around that context.

---

## Future CLI

A future phase of the project will introduce a real command-line interface.

The intended experience is conceptually similar to:

```bash
npx farhan
```

The CLI will allow users to explore the portfolio directly from their terminal.

The web and CLI must eventually represent the same portfolio rather than becoming two unrelated implementations.

This means the project should be designed around reusable concepts:

* Structured portfolio data
* Entity relationships
* Shared actions
* Command definitions
* Interaction state

The web is the first interface built on top of this system.

The CLI is a future interface built on the same underlying concepts.

---

## What This Project Is Not

This project must not become a traditional portfolio with a few interactive effects added.

It must also avoid becoming any of the following:

* A generic scrolling portfolio
* A card-heavy SaaS dashboard
* A fake operating system
* A hacker terminal website
* A terminal-themed portfolio
* A 3D world
* A walking simulator
* A node-based navigation map
* A decorative technology demonstration with little portfolio value
* An interface overloaded with animations
* A collection of unrelated visual effects

The previous 3D portfolio approach is intentionally abandoned.

No 3D scenes, WebGL worlds, characters, or game environments are part of this project's direction.

---

## Design Principles

### 1. Exploration over navigation

Visitors should explore connected information rather than only moving between fixed pages.

### 2. Context over repetition

The interface should understand what the visitor is currently investigating and present relevant information around it.

### 3. Interaction over decoration

Interactive behavior must serve the experience.

### 4. Complexity with clarity

The underlying system can be sophisticated without making the interface difficult to understand.

### 5. Progressive discovery

The portfolio should reveal depth naturally as visitors explore.

A visitor should be able to understand the basics immediately while discovering more through interaction.

### 6. Two interfaces, one portfolio

The web and future CLI should eventually expose the same portfolio system through different interaction models.

---

## Success Criteria

The project succeeds if it achieves the following:

* It feels meaningfully different from a traditional portfolio.
* Visitors can explore information in more than one way.
* Projects, skills, technologies, and milestones feel connected.
* The interface changes meaningfully based on context.
* Interaction improves understanding rather than distracting from content.
* The web experience works naturally on desktop and mobile.
* The command layer is functional and connected to the real application state.
* The architecture can later support a real CLI experience.
* The project demonstrates both design thinking and technical architecture.

---

## Long-Term Goal

The final project should demonstrate more than Farhan Haris's projects.

It should itself be a project worth exploring.

The portfolio should function as evidence of:

* Frontend development ability
* Application architecture
* Interaction design
* State management
* Information modeling
* Command-driven interfaces
* Product thinking

The experience should make the visitor curious enough to continue exploring.
