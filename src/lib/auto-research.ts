/**
 * Auto-Research — Evaluate, score, and improve personas using LLM calls.
 *
 * Scoring Metrics (0-100 each):
 * - Relevance: How well does this persona's expertise match the project?
 * - Specificity: Is the persona specific (real company, methodology) vs generic?
 * - Coverage: Does the team collectively cover all critical areas?
 * - Differentiation: Does each persona have a unique perspective?
 * - Actionability: Can the persona's guidance drive real decisions?
 *
 * Also generates:
 * - Gap analysis (missing roles/expertise)
 * - Improvement suggestions per persona
 * - Consensus simulation (sample decision to reveal team dynamics)
 */

import type { LLMBackend } from "./llm-client";
import type { StudioPersona, ProjectContext } from "./studio";
import { generatePersonaPrompt } from "./studio";

// ---- Checklist-Based Scoring (Autoresearch Method) ----

export type ChecklistItem = {
  id: string;
  question: string;
  catches: string;
};

export type ChecklistResult = {
  itemId: string;
  question: string;
  passed: boolean;
};

export type ChecklistScorecard = {
  targetName: string;
  results: ChecklistResult[];
  score: number; // 0-100 percentage
  failedItems: string[];
};

export type SkillTarget = {
  id: string;
  label: string;
  description: string;
  checklist: ChecklistItem[];
};

/** Pre-built skill targets with checklists from SCORING_CHECKLISTS.md */
export const SKILL_TARGETS: SkillTarget[] = [
  {
    id: "write-persona",
    label: "Write a Persona",
    description: "Persona profile quality (domain, beliefs, triggers, metrics)",
    checklist: [
      { id: "wp1", question: "Is the primary domain specific enough that you could NOT swap it for another persona's domain?", catches: "Generic domains" },
      { id: "wp2", question: "Does every core belief include a concrete rationale (not just the belief statement)?", catches: "Vague beliefs" },
      { id: "wp3", question: "Are all consultation triggers phrased as conditions ('When X happens') rather than vague categories?", catches: "Vague triggers" },
      { id: "wp4", question: "Does the success metrics table have at least 3 rows with specific numeric targets AND timeframes?", catches: "Missing metrics" },
      { id: "wp5", question: "Is the consultation prompt a complete, copy-pasteable block with beliefs, optimization target, and anti-patterns embedded?", catches: "Incomplete prompts" },
      { id: "wp6", question: "Is the file between 120-180 lines?", catches: "Too thin or bloated" },
    ],
  },
  {
    id: "launch-claudemd",
    label: "Launch Kit CLAUDE.md",
    description: "Generated CLAUDE.md quality (stack, triggers, roadmap, north star)",
    checklist: [
      { id: "lc1", question: "Does the CLAUDE.md include a tech stack section with specific packages/versions (not just 'React')?", catches: "Vague stack" },
      { id: "lc2", question: "Does it include persona consultation rules with specific trigger conditions?", catches: "Generic consult rules" },
      { id: "lc3", question: "Does the build roadmap break features into phases with no more than 5 items per phase?", catches: "Overloaded phases" },
      { id: "lc4", question: "Is the north star metric specific and measurable (includes a number and timeframe)?", catches: "Vague goals" },
      { id: "lc5", question: "Does the orchestrator config section specify concrete values (model, concurrency, consensus threshold)?", catches: "Missing config" },
    ],
  },
  {
    id: "vibecode-claudemd",
    label: "VibeCode CLAUDE.md",
    description: "Generated VibeCode instructions quality",
    checklist: [
      { id: "vc1", question: "Does the CLAUDE.md include coding principles that are specific enough to settle a real debate?", catches: "Generic principles" },
      { id: "vc2", question: "Does the features list use verb phrases (Build X, Add Y, Implement Z) rather than noun phrases?", catches: "Noun features" },
      { id: "vc3", question: "If a persona team is included, does it specify which persona to consult for which feature?", catches: "No persona routing" },
      { id: "vc4", question: "Is the framework section actionable (includes scaffold command or setup steps)?", catches: "Non-actionable framework" },
    ],
  },
  {
    id: "consultation-output",
    label: "Persona Consultation Output",
    description: "Quality of persona responses during consultation",
    checklist: [
      { id: "co1", question: "Does the persona's response include a specific recommendation (not just analysis)?", catches: "Analysis without decision" },
      { id: "co2", question: "Does the response state a confidence level (High/Medium/Low)?", catches: "Unweighted advice" },
      { id: "co3", question: "Does the response name at least one risk if the recommendation is ignored?", catches: "No stakes" },
      { id: "co4", question: "Does the response suggest a concrete compromise if the recommendation is rejected?", catches: "All-or-nothing" },
      { id: "co5", question: "Is the response under 300 words?", catches: "Bloated responses" },
    ],
  },
  {
    id: "phase0-brief",
    label: "Phase 0 Project Brief",
    description: "Project brief quality (user, problem, metrics, comparables)",
    checklist: [
      { id: "pb1", question: "Does the brief name a specific target user (not 'users' or 'people')?", catches: "Vague audience" },
      { id: "pb2", question: "Does the problem statement describe a pain the user has TODAY (not a feature description)?", catches: "Feature-as-problem" },
      { id: "pb3", question: "Are at least 3 comparable products listed with what they get right AND wrong?", catches: "Missing competition" },
      { id: "pb4", question: "Does the brief include at least one measurable success metric?", catches: "No success criteria" },
    ],
  },
];

