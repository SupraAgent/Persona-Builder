# Persona Builder

A framework for assembling expert persona teams to guide application development from concept to launch.

---

## What Is This?

When building a new app or website, decisions are better when informed by domain expertise. Persona Builder lets you create detailed profiles of experts — modeled after real roles at real companies — and consult them throughout development.

Instead of asking *"how should we design onboarding?"*, you ask *"how would Duolingo's Chief Retention Officer design onboarding?"* — and get a specific, opinionated answer grounded in that company's proven approach.

## How It Works

1. **Define your project** using the [Project Setup Process](./PROJECT_SETUP_PROCESS.md)
2. **Assemble a persona team** using the [Persona Builder Guide](./PERSONA_BUILDER_GUIDE.md)
3. **Consult personas** at every major decision point during development

## Using with an AI Agent

Point your agent at this repo and it will auto-read `CLAUDE.md`, which directs it to follow the runbook in `PROJECT_SETUP_PROCESS.md`. The process uses three markers:

- `[ASK]` — the agent stops and asks you a question before proceeding
- `[AGENT]` — the agent handles this autonomously
- `>>> GATE` — hard checkpoint between phases; the agent must get your approval to continue

The agent will **always create personas before writing any code**. If personas don't exist yet, it will walk you through building them — suggesting companies to model after based on your project's comparable products.

## Repo Structure

```
.
├── CLAUDE.md                      # Agent entry point (read automatically)
├── PROJECT_SETUP_PROCESS.md       # Agent-executable runbook with gates
├── PERSONA_BUILDER_GUIDE.md       # Deep reference on persona creation
├── templates/
│   ├── persona_template.md        # Blank persona profile template
│   └── persona_check.md           # Pre-flight checklist for persona phase
└── examples/
    └── learning-app-team/         # Complete example: iOS learning app
        ├── team.md                # Team manifest with all 5 personas
        ├── retention-lead-duolingo.md
        ├── ux-lead-headspace.md
        ├── product-lead-khan-academy.md
        ├── growth-lead-calm.md
        └── tech-architect-anki.md
```

## Quick Start

**For agents:** Point the agent to this repo. It reads `CLAUDE.md` automatically and follows the runbook.

**For humans:**
1. Read [PROJECT_SETUP_PROCESS.md](./PROJECT_SETUP_PROCESS.md) for the full project kickoff flow.
2. Copy `templates/persona_template.md` to create each persona.
3. Use personas from [supravibe.xyz](https://supravibe.xyz) templates or build new ones.
4. See `examples/learning-app-team/` for a complete 5-persona team example.

## Integration with SupraVibe

Persona templates can be pulled from your [SupraVibe](https://supravibe.xyz) dashboard. Pre-built personas are reusable across projects — build once, deploy to any team that needs that expertise.
