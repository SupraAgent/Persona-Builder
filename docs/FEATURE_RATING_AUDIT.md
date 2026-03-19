# Feature Rating Audit

> **Date:** 2026-03-19
> **Scope:** All builders, tools, and utilities in the Persona Builder platform
> **Scale:** 1–100 (higher is better)

---

## Rating Categories

| # | Category | Description |
|---|----------|-------------|
| 1 | **Ease of Use** | How intuitive is the flow? Can a new user complete it without confusion? |
| 2 | **Functionality** | Breadth and depth of features — what can it actually do? |
| 3 | **Overall Best Result** | Quality of the final output (prompts, exports, files) when used well |
| 4 | **Uniqueness** | Does it offer something no other builder in the platform does? |
| 5 | **Not Redundant** | High = fills a unique gap; Low = overlaps heavily with other builders |
| 6 | **Output Versatility** | Number and quality of export formats (JSON, Markdown, clipboard, DB save) |
| 7 | **Integration** | How well does it connect with other platform features (library, API, other builders)? |
| 8 | **Scalability** | Can it handle complex/large inputs and still produce coherent results? |

---

## Rating Table

| Builder | Ease of Use | Functionality | Best Result | Uniqueness | Not Redundant | Output Versatility | Integration | Scalability | **AVG** |
|---------|:-----------:|:-------------:|:-----------:|:----------:|:--------------:|:------------------:|:-----------:|:-----------:|:-------:|
| **Expert Persona** | 92 | 82 | 90 | 70 | 55 | 88 | 85 | 65 | **78.4** |
| **Agent Builder** | 78 | 85 | 82 | 75 | 50 | 72 | 80 | 70 | **74.0** |
| **Unified Builder** | 80 | 92 | 88 | 60 | 40 | 90 | 85 | 75 | **76.3** |
| **Persona Studio** | 85 | 88 | 92 | 90 | 85 | 82 | 78 | 80 | **85.0** |
| **Team Builder** | 82 | 86 | 85 | 80 | 78 | 70 | 75 | 82 | **79.8** |
| **Launch Kit v1** | 65 | 95 | 90 | 85 | 80 | 95 | 90 | 70 | **83.8** |
| **Launch Kit v2** | 90 | 60 | 72 | 70 | 65 | 55 | 80 | 60 | **69.0** |
| **VibeCode** | 95 | 65 | 78 | 92 | 95 | 70 | 65 | 55 | **76.9** |
| **Auto-Research** | 70 | 90 | 88 | 95 | 95 | 60 | 82 | 75 | **81.9** |

---

## Detailed Breakdown

### 1. Expert Persona (`/expert`) — AVG: 78.4

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 92 | Clean 4-step wizard, rich suggestion lists, minimal friction |
| Functionality | 82 | 28 fields across identity/expertise/mindset/output — thorough but persona-only |
| Best Result | 90 | Produces detailed, high-quality system prompts with intelligent inference |
| Uniqueness | 70 | Core persona builder — foundational but other builders replicate its fields |
| Not Redundant | 55 | Unified Builder contains all Expert fields + more; Agent Builder covers similar ground |
| Output Versatility | 88 | JSON, Markdown, clipboard copy, Supabase save — 4 export paths |
| Integration | 85 | Saves to library, API-backed, used as reference by Launch Kit team step |
| Scalability | 65 | Single-persona only; no batch or team workflows |

**Verdict:** The gold standard for individual persona quality. Loses points because the Unified Builder supersedes it feature-for-feature.

---

### 2. Agent Builder (`/agent`) — AVG: 74.0

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 78 | 9 steps is the longest wizard — requires more commitment |
| Functionality | 85 | LLM provider/model selection, communication styles, skills, north star generation |
| Best Result | 82 | Good agent configs but north star auto-generation is template-based, not AI-driven |
| Uniqueness | 75 | Only builder with explicit LLM provider/model picking and visibility control |
| Not Redundant | 50 | Heavily overlapped by Unified Builder which adds all expert fields on top |
| Output Versatility | 72 | JSON export + Supabase save — fewer options than Expert |
| Integration | 80 | Saves to library, shares API with all builders |
| Scalability | 70 | Single-agent focus; blockchain skills suggest niche use case |

**Verdict:** Good agent-specific features (LLM selection, skills) but the 9-step flow is heavy, and Unified Builder makes it largely redundant.

---

### 3. Unified Builder (`/unified`) — AVG: 76.3

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 80 | 6 steps — balanced length, but combines two mental models (expert + agent) |
| Functionality | 92 | Most comprehensive single-persona builder — all expert fields + all agent fields |
| Best Result | 88 | Best individual output since it captures the most dimensions |
| Uniqueness | 60 | By design it's a merger, not a novel concept |
| Not Redundant | 40 | Makes both Expert and Agent builders redundant — but itself is the redundancy source |
| Output Versatility | 90 | JSON, Markdown, clipboard, Supabase — full export suite |
| Integration | 85 | Same API integration, library save, team.md compatible |
| Scalability | 75 | Still single-persona, but richer data means more reuse potential |