export type AutoresearchRound = {
  round: number;
  changeDescription: string;
  previousScore: number;
  newScore: number;
  kept: boolean;
  failedItems: string[];
};

export type AutoresearchLoopRequest = {
  backend: LLMBackend;
  model: string;
  skillTargetId: string;
  testInput: string;
  outputToScore: string;
  customChecklist?: ChecklistItem[];
};

export type AutoresearchLoopResult = {
  skillTargetId: string;
  score: number;
  results: ChecklistResult[];
  failedItems: string[];
  suggestedChange: string;
};

// ---- Checklist Prompt Builders ----

export function buildChecklistScoringPrompt(
  checklist: ChecklistItem[],
  outputToScore: string
): string {
  const checklistText = checklist
    .map((c, i) => `${i + 1}. ${c.question}`)
    .join("\n");

  return `You are a strict quality evaluator. Score this output against a yes/no checklist.

CHECKLIST:
${checklistText}

OUTPUT TO EVALUATE:
${outputToScore}

For EACH checklist item, answer YES or NO. Be strict — "close enough" is NO.

Respond in this exact JSON format (no markdown, no code fences):
{
  "results": [
    { "itemIndex": 0, "passed": true },
    { "itemIndex": 1, "passed": false }
  ]
}`;
}

export function buildImprovementPrompt(
  failedItems: ChecklistItem[],
  currentOutput: string
): string {
  const failures = failedItems
    .map((c, i) => `${i + 1}. FAILED: ${c.question} (catches: ${c.catches})`)
    .join("\n");

  return `You are a skill improvement agent. Analyze these checklist failures and suggest ONE specific change.

FAILED CHECKS:
${failures}

CURRENT OUTPUT (excerpt, first 500 chars):
${currentOutput.slice(0, 500)}

Suggest ONE small, specific change to the prompt/skill that would fix the most-failed check.

Rules:
- ONE change only (multiple changes make it impossible to know what helped)
- Be specific (e.g., "Add rule: Primary domain MUST include the company name" not "Make it more specific")
- Target the most-failed item first

Respond in this exact JSON format (no markdown, no code fences):
{
  "targetCheck": "<which check this change addresses>",
  "change": "<the specific change to make>",
  "rationale": "<why this should help>"
}`;
}

export function parseChecklistResponse(
  raw: string,
  checklist: ChecklistItem[]
): ChecklistResult[] {
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    return (data.results || []).map((r: { itemIndex: number; passed: boolean }, i: number) => ({
      itemId: checklist[r.itemIndex]?.id || `item-${i}`,
      question: checklist[r.itemIndex]?.question || "",
      passed: Boolean(r.passed),
    }));
  } catch {
    return checklist.map((c) => ({
      itemId: c.id,
      question: c.question,
      passed: false,
    }));
  }
}

