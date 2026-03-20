/** Auto-Research — types and mock evaluation generators */

/* --------------- Types --------------- */

export type ResearchMode = "team_evaluation" | "checklist_scoring";
export type ComputeBackend = "claude_api" | "ollama";
export type ModelOption = "sonnet" | "haiku" | "opus";

export type ResearchConfig = {
  mode: ResearchMode;
  backend: ComputeBackend;
  model: ModelOption;
  apiKey: string;
  ollamaUrl: string;
  projectContext: string;
  selectedPersonaIds: string[];
};

export const EMPTY_CONFIG: ResearchConfig = {
  mode: "team_evaluation",
  backend: "claude_api",
  model: "sonnet",
  apiKey: "",
  ollamaUrl: "http://localhost:11434",
  projectContext: "",
  selectedPersonaIds: [],
};

export type EvaluationMetric = {
  name: string;
  score: number;
  reasoning: string;
};

export type PersonaEvaluation = {
  personaId: string;
  personaName: string;
  personaIcon: string;
  metrics: EvaluationMetric[];
  overallScore: number;
  gapAnalysis: string;
  strengths: string[];
  improvements: string[];
};

export type ChecklistItem = {
  item: string;
  pass: boolean;
  note: string;
};

export type PersonaChecklist = {
  personaId: string;
  personaName: string;
  personaIcon: string;
  items: ChecklistItem[];
  passRate: number;
};

export type ResearchResults = {
  mode: ResearchMode;
  evaluations: PersonaEvaluation[];
  checklists: PersonaChecklist[];
  summary: string;
};

/* --------------- Constants --------------- */

export const EVALUATION_METRICS = [
  "Domain Expertise Depth",
  "Consultation Trigger Coverage",
  "Bias Balance",
  "Actionability of Advice",
  "Team Complementarity",
];

export const MODELS: { id: ModelOption; label: string; description: string }[] = [
  { id: "sonnet", label: "Sonnet 4.6", description: "Recommended" },
  { id: "haiku", label: "Haiku 4.5", description: "Fastest" },
  { id: "opus", label: "Opus 4.6", description: "Deepest" },
];

/* --------------- Mock Generators --------------- */

type PersonaRow = {
  id: string;
  name: string;
  system_prompt: string;
  capabilities: string[];
  icon: string | null;
};

const METRIC_REASONING: Record<string, string[]> = {
  "Domain Expertise Depth": [
    "Persona demonstrates strong domain knowledge with specific, actionable beliefs.",
    "Good breadth of expertise but could go deeper on edge cases.",
    "Expertise is well-defined but narrowly focused — may miss cross-domain implications.",
    "Strong technical depth with practical experience markers.",
  ],
  "Consultation Trigger Coverage": [
    "Triggers are well-defined and cover key decision points.",
    "Trigger coverage is adequate but misses some common consultation scenarios.",
    "Triggers could be more specific to reduce ambiguity about when to consult.",
    "Excellent trigger definition — clear boundaries for when to engage.",
  ],
  "Bias Balance": [
    "Persona shows healthy push-back patterns without being overly rigid.",
    "Some biases toward specific approaches that could limit advice diversity.",
    "Well-balanced perspective with clear awareness of trade-offs.",
    "Could benefit from acknowledging more nuanced trade-offs in recommendations.",
  ],
  "Actionability of Advice": [
    "Advice patterns are concrete and immediately implementable.",
    "Recommendations are sound but sometimes lack specific next steps.",
    "Good balance of strategic thinking and tactical advice.",
    "Advice is highly actionable with clear decision frameworks.",
  ],
  "Team Complementarity": [
    "Role fills a clear gap in the team's collective expertise.",
    "Some overlap with other team members — consider differentiating focus areas.",
    "Strong complementary fit — this role adds unique perspective to the team.",
    "Good team fit but could benefit from stronger cross-role interaction patterns.",
  ],
};

