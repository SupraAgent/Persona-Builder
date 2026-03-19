# Project Setup Process

> Agent-executable runbook for bootstrapping a new application from zero to development-ready.
> Follow each phase in order. Stop at every `>>> GATE` before proceeding.

---

## Phases

Each phase is a standalone skill file with detailed steps, `[ASK]`/`[AGENT]` markers, and gate conditions.

| Phase | Skill File | Goal |
|-------|-----------|------|
| **0: Project Brief** | [skills/phase-0-brief/SKILL.md](./skills/phase-0-brief/SKILL.md) | Understand what we're building |
| **1: Persona Team** | [skills/phase-1-personas/SKILL.md](./skills/phase-1-personas/SKILL.md) | Assemble experts BEFORE coding |
| **2: Tech Stack** | [skills/phase-2-stack/SKILL.md](./skills/phase-2-stack/SKILL.md) | Choose stack and set up infrastructure |
| **3: Development** | [skills/phase-3-development/SKILL.md](./skills/phase-3-development/SKILL.md) | Build features with persona consultation |
| **4: Pre-Launch** | [skills/phase-4-prelaunch/SKILL.md](./skills/phase-4-prelaunch/SKILL.md) | Verify readiness to ship |
| **5: Post-Launch** | [skills/phase-5-postlaunch/SKILL.md](./skills/phase-5-postlaunch/SKILL.md) | Monitor, iterate, evolve the team |

---

## Gate Summary

```
Phase 0 -> 1:  project-brief.md exists with all answers
Phase 1 -> 2:  Persona file for every role, team.md exists, user approved
Phase 2 -> 3:  Repo exists, stack deployable, auth + database configured
Phase 3 -> 4:  All MVP features functional, personas consulted, user approved
Phase 4 -> Launch:  Checklist passes, persona review done, GTM decided
Phase 5:  Ongoing -- weekly retros, metric tracking, team evolution
```

---

## Action Markers

| Marker | Meaning |
|--------|---------|
| `[ASK]` | Agent MUST ask the user this question and wait for a response. Do not guess. |
| `[AGENT]` | Agent handles this autonomously. Just do it and report the result. |
| `>>> GATE` | Hard stop. Verify all REQUIRED conditions and ASK the gate question before proceeding. |

---

## Autoresearch (Skill Self-Improvement)

Any skill in this framework can be auto-improved using the autoresearch method. The agent tests a skill in a loop, scores outputs against a yes/no checklist, makes one small change at a time, and keeps only what improves the score.

| Resource | Purpose |
|----------|---------|
| [skills/autoresearch/SKILL.md](./skills/autoresearch/SKILL.md) | The autoresearch skill — run this to optimize any other skill |
| [skills/autoresearch/SCORING_CHECKLISTS.md](./skills/autoresearch/SCORING_CHECKLISTS.md) | Pre-built checklists for every skill in the ecosystem |
| [docs/reference/autoresearch-guide.md](./docs/reference/autoresearch-guide.md) | Full guide: when to run, cross-product strategy, changelog value |

**When to run:** After writing a new skill, when a skill produces inconsistent quality, after model upgrades, or during Phase 5 weekly retros.

---

## Consensus Protocol

When multiple personas disagree, follow [CONSENSUS_PROTOCOL.md](./CONSENSUS_PROTOCOL.md):

- **>= 67% agreement** = consensus reached, proceed
- **Deadlock** = CEO Tiebreaker (weighted: user impact 30%, speed to learning 25%, reversibility 20%, risk 15%, alignment 10%)
- **Confidence weights:** High=1.0x, Medium=0.7x, Low=0.4x
- **Phase authority:** Current lead gets 1.5x bonus on close calls
- **User always has final override**
