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