function randomScore(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateMockEvaluation(
  persona: PersonaRow,
  projectContext: string
): PersonaEvaluation {
  const metrics: EvaluationMetric[] = EVALUATION_METRICS.map((name) => ({
    name,
    score: randomScore(62, 95),
    reasoning: pickRandom(METRIC_REASONING[name]),
  }));

  const overallScore = Math.round(
    metrics.reduce((sum, m) => sum + m.score, 0) / metrics.length
  );

  const strengths = [
    `Strong ${persona.name.toLowerCase().includes("tech") || persona.name.toLowerCase().includes("engineer") ? "technical" : "domain"} expertise definition`,
    "Clear push-back patterns that prevent common pitfalls",
    "Well-structured consultation format for consistent advice",
  ].slice(0, 2 + Math.floor(Math.random() * 2));

  const improvements = [
    "Consider adding more specific consultation triggers for edge cases",
    "Could benefit from explicit cross-role collaboration patterns",
    "Add failure mode definitions — what does bad advice from this persona look like?",
  ].slice(0, 1 + Math.floor(Math.random() * 2));

  return {
    personaId: persona.id,
    personaName: persona.name,
    personaIcon: persona.icon || "\u{1F916}",
    metrics,
    overallScore,
    gapAnalysis: `${persona.name} covers ${overallScore >= 80 ? "most" : "many"} key areas for its role${projectContext ? ` in the context of "${projectContext.slice(0, 50)}..."` : ""}. ${overallScore >= 85 ? "This is a strong persona with minimal gaps." : "Consider strengthening trigger definitions and cross-role interaction patterns."}`,
    strengths,
    improvements,
  };
}

const CHECKLIST_ITEMS = [
  { item: "Has clearly defined domain expertise", note: "Expertise should be specific, not generic" },
  { item: "Has 3+ core beliefs that guide advice", note: "Beliefs shape the persona's perspective" },
  { item: "Defines what it optimizes for", note: "Optimization target should be measurable" },
  { item: "Has push-back patterns defined", note: "Push-back prevents common mistakes" },
  { item: "Has consultation triggers", note: "When should this persona be consulted?" },
  { item: "Specifies output format for advice", note: "Structured output improves consistency" },
  { item: "Has confidence level indicators", note: "High/Medium/Low for recommendation strength" },
  { item: "Defines compromise positions", note: "What happens when overruled?" },
  { item: "Has project context awareness", note: "Persona should adapt to project specifics" },
  { item: "Complements other team members", note: "No excessive overlap with other roles" },
];

export function generateMockChecklist(persona: PersonaRow): PersonaChecklist {
  const promptLength = persona.system_prompt?.length || 0;
  const hasCapabilities = persona.capabilities?.length > 0;

  const items: ChecklistItem[] = CHECKLIST_ITEMS.map((ci, i) => {
    // Make results somewhat dependent on actual persona data
    const pass = i < 3
      ? promptLength > 100
      : i < 6
        ? promptLength > 200 || hasCapabilities
        : Math.random() > 0.35;
    return { item: ci.item, pass, note: ci.note };
  });

  const passRate = Math.round(
    (items.filter((i) => i.pass).length / items.length) * 100
  );

  return {
    personaId: persona.id,
    personaName: persona.name,
    personaIcon: persona.icon || "\u{1F916}",
    items,
    passRate,
  };
}

export function generateResultsMarkdown(results: ResearchResults): string {
  const lines: string[] = [];

  lines.push("# Auto-Research Results");
  lines.push("");
  lines.push(`*Generated on ${new Date().toISOString().split("T")[0]}*`);
  lines.push("");

  if (results.mode === "team_evaluation") {
    results.evaluations.forEach((ev) => {
      lines.push(`## ${ev.personaIcon} ${ev.personaName} — Score: ${ev.overallScore}/100`);
      lines.push("");
      lines.push("| Metric | Score | Reasoning |");
      lines.push("|--------|-------|-----------|");
      ev.metrics.forEach((m) => {
        lines.push(`| ${m.name} | ${m.score}/100 | ${m.reasoning} |`);
      });
      lines.push("");
      lines.push("**Strengths:**");
      ev.strengths.forEach((s) => lines.push(`- ${s}`));
      lines.push("");
      lines.push("**Improvements:**");
      ev.improvements.forEach((im) => lines.push(`- ${im}`));
      lines.push("");
      lines.push(`**Gap Analysis:** ${ev.gapAnalysis}`);
      lines.push("");
      lines.push("---");
      lines.push("");
    });
  } else {
    results.checklists.forEach((cl) => {
      lines.push(`## ${cl.personaIcon} ${cl.personaName} — Pass Rate: ${cl.passRate}%`);
      lines.push("");
      lines.push("| Check | Status | Note |");
      lines.push("|-------|--------|------|");
      cl.items.forEach((item) => {
        lines.push(`| ${item.item} | ${item.pass ? "PASS" : "FAIL"} | ${item.note} |`);
      });
      lines.push("");
      lines.push("---");
      lines.push("");
    });
  }

  if (results.summary) {
    lines.push("## Summary");
    lines.push("");
    lines.push(results.summary);
  }

  return lines.join("\n");
}
