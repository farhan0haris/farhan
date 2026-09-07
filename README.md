# Farhan

An interactive portfolio built as an exploration experience rather than a collection of static pages.

Instead of moving through a traditional structure such as:

```text
Home → About → Skills → Projects → Contact
```

visitors can explore connected portfolio information through context, relationships, and interaction.

A project can lead to the technologies used to build it. A technology can lead to other projects. Skills and milestones can reveal additional connections.

The portfolio is designed to be explored.

---

## The Idea

The portfolio treats its content as a connected system.

```text
Projects
    │
    ├── Technologies
    │       │
    │       └── Other Projects
    │
    ├── Skills
    │
    └── Timeline
```

The interface changes based on what the visitor is currently exploring.

The goal is not to gamify a portfolio or create a visual gimmick.

The goal is to create a more natural way to explore connected information.

---

## Interaction Model

The core interaction system is based on:

```text
EXPLORE

FOCUS

INSPECT

RELATE

NAVIGATE
```

Visitors can interact directly through the interface or use a command-driven interaction layer.

For example:

```text
Explore Projects

Focus Project

Inspect Technology

Navigate Back
```

The same underlying interaction concepts are intended to support a future command-line interface.

---

## Web First

The current implementation target is the web application.

The web experience will support:

* Direct interaction
* Contextual exploration
* Entity relationships
* Exploration history
* Keyboard interaction
* Command palette
* Light and dark themes
* Responsive layouts

The project intentionally does not use:

* 3D environments
* WebGL
* Fake terminal interfaces
* Node-based navigation graphs
* Generic portfolio templates

---

## Future CLI

The long-term direction includes a real command-line interface.

Conceptually:

```bash
npx farhan
```

The CLI will provide another way to explore the same portfolio.

The web and CLI should eventually share the same core concepts:

* Portfolio data
* Entity types
* Relationships
* Commands
* Interaction actions

The CLI is a future phase and is not part of the initial implementation.

---

## Project Architecture

The portfolio separates its core responsibilities:

```text
Portfolio Data
      ↓
Entity Relationships
      ↓
Interaction Actions
      ↓
Exploration State
      ↓
Web Interface
      ↓
Command Layer
```

This separation allows the visual interface to evolve independently from the portfolio's underlying data and interaction logic.

---

## Documentation

Detailed project documentation is available in the `docs` directory.

| Document          | Purpose                                                 |
| ----------------- | ------------------------------------------------------- |
| `VISION.md`       | Defines what the portfolio is and what it should become |
| `EXPERIENCE.md`   | Defines the visitor experience and exploration model    |
| `DESIGN.md`       | Defines the visual direction and design principles      |
| `INTERACTIONS.md` | Defines the interaction system and state changes        |
| `ARCHITECTURE.md` | Defines the technical architecture                      |
| `ROADMAP.md`      | Defines development phases and checkpoints              |
| `DECISIONS.md`    | Records important project and architecture decisions    |

---

## Development Status

```text
CURRENT PHASE

Planning and Documentation
```

Next phase:

```text
Application Foundation
```

The application will be developed incrementally.

Each major phase should produce a stable checkpoint before additional complexity is introduced.

---

## Development Principles

* Interaction before decoration
* Exploration over traditional navigation
* Context over repetition
* Structured data over duplicated content
* Relationships should be discoverable
* Core logic should remain independent from presentation
* Responsive design should adapt interactions
* Dependencies must provide meaningful value
* Build in stable, testable phases

---

## Project Direction

```text
NEW PORTFOLIO
      ↓
WEB APPLICATION
      ↓
STRUCTURED DATA
      ↓
CONNECTED ENTITIES
      ↓
INTERACTION ENGINE
      ↓
CONTEXTUAL EXPLORATION
      ↓
COMMAND LAYER
      ↓
RESPONSIVE EXPERIENCE
      ↓
FUTURE CLI
```

---

## Status

This project is currently in active development.