export function parseImprovementResponse(raw: string): { targetCheck: string; change: string; rationale: string } {
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    return JSON.parse(cleaned);
  } catch {
    return { targetCheck: "unknown", change: "Could not parse suggestion", rationale: "" };
  }
}

// ---- Studio Persona Conversion ----

/** Convert StudioPersona + ProjectContext into the format Auto-Research expects */
export function studioPersonaToResearchInput(
  persona: StudioPersona,
  context: ProjectContext
): AutoResearchRequest["personas"][0] {
  return {
    name: `${persona.role}${persona.company ? ` (${persona.company})` : ""}`,
    role: persona.role,
    company: persona.company,
    systemPrompt: generatePersonaPrompt(persona, context),
    style: undefined,
  };
}

// ---- Types ----

export type PersonaScorecard = {
  personaName: string;
  scores: {
    relevance: number;
    specificity: number;
    coverage: number;
    differentiation: number;
    actionability: number;
  };
  overall: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

export type TeamGap = {
  area: string;
  severity: "critical" | "moderate" | "minor";
  suggestion: string;
};

export type ConsensusSimulation = {
  decision: string;
  votes: {
    personaName: string;
    position: string;
    confidence: "high" | "medium" | "low";
    reasoning: string;
  }[];
  outcome: string;
  insights: string[];
};

export type AutoResearchResult = {
  scorecards: PersonaScorecard[];
  teamScore: number;
  gaps: TeamGap[];
  consensusSimulation: ConsensusSimulation | null;
  timestamp: string;
};

export type AutoResearchRequest = {
  backend: LLMBackend;
  model: string;
  projectContext: string;
  personas: {
    name: string;
    role: string;
    company: string;
    systemPrompt: string;
    style?: string;
  }[];
  sampleDecision?: string;
};

// ---- Prompt Builders ----

export function buildScorecardPrompt(
  projectContext: string,
  persona: AutoResearchRequest["personas"][0],
  allPersonaNames: string[]
): string {
  return `You are an expert at evaluating AI persona quality for software development teams.

PROJECT CONTEXT:
${projectContext}

PERSONA TO EVALUATE:
- Name: ${persona.name}
- Role: ${persona.role}
- Company: ${persona.company}
- Style: ${persona.style || "Not specified"}
- System Prompt:
${persona.systemPrompt}

OTHER TEAM MEMBERS: ${allPersonaNames.filter((n) => n !== persona.name).join(", ")}

Score this persona on 5 metrics (0-100 each). Be rigorous — generic personas score low.

Respond in this exact JSON format (no markdown, no code fences):
{
  "relevance": <0-100>,
  "specificity": <0-100>,
  "differentiation": <0-100>,
  "actionability": <0-100>,
  "coverage": <0-100>,
  "strengths": ["<strength 1>", "<strength 2>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>"],
  "improvements": ["<specific actionable improvement 1>", "<specific actionable improvement 2>"]
}

Scoring guide:
- Relevance: Does their expertise directly apply to this project type?
- Specificity: Is this modeled after a REAL person at a REAL company with REAL methodology, or generic?
- Differentiation: Does this persona bring a UNIQUE perspective vs the other team members?
- Actionability: Would their guidance produce concrete, implementable decisions?
- Coverage: Does their area of focus fill a necessary role for this project type?`;
}

export function buildGapAnalysisPrompt(
  projectContext: string,
  personas: AutoResearchRequest["personas"]
): string {
  const roster = personas.map((p) => `- ${p.name} (${p.role} at ${p.company})`).join("\n");

  return `You are an expert at assembling AI persona teams for software development.

PROJECT CONTEXT:
${projectContext}

CURRENT TEAM:
${roster}

Analyze this team for gaps. Consider these critical areas:
- Product strategy & prioritization
- Technical architecture & implementation
- UI/UX design & user experience
- Growth & user acquisition
- Retention & engagement
- Revenue & monetization
- Quality assurance & testing
- Security & compliance
- Data & analytics
- Community & developer relations

Respond in this exact JSON format (no markdown, no code fences):
{
  "gaps": [
    {
      "area": "<missing area>",
      "severity": "<critical|moderate|minor>",
      "suggestion": "<specific role and company model to add>"
    }
  ]
}

Only include genuine gaps. If the team is well-covered, return fewer items. Be specific about WHO to model the missing persona after (real company, real role).`;
}

export function buildConsensusSimPrompt(
  projectContext: string,
  personas: AutoResearchRequest["personas"],
  decision: string
): string {
  const roster = personas
    .map((p) => `- ${p.name} (${p.role} at ${p.company}, style: ${p.style || "balanced"})`)
    .join("\n");

  return `You are simulating a persona team discussion about a real decision.

PROJECT CONTEXT:
${projectContext}

TEAM:
${roster}

DECISION TO MAKE:
${decision}

Simulate how each persona would vote on this decision. Each persona should respond IN CHARACTER based on their role, company background, and communication style.

Respond in this exact JSON format (no markdown, no code fences):
{
  "decision": "${decision}",
  "votes": [
    {
      "personaName": "<name>",
      "position": "<their specific recommendation>",
      "confidence": "<high|medium|low>",
      "reasoning": "<1-2 sentence reasoning in character>"
    }
  ],
  "outcome": "<consensus reached | CEO tiebreaker needed | deadlocked>",
  "insights": ["<insight about team dynamics revealed>", "<another insight>"]
}`;
}

// ---- Parsing ----

export function parseScorecardResponse(raw: string, personaName: string): PersonaScorecard {
  try {
    // Strip markdown fences if present
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    const scores = {
      relevance: clamp(data.relevance ?? 50),
      specificity: clamp(data.specificity ?? 50),
      coverage: clamp(data.coverage ?? 50),
      differentiation: clamp(data.differentiation ?? 50),
      actionability: clamp(data.actionability ?? 50),
    };
    const overall = Math.round(
      Object.values(scores).reduce((a, b) => a + b, 0) / 5
    );
    return {
      personaName,
      scores,
      overall,
      strengths: data.strengths || [],
      weaknesses: data.weaknesses || [],
      improvements: data.improvements || [],
    };
  } catch {
    return fallbackScorecard(personaName);
  }
}

export function parseGapResponse(raw: string): TeamGap[] {
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    return (data.gaps || []).map((g: TeamGap) => ({
      area: g.area || "Unknown",
      severity: g.severity || "moderate",
      suggestion: g.suggestion || "",
    }));
  } catch {
    return [];
  }
}

