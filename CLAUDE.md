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

7. **Follow the Consensus Protocol when personas disagree.** When consulting multiple personas and they give conflicting advice, follow `CONSENSUS_PROTOCOL.md`. Key rule: ≥67% agreement = proceed; deadlock = CEO tiebreaker; user always has final override.

8. **Continue through Post-Launch (Phase 5).** The process doesn't end at launch. Phase 5 runs weekly persona retros, tracks success metrics, and evolves the team as the product matures.

## Key Files

| File | Purpose |
|------|---------|
| `PROJECT_SETUP_PROCESS.md` | The runbook — index linking to per-phase skill files |
| `skills/` | Per-phase skill files (SKILL.md) for agent-executable phases |
| `skills/write-a-persona/` | Meta-skill for creating persona profiles with quality constraints |
| `PERSONA_BUILDER_GUIDE.md` | Quick-start guide on creating and using personas |
| `CONSENSUS_PROTOCOL.md` | How personas resolve disagreements (2/3 majority + CEO tiebreaker) |
| `skills/autoresearch/` | Auto-improve any skill via test-score-tweak loops (Karpathy's method) |
| `docs/reference/` | Detailed reference docs: creating, consulting, and quality-checking personas |
| `templates/persona_template.md` | Blank persona profile template (with YAML frontmatter) |
| `templates/persona_check.md` | Pre-flight checklist before leaving persona phase |
| `skills/design-system/` | Generate DESIGN.md — agent-readable design system from persona guidance |
| `skills/stitch-bridge/` | Connect personas to Google Stitch for AI-powered UI design & code export |
| `examples/` | Example teams: learning app, SaaS analytics, marketplace |

## Quick Start

When a user says "I want to start a new project":

```
1. Read PROJECT_SETUP_PROCESS.md and CONSENSUS_PROTOCOL.md
2. Start at Phase 0 (Project Brief) — ASK the user what they're building
3. Move through each phase, stopping at every GATE
4. NEVER proceed past Phase 1 (Personas) without a complete team.md
5. At every development decision, consult the relevant persona
6. When personas disagree, follow the Consensus Protocol (≥67% or CEO tiebreaker)
7. After launch, continue to Phase 5 — weekly retros, metric tracking, team evolution
```