**Verdict:** The most complete single-persona builder. If the platform were to consolidate, this would replace both Expert and Agent. Its existence creates the redundancy problem.

---

### 4. Persona Studio (`/studio`) — AVG: 85.0

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 85 | 4-step wizard with live prompt preview sidebar — clear and visual |
| Functionality | 88 | Team assembly + confidence voting + grill questions + consensus config |
| Best Result | 92 | Grill step forces quality thinking; produces battle-tested personas |
| Uniqueness | 90 | Only builder with the "grill" interrogation step — unique validation mechanic |
| Not Redundant | 85 | Grill + confidence levels + live prompt editing are exclusive to Studio |
| Output Versatility | 82 | Per-persona Markdown, clipboard, batch Supabase save |
| Integration | 78 | Saves to library; consensus protocol aligns with CONSENSUS_PROTOCOL.md |
| Scalability | 80 | Handles multi-persona teams natively; grill scales per persona |

**Verdict:** The strongest all-around builder. The grill step is a killer differentiator that forces users to stress-test their personas before export. Best suited for serious team assembly.

---

### 5. Team Builder (`/builder-v2`) — AVG: 79.8

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 82 | 4 steps with quick-start templates (3/5/7 member presets) — fast onboarding |
| Functionality | 86 | Phase authority, conflict modeling, consensus threshold, CEO tiebreaker |
| Best Result | 85 | Generates complete team.md with orchestration rules — production-ready output |
| Uniqueness | 80 | Only builder with phase authority assignments and conflict modeling |
| Not Redundant | 78 | Phase dynamics and conflict tracking don't exist elsewhere |
| Output Versatility | 70 | Generates team.md (Markdown) + clipboard — no JSON or DB save |
| Integration | 75 | Outputs team.md for use in CLAUDE.md and project setup; no direct API save |
| Scalability | 82 | Designed for teams of 3-7+; template presets scale well |

**Verdict:** Excellent for team orchestration and dynamics modeling. The phase authority system is unique and valuable. Weaker on export options compared to others.

---

### 6. Launch Kit v1 (`/launch-kit`) — AVG: 83.8

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 65 | 8 steps is a significant commitment — powerful but lengthy |
| Functionality | 95 | End-to-end: brief → team → consensus → grill → stack → roadmap → whitepaper → export |
| Best Result | 90 | Produces a complete project foundation: whitepaper, team, roadmap, tech stack |
| Uniqueness | 85 | Only tool that generates a full whitepaper and multi-phase roadmap |
| Not Redundant | 80 | Whitepaper, tech stack selection, and roadmap planning are exclusive |
| Output Versatility | 95 | 6 separate Markdown exports + persona creation API + whitepaper download |
| Integration | 90 | Creates personas via API, tech stack feeds into VibeCode, roadmap feeds development |
| Scalability | 70 | Handles full projects but 8-step flow can feel heavy for small projects |

**Verdict:** The most comprehensive tool in the platform. Does everything from project definition to team assembly to technical planning. The 8-step length is its only real weakness.

---

### 7. Launch Kit v2 (`/launch-v2`) — AVG: 69.0

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 90 | Only 3 steps — brief → orchestrator → CLAUDE.md. Very fast |
| Functionality | 60 | Skips team, consensus, grill, roadmap, whitepaper — a stripped-down subset |
| Best Result | 72 | Good CLAUDE.md output but missing the depth that makes v1 outputs strong |
| Uniqueness | 70 | Orchestrator config (concurrency, auto-consult toggles) is unique |
| Not Redundant | 65 | Orchestrator step is unique but brief step duplicates v1; CLAUDE.md could be a v1 export |
| Output Versatility | 55 | Single output: CLAUDE.md file — no persona creation, no whitepaper |
| Integration | 80 | VibeCode ready toggle, CLAUDE.md feeds directly into development workflow |
| Scalability | 60 | Limited — designed for quick setup, not complex projects |

**Verdict:** A speed-optimized subset of Launch Kit v1. The orchestrator config is valuable but could be a v1 add-on step rather than a separate tool. Most redundant builder in the platform.

---

### 8. VibeCode (`/vibecode`) — AVG: 76.9

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 95 | 3 dead-simple steps — pick framework, pick vibe, get output. Fastest builder |
| Functionality | 65 | Framework + style + features + optional team paste — focused but narrow |
| Best Result | 78 | Generates clean, opinionated CLAUDE.md files with scaffold commands |
| Uniqueness | 92 | Only builder focused on coding philosophy/vibe — "Move Fast" vs "Production Grade" |
| Not Redundant | 95 | Nothing else in the platform does project scaffolding with coding style |
| Output Versatility | 70 | CLAUDE.md download + scaffold command copy — two useful outputs |
| Integration | 65 | Can paste team.md from other builders; no API save |
| Scalability | 55 | Single-project, single-vibe — no multi-project or vibe-mixing support |