export function parseConsensusResponse(raw: string): ConsensusSimulation | null {
  try {
    const cleaned = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleaned);
    return {
      decision: data.decision || "",
      votes: data.votes || [],
      outcome: data.outcome || "unknown",
      insights: data.insights || [],
    };
  } catch {
    return null;
  }
}

function clamp(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function fallbackScorecard(name: string): PersonaScorecard {
  return {
    personaName: name,
    scores: { relevance: 50, specificity: 50, coverage: 50, differentiation: 50, actionability: 50 },
    overall: 50,
    strengths: ["Could not parse LLM response"],
    weaknesses: ["Retry with a different model or check API key"],
    improvements: [],
  };
}

// ---- Export Functions ----

export function exportResearchToJson(result: AutoResearchResult): string {
  return JSON.stringify(result, null, 2);
}

export function exportResearchToMarkdown(result: AutoResearchResult): string {
  const lines: string[] = [];

  lines.push(`# Team Evaluation Report`);
  lines.push("");
  lines.push(`**Team Score: ${result.teamScore}/100**`);
  lines.push(`**Evaluated:** ${result.scorecards.length} personas`);
  lines.push(`**Date:** ${result.timestamp}`);
  lines.push("");

  // Scorecard table
  lines.push("## Persona Scorecards");
  lines.push("");
  lines.push("| Name | Relevance | Specificity | Coverage | Differentiation | Actionability | Overall |");
  lines.push("|------|-----------|-------------|----------|-----------------|---------------|---------|");
  for (const card of result.scorecards) {
    lines.push(
      `| ${card.personaName} | ${card.scores.relevance} | ${card.scores.specificity} | ${card.scores.coverage} | ${card.scores.differentiation} | ${card.scores.actionability} | **${card.overall}** |`
    );
  }
  lines.push("");

  // Per-persona details
  for (const card of result.scorecards) {
    lines.push(`### ${card.personaName} (${card.overall}/100)`);
    lines.push("");
    if (card.strengths.length > 0) {
      lines.push("**Strengths:**");
      for (const s of card.strengths) {
        lines.push(`- ${s}`);
      }
      lines.push("");
    }
    if (card.weaknesses.length > 0) {
      lines.push("**Weaknesses:**");
      for (const w of card.weaknesses) {
        lines.push(`- ${w}`);
      }
      lines.push("");
    }
    if (card.improvements.length > 0) {
      lines.push("**Improvements:**");
      for (const imp of card.improvements) {
        lines.push(`- ${imp}`);
      }
      lines.push("");
    }
  }

  // Gaps
  if (result.gaps.length > 0) {
    lines.push("## Gaps");
    lines.push("");
    for (const gap of result.gaps) {
      const badge =
        gap.severity === "critical"
          ? "🔴 CRITICAL"
          : gap.severity === "moderate"
            ? "🟡 MODERATE"
            : "🔵 MINOR";
      lines.push(`- **${badge} — ${gap.area}:** ${gap.suggestion}`);
    }
    lines.push("");
  }

  // Consensus simulation
  if (result.consensusSimulation) {
    const sim = result.consensusSimulation;
    lines.push("## Consensus Simulation");
    lines.push("");
    lines.push(`**Decision:** ${sim.decision}`);
    lines.push("");
    for (const vote of sim.votes) {
      lines.push(`- **${vote.personaName}** (${vote.confidence}): ${vote.position}`);
      lines.push(`  > ${vote.reasoning}`);
    }
    lines.push("");
    lines.push(`**Outcome:** ${sim.outcome}`);
    if (sim.insights.length > 0) {
      lines.push("");
      lines.push("**Insights:**");
      for (const insight of sim.insights) {
        lines.push(`- ${insight}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n");
}

export function exportResearchToCsv(result: AutoResearchResult): string {
  const rows: string[] = [];
  rows.push("Name,Relevance,Specificity,Coverage,Differentiation,Actionability,Overall");
  for (const card of result.scorecards) {
    rows.push(
      `${card.personaName},${card.scores.relevance},${card.scores.specificity},${card.scores.coverage},${card.scores.differentiation},${card.scores.actionability},${card.overall}`
    );
  }
  return rows.join("\n");
}

export function exportChecklistToJson(result: AutoresearchLoopResult): string {
  return JSON.stringify(result, null, 2);
}

export function exportChecklistToMarkdown(result: AutoresearchLoopResult): string {
  const lines: string[] = [];
  const passed = result.results.filter((r) => r.passed).length;
  const total = result.results.length;

  lines.push("# Checklist Scoring Report");
  lines.push("");
  lines.push(`**Score: ${result.score}%** (${passed}/${total} passed)`);
  lines.push(`**Skill Target:** ${result.skillTargetId}`);
  lines.push("");

  // Pass/fail table
  lines.push("## Results");
  lines.push("");
  lines.push("| # | Status | Question |");
  lines.push("|---|--------|----------|");
  result.results.forEach((r, i) => {
    const status = r.passed ? "PASS" : "FAIL";
    lines.push(`| ${i + 1} | ${status} | ${r.question} |`);
  });
  lines.push("");

  // Failed items
  if (result.failedItems.length > 0) {
    lines.push("## Failed Items");
    lines.push("");
    for (const item of result.failedItems) {
      lines.push(`- ${item}`);
    }
    lines.push("");
  }

  // Suggested change
  if (result.suggestedChange) {
    lines.push("## Suggested Change");
    lines.push("");
    lines.push(result.suggestedChange);
    lines.push("");
  }

  return lines.join("\n");
}
