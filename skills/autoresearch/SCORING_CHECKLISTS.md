# Scoring Checklists for Autoresearch

> Pre-built yes/no checklists for each skill in the ecosystem. Use these as starting points — customize for your specific project.

---

## Persona Builder Skills

### Write a Persona (`skills/write-a-persona/SKILL.md`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Is the primary domain specific enough that you could NOT swap it for another persona's domain? | Generic domains like "Design" or "Engineering" |
| 2 | Does every core belief include a concrete rationale (not just the belief statement)? | Vague beliefs like "Good design matters" |
| 3 | Are all consultation triggers phrased as conditions ("When X happens") rather than vague categories? | Triggers like "design stuff" or "when needed" |
| 4 | Does the success metrics table have at least 3 rows with specific numeric targets AND timeframes? | Missing or vague metrics without numbers |
| 5 | Is the consultation prompt a complete, copy-pasteable block with beliefs, optimization target, and anti-patterns embedded? | Incomplete prompts with [PLACEHOLDER] text |
| 6 | Is the file between 120-180 lines? | Too thin (useless) or too bloated (unreadable) |

### Phase 0 Project Brief (`skills/phase-0-brief/SKILL.md`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does the brief name a specific target user (not "users" or "people")? | Vague audience like "anyone who wants to..." |
| 2 | Does the problem statement describe a pain the user has TODAY (not a feature description)? | "Users need a dashboard" vs "Founders waste 3hrs/week building reports manually" |
| 3 | Are at least 3 comparable products listed with what they get right AND wrong? | Missing competitive context |
| 4 | Does the brief include at least one measurable success metric? | No way to know if the project succeeded |

### Phase 4 Pre-Launch Checklist (`skills/phase-4-prelaunch/SKILL.md`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does every checklist item have a pass/fail verification method (not just "check X")? | Unverifiable checklist items |
| 2 | Is at least one real-user test scenario described (not just automated tests)? | Shipping without user validation |
| 3 | Does the GTM section name a specific launch channel with a concrete first action? | "We'll do marketing" with no specifics |

---

## Launch Kit Skills

### Generated CLAUDE.md (`src/lib/launch-kit-v2.ts:generateClaudeMd`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does the CLAUDE.md include a tech stack section with specific packages/versions (not just "React")? | Vague stack references that don't constrain the agent |
| 2 | Does it include persona consultation rules with specific trigger conditions? | Generic "consult personas" without actionable triggers |
| 3 | Does the build roadmap break features into phases with no more than 5 items per phase? | Overloaded phases that don't guide incremental delivery |
| 4 | Is the north star metric specific and measurable (includes a number and timeframe)? | Vague goals like "grow the user base" |
| 5 | Does the orchestrator config section specify concrete values (model, concurrency, consensus threshold)? | Missing operational config that leaves agents guessing |

### Generated Launch Plan (`src/lib/launch-kit.ts:generatePlan`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does each build phase have a clear deliverable (not just a list of tasks)? | Phases that end without a shippable artifact |
| 2 | Does the plan include at least one validation step per phase (test, review, or user check)? | Build-build-build with no feedback loops |
| 3 | Is the team section mapped to specific phases (who does what when)? | Roles listed without assignment to work |
| 4 | Are tech choices justified with at least one reason each? | Stack decisions without rationale |

---

## VibeCode Skills

### Generated CLAUDE.md (`src/lib/vibecode.ts:generateVibeCodeClaudeMd`)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does the CLAUDE.md include coding principles that are specific enough to settle a real debate? | Principles so generic they're useless ("write clean code") |
| 2 | Does the features list use verb phrases (Build X, Add Y, Implement Z) rather than noun phrases? | Feature descriptions that don't tell the agent what to do |
| 3 | If a persona team is included, does it specify which persona to consult for which feature? | Persona section that's just pasted in without routing |
| 4 | Is the framework section actionable (includes scaffold command or setup steps)? | Framework mentioned but no way to act on it |

### Vibe Style Quality (across all styles)

| # | Check | Catches |
|---|-------|---------|
| 1 | Does each principle rule OUT a specific alternative? (e.g., "Prefer X over Y") | Principles that don't constrain choices |
| 2 | Are there at most 5 principles? | Bloated principle lists that agents ignore |
| 3 | Could a developer use these principles to settle a disagreement without asking? | Principles too vague to be decisive |

---

## Cross-Product: Persona Consultation Output

Use this checklist when autoresearching the consultation prompt format itself.

| # | Check | Catches |
|---|-------|---------|
| 1 | Does the persona's response include a specific recommendation (not just analysis)? | "Here are some things to consider..." without a decision |
| 2 | Does the response state a confidence level (High/Medium/Low)? | Unweighted advice that can't feed into consensus |
| 3 | Does the response name at least one risk if the recommendation is ignored? | Advice without stakes |
| 4 | Does the response suggest a concrete compromise if the recommendation is rejected? | All-or-nothing positions that cause deadlocks |
| 5 | Is the response under 300 words? | Bloated responses that bury the recommendation |

---

## How to Write Your Own Checklist

1. **Run the skill 5 times.** Read all 5 outputs.
2. **Find the failures.** What's wrong with the bad ones? Be specific.
3. **Turn each failure into a yes/no question.** "Does X?" or "Is X?"
4. **Test the question.** Can someone else read the output and answer the same way you would?
5. **Keep 3-6 questions.** If you need more, your skill is trying to do too much — split it.

### Good vs. Bad Checklist Questions

| Bad (subjective/vague) | Good (specific/verifiable) |
|------------------------|---------------------------|
| "Is the output high quality?" | "Does the output include a specific numeric metric?" |
| "Is the tone professional?" | "Is the output free of exclamation marks and ALL CAPS?" |
| "Does it cover everything?" | "Does the output address all 5 required sections from the template?" |
| "Is it creative?" | "Does the output include at least one analogy or concrete example?" |
