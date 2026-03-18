# Persona Consensus & Dispute Resolution Protocol

> How personas reach decisions when they disagree. Every multi-persona consultation must follow this protocol.

---

## Why This Exists

Personas are designed to disagree. A Retention Lead optimizing for daily returns will clash with a UX Lead optimizing for simplicity. A Growth Lead pushing to ship fast will clash with a Product Lead pushing for quality. These tensions are valuable — they surface trade-offs that would otherwise be invisible.

But disagreement needs a resolution mechanism. Without one, the agent either picks a side arbitrarily or defers every conflict to the user, which defeats the purpose of having expert personas.

---

## The Protocol

### Step 1: Consult Relevant Personas

When a decision involves multiple domains, consult each relevant persona independently. Each persona produces:

- **Position** — what they recommend (1-3 sentences)
- **Confidence** — how strongly they feel (High / Medium / Low)
- **Risk if ignored** — what goes wrong if we don't follow their advice
- **Compromise they'd accept** — what they can live with if overruled

### Step 2: Check for Consensus

**Consensus = 2/3 majority or higher (≥ 67%)**

| Personas Consulted | Consensus Threshold | Resolution |
|-------------------|--------------------|-----------  |
| 2 personas agree | 2/2 (100%) | Proceed with the agreed approach |
| 2 personas disagree | 1/2 (50%) — **deadlock** | Escalate to CEO tiebreaker (Step 3) |
| 3 personas, 2 agree | 2/3 (67%) | Consensus reached — proceed with majority |
| 3 personas, all disagree | 0/3 (0%) — **deadlock** | Escalate to CEO tiebreaker (Step 3) |
| 4 personas, 3+ agree | 3/4 (75%) | Consensus reached — proceed with majority |
| 4 personas, 2-2 split | 2/4 (50%) — **deadlock** | Escalate to CEO tiebreaker (Step 3) |
| 5 personas, 3+ agree | 3/5 (60%) | Near-consensus — proceed but flag the dissent |
| 5 personas, no majority | — **deadlock** | Escalate to CEO tiebreaker (Step 3) |

**When consensus is reached:** proceed with the majority position. Document the dissenting view and its risk in a brief note so it can be revisited later.

**When deadlocked:** move to Step 3.

### Step 3: CEO Tiebreaker

When personas deadlock, invoke a **CEO Tiebreaker** persona. This is not a new team member — it's a temporary decision-making mode that weighs the competing positions from a founder/CEO perspective.

The CEO Tiebreaker evaluates using this framework:

```
CEO TIEBREAKER EVALUATION

DECISION: [The specific choice]
POSITIONS:
  - [Persona A]: [Their position] (Confidence: [H/M/L])
  - [Persona B]: [Their position] (Confidence: [H/M/L])

EVALUATION CRITERIA (weighted):
  1. User Impact (30%) — Which position serves the end user better right now?
  2. Speed to Learning (25%) — Which lets us test and learn faster?
  3. Reversibility (20%) — Which is easier to undo if we're wrong?
  4. Risk (15%) — Which has lower downside if it fails?
  5. Team Alignment (10%) — Which builds toward the product vision?

RULING: [Position chosen]
REASONING: [2-3 sentences — why this position wins on the weighted criteria]
MITIGATION: [How to address the losing position's concern]
REVISIT TRIGGER: [What would cause us to reconsider — e.g., "if D7 retention drops below 20%"]
```

### Step 4: Present to User (Deadlocks Only)

After the CEO Tiebreaker resolves a deadlock, present the result to the user:

> **Persona Conflict Resolved:**
>
> [Persona A] and [Persona B] disagreed on [decision].
> - [Persona A] recommended [X] because [reason].
> - [Persona B] recommended [Y] because [reason].
>
> **CEO Tiebreaker ruling:** [X/Y], because [reasoning].
> **Mitigation:** [How we're addressing the other side's concern].
>
> Do you agree with this resolution, or do you want to override it?

The user always has final say. The protocol reduces the number of decisions that need to reach the user, not eliminate user control.

---

## Confidence-Weighted Consensus

Not all votes are equal. A persona's confidence level affects their weight:

| Confidence | Weight | When to Use |
|-----------|--------|-------------|
| **High** | 1.0x | The decision falls squarely in their domain expertise |
| **Medium** | 0.7x | They have a relevant opinion but it's adjacent to their core |
| **Low** | 0.4x | They have a perspective but acknowledge they're not the expert here |

**Example:** 3 personas consulted on a UI animation decision:
- UX Lead: "Remove it" (High confidence → 1.0)
- Retention Lead: "Keep it, it's engaging" (Medium confidence → 0.7)
- Tech Architect: "Remove it, performance hit" (High confidence → 1.0)

Weighted vote: Remove (2.0) vs Keep (0.7) → **consensus to remove**, even though it's technically 2-vs-1 which would have passed anyway. The weighting matters more in closer calls.

---

## Phase-Aware Authority

The team lead shifts by project phase. When consensus is close (near the 67% threshold), the phase-priority persona gets a **1.5x authority bonus**:

| Phase | Authority Lead | Bonus Applied To |
|-------|---------------|-----------------|
| Pre-MVP (Phase 0-1) | Product Lead | Feature scope, prioritization decisions |
| Infrastructure (Phase 2) | Technical Architect | Stack, architecture, tooling decisions |
| Development (Phase 3) | UI/UX Lead + Retention Lead | Design, UX, engagement decisions |
| Pre-Launch (Phase 4) | Growth Lead + Retention Lead | GTM, positioning, launch decisions |
| Post-Launch (Phase 5) | Growth Lead | Acquisition, conversion, iteration decisions |

---

## Decision Log

Every resolved conflict (whether by consensus or tiebreaker) should be logged in the project. Add to `docs/decisions/` or to `team.md`:

```markdown
### Decision: [Short title]
- **Date:** [Date]
- **Phase:** [Current phase]
- **Personas consulted:** [Names]
- **Outcome:** [Consensus / CEO Tiebreaker]
- **Ruling:** [What was decided]
- **Dissent:** [Who disagreed and why]
- **Revisit trigger:** [What would reopen this decision]
```

---

## Quick Reference: Resolution Flow

```
Decision involves multiple personas?
  ↓
Consult each independently (Position, Confidence, Risk, Compromise)
  ↓
Calculate weighted consensus
  ↓
≥ 67% agreement? ──YES──→ Proceed. Log the decision. Note dissent.
  ↓ NO
Invoke CEO Tiebreaker (5 weighted criteria)
  ↓
Present ruling + mitigation to user
  ↓
User approves? ──YES──→ Proceed. Log the decision.
  ↓ NO
User overrides → follow user's direction. Log the override and reasoning.
```
