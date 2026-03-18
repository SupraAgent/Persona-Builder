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

## Repo Structure

```
.
├── README.md                      # You are here
├── PROJECT_SETUP_PROCESS.md       # Step-by-step project bootstrapping guide
├── PERSONA_BUILDER_GUIDE.md       # How to create and use personas
├── templates/
│   └── persona_template.md        # Blank persona profile template
└── examples/
    └── learning-app-team/         # Example: iOS learning app team
        ├── team.md                # Team manifest and consultation guide
        ├── retention-lead-duolingo.md   # Example persona: CRO @ Duolingo
        └── ux-lead-headspace.md         # Example persona: Head of Design @ Headspace
```

## Quick Start

1. Read [PROJECT_SETUP_PROCESS.md](./PROJECT_SETUP_PROCESS.md) for the full project kickoff flow.
2. Copy `templates/persona_template.md` to create each persona.
3. Use personas from [supravibe.xyz](https://supravibe.xyz) templates or build new ones.
4. See `examples/learning-app-team/` for a complete team example.

## Integration with SupraVibe

Persona templates can be pulled from your [SupraVibe](https://supravibe.xyz) dashboard. Pre-built personas are reusable across projects — build once, deploy to any team that needs that expertise.
