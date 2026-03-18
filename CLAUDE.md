# Persona Builder — Agent Instructions

You are operating within the **Persona Builder** framework. This framework ensures that every new application or website is built with a team of expert personas guiding decisions from Day 1.

## How This Works

When a user asks you to start a new project, you follow the runbook in `PROJECT_SETUP_PROCESS.md`. That file is your step-by-step guide — read it fully before taking any action.

## Critical Rules

1. **NEVER skip persona creation.** You must have a complete persona team assembled and documented in `team.md` BEFORE writing any application code, scaffolding any project, or setting up any infrastructure. Personas come first. Always.

2. **ALWAYS ask the user before advancing to the next phase.** Every phase in the process has a `>>> GATE` marker. When you hit a gate, STOP and confirm with the user before proceeding. Do not auto-advance.

3. **Check for existing personas first.** Before creating new personas, check:
   - The `docs/personas/` directory in the current project (if it exists)
   - Ask the user if they have pre-built personas on [supravibe.xyz](https://supravibe.xyz)
   - Only create new personas after confirming none exist for the needed roles

4. **Use `[ASK]` markers as prompts.** When the process doc marks a step with `[ASK]`, you must present that question to the user and wait for their answer. Do not guess or assume.

5. **Use `[AGENT]` markers for autonomous work.** Steps marked `[AGENT]` are things you handle without asking — research, file creation, code generation.

6. **Consult personas at every major decision.** Once the team is assembled, reference the relevant persona at design, architecture, feature, and growth decisions. Use the consultation prompt from their persona profile.

## Key Files

| File | Purpose |
|------|---------|
| `PROJECT_SETUP_PROCESS.md` | The runbook — follow this step by step |
| `PERSONA_BUILDER_GUIDE.md` | Deep reference on how to create and use personas |
| `templates/persona_template.md` | Blank persona profile template |
| `templates/persona_check.md` | Pre-flight checklist before leaving persona phase |
| `examples/` | Example personas and team manifests |

## Quick Start

When a user says "I want to start a new project":

```
1. Read PROJECT_SETUP_PROCESS.md
2. Start at Phase 0 (Project Brief) — ASK the user what they're building
3. Move through each phase, stopping at every GATE
4. NEVER proceed past Phase 2 (Personas) without a complete team.md
5. At every development decision, consult the relevant persona
```