**Verdict:** Highly unique and extremely easy to use. Fills a gap no other tool touches. Limited scope keeps it focused — that's a feature, not a bug.

---

### 9. Auto-Research (`/consult`) — AVG: 81.9

| Category | Score | Rationale |
|----------|:-----:|-----------|
| Ease of Use | 70 | Two-tab interface with LLM backend config — requires understanding of scoring methodology |
| Functionality | 90 | Team scoring (5 metrics), gap analysis, consensus simulation, checklist scoring, improvement loops |
| Best Result | 88 | Produces actionable scorecards with specific improvement suggestions |
| Uniqueness | 95 | Only tool that evaluates and scores the outputs of other builders |
| Not Redundant | 95 | Completely distinct purpose — meta-evaluation, not creation |
| Output Versatility | 60 | Visual results in-app only — no export of scorecards |
| Integration | 82 | Scores outputs from all builders; 7 pre-built checklist targets |
| Scalability | 75 | Handles multi-persona teams; checklist system extensible to new skill targets |

**Verdict:** The most unique tool in the platform. Essential for quality control. The scoring methodology (Karpathy's autoresearch loops) is sophisticated and genuinely useful.

---

## Redundancy Analysis

### High Redundancy (Consolidation Recommended)

| Pair | Overlap | Recommendation |
|------|---------|----------------|
| Expert Persona ↔ Unified Builder | ~95% field overlap | **Retire Expert** — Unified has all its fields plus agent capabilities |
| Agent Builder ↔ Unified Builder | ~85% field overlap | **Retire Agent** — Unified covers agent fields plus expert depth |
| Launch Kit v1 ↔ Launch Kit v2 | ~40% step overlap | **Merge** — Add orchestrator step to v1 as optional Step 8.5 |

### Low Redundancy (Keep Separate)

| Tool | Why It's Unique |
|------|----------------|
| **Persona Studio** | Grill interrogation, confidence-weighted voting, live prompt editing |
| **Team Builder** | Phase authority, conflict modeling, team templates |
| **VibeCode** | Coding philosophy selection, scaffold commands, framework presets |
| **Auto-Research** | Meta-evaluation, checklist scoring, improvement loops |

---

## Rankings

### By Average Score
| Rank | Builder | AVG |
|:----:|---------|:---:|
| 1 | **Persona Studio** | 85.0 |
| 2 | **Launch Kit v1** | 83.8 |
| 3 | **Auto-Research** | 81.9 |
| 4 | **Team Builder** | 79.8 |
| 5 | **Expert Persona** | 78.4 |
| 6 | **VibeCode** | 76.9 |
| 7 | **Unified Builder** | 76.3 |
| 8 | **Agent Builder** | 74.0 |
| 9 | **Launch Kit v2** | 69.0 |

### By Category Winner
| Category | Winner | Score |
|----------|--------|:-----:|
| Ease of Use | VibeCode | 95 |
| Functionality | Launch Kit v1 | 95 |
| Best Result | Persona Studio | 92 |
| Uniqueness | Auto-Research | 95 |
| Not Redundant | VibeCode / Auto-Research | 95 |
| Output Versatility | Launch Kit v1 | 95 |
| Integration | Launch Kit v1 | 90 |
| Scalability | Team Builder | 82 |

---

## Recommendations

### Immediate Actions
1. **Consolidate persona builders**: Keep Unified Builder as the single-persona tool; retire Expert Persona and Agent Builder as standalone pages (or convert them to "presets" within Unified)
2. **Merge Launch Kits**: Add the orchestrator config step from v2 into v1 as an optional step
3. **Add export to Auto-Research**: Allow downloading scorecards as Markdown/JSON

### Keep & Invest
1. **Persona Studio** — Highest rated overall; the grill mechanic is a genuine differentiator
2. **Launch Kit v1** — Most comprehensive tool; add orchestrator from v2 and it's complete
3. **Auto-Research** — Most unique; add persistent score history and visual dashboards
4. **Team Builder** — Phase authority and conflict modeling are valuable; add API save
5. **VibeCode** — Unique niche; consider adding Auto-Research checklist validation inline

### Ideal Streamlined Platform (5 Tools)
| Tool | Purpose |
|------|---------|
| **Unified Builder** | Create individual personas (expert + agent combined) |
| **Persona Studio** | Assemble advisory teams with grill validation |
| **Launch Kit** (merged v1+v2) | Full project setup from brief to CLAUDE.md |
| **VibeCode** | Quick project scaffolding with coding philosophy |
| **Auto-Research** | Quality scoring and continuous improvement |
