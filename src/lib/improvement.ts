// ── Types ──────────────────────────────────────────────────────────

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  modeled_after: string;
  expertise: string[];
  personality: string;
  reviews: string[];
  vote_weight: number;
};

export type AppBrief = {
  name: string;
  description: string;
  target_users: string;
  core_value: string;
  tech_stack: string;
  current_state: "MVP" | "Beta" | "Production" | "";
};

export type SubCriterion = {
  name: string;
  score: number;
};

export type CategoryScore = {
  name: string;
  weight: number;
  subCriteria: SubCriterion[];
  avg: number;
};

export type ReferenceApp = {
  name: string;
  why: string;
  scores: CategoryScore[];
};

export type PersonaScore = {
  personaId: string;
  personaName: string;
  scores: CategoryScore[];
  overall: number;
};

export type GapItem = {
  category: string;
  yourScore: number;
  bestRef: number;
  gap: number;
  priority: "CRITICAL" | "HIGH" | "MED" | "LOW";
};

export type Round = {
  number: number;
  decision: string;
  proposedBy: string;
  proposedByRole: string;
  vote: string;
  changes: string[];
  categoryAffected: string;
  scoreBefore: number;
  scoreAfter: number;
  overallBefore: number;
  overallAfter: number;
  gapRemaining: number;
};

export type ImprovementDraft = {
  team: TeamMember[];
  app: AppBrief;
  referenceApps: ReferenceApp[];
  selfScores: CategoryScore[];
  personaScores: PersonaScore[];
  consensusScores: CategoryScore[];
  gapAnalysis: GapItem[];
  rounds: Round[];
  currentRound: number;
  targetScore: number;
};

// ── Constants ──────────────────────────────────────────────────────

export const SCORING_CATEGORIES: {
  name: string;
  weight: number;
  subCriteria: string[];
}[] = [
  {
    name: "Core Features",
    weight: 0.2,
    subCriteria: [
      "Completeness",
      "Depth",
      "Reliability",
      "Differentiation",
      "API / Integrations",
    ],
  },
  {
    name: "UI/UX Quality",
    weight: 0.15,
    subCriteria: [
      "Visual design",
      "Consistency",
      "Responsiveness",
      "Navigation clarity",
      "Loading states",
    ],
  },
  {
    name: "Onboarding & Setup",
    weight: 0.1,
    subCriteria: [
      "Time to value",
      "Guided setup",
      "Documentation",
      "First-run experience",
      "Config complexity",
    ],
  },
  {
    name: "Performance",
    weight: 0.1,
    subCriteria: [
      "Load time",
      "Interaction speed",
      "Search speed",
      "Real-time updates",
      "Offline / cache",
    ],
  },
  {
    name: "Auth & Security",
    weight: 0.1,
    subCriteria: [
      "Auth methods",
      "Session management",
      "Encryption",
      "Role-based access",
      "Audit logging",
    ],
  },
  {
    name: "Reliability",
    weight: 0.1,
    subCriteria: [
      "Error handling",
      "Retry logic",
      "Data integrity",
      "Monitoring / alerts",
      "Graceful degradation",
    ],
  },
  {
    name: "Customization",
    weight: 0.1,
    subCriteria: [
      "Templates",
      "Settings",
      "Themes",
      "Workflows",
      "Extensibility / plugins",
    ],
  },
  {
    name: "Team & Collaboration",
    weight: 0.15,
    subCriteria: [
      "Multi-user support",
      "Permissions",
      "Shared views",
      "Notifications",
      "Activity feed",
    ],
  },
];

export const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "product_lead",
    name: "Alex Chen",
    role: "Head of Product",
    modeled_after: "VP Product at Reference App",
    expertise: ["Feature prioritization", "User research", "Roadmap strategy"],
    personality: "Data-driven, user-obsessed, kills scope creep",
    reviews: ["Feature completeness", "User flows", "Value proposition"],
    vote_weight: 1.2,
  },
  {
    id: "eng_lead",
    name: "Sam Okafor",
    role: "Engineering Lead",
    modeled_after: "Staff Engineer at Reference App",
    expertise: ["Architecture", "Performance", "API design", "Reliability"],
    personality: "Pragmatic, hates over-engineering, ships fast",
    reviews: ["Technical implementation", "Performance", "Error handling"],
    vote_weight: 1.0,
  },
  {
    id: "design_lead",
    name: "Maya Torres",
    role: "Design Lead",
    modeled_after: "Head of Design at Reference App",
    expertise: ["UI/UX", "Design systems", "Accessibility", "Motion"],
    personality: "Opinionated on craft, pushes for polish, user empathy",
    reviews: ["UI quality", "UX flows", "Visual consistency", "Responsiveness"],
    vote_weight: 1.0,
  },
  {
    id: "growth_lead",
    name: "Raj Patel",
    role: "Growth & Analytics",
    modeled_after: "Head of Growth at Reference App",
    expertise: ["Onboarding", "Retention", "Analytics", "A/B testing"],
    personality: "Metric-obsessed, challenges assumptions, loves experiments",
    reviews: ["Onboarding flow", "Retention hooks", "Analytics coverage"],
    vote_weight: 0.8,
  },
  {
    id: "qa_lead",
    name: "Lena Kim",
    role: "QA & Reliability",
    modeled_after: "QA Director at Reference App",
    expertise: ["Testing", "Edge cases", "Error states", "Security"],
    personality:
      "Finds every bug, thinks in failure modes, blocks sloppy releases",
    reviews: ["Error handling", "Edge cases", "Security", "Auth flows"],
    vote_weight: 0.8,
  },
];

const CATEGORY_PERSONA_MAP: Record<string, string> = {
  "Core Features": "product_lead",
  "UI/UX Quality": "design_lead",
  "Onboarding & Setup": "growth_lead",
  Performance: "eng_lead",
  "Auth & Security": "qa_lead",
  Reliability: "eng_lead",
  Customization: "product_lead",
  "Team & Collaboration": "growth_lead",
};

const IMPROVEMENT_SUGGESTIONS: Record<string, string[]> = {
  "Core Features": [
    "Add core CRUD workflows with validation",
    "Implement search and filtering across entities",
    "Add bulk operations and batch processing",
    "Build API integrations with webhook support",
    "Add data import/export in multiple formats",
  ],
  "UI/UX Quality": [
    "Implement responsive design system with consistent spacing",
    "Add skeleton loading states and progress indicators",
    "Build keyboard navigation and shortcuts",
    "Add toast notifications and inline feedback",
    "Implement dark/light mode with smooth transitions",
  ],
  "Onboarding & Setup": [
    "Build interactive onboarding wizard with progress tracking",
    "Add contextual tooltips and inline documentation",
    "Create quick-start templates for common use cases",
    "Implement guided first-run experience",
    "Add in-app help center with searchable docs",
  ],
  Performance: [
    "Add request caching and optimistic updates",
    "Implement virtual scrolling for large lists",
    "Add service worker for offline support",
    "Optimize bundle size with code splitting",
    "Implement real-time updates via WebSocket",
  ],
  "Auth & Security": [
    "Add OAuth provider (GitHub/Google)",
    "Implement session management with refresh tokens",
    "Add role-based access control",
    "Set up audit logging for sensitive actions",
    "Implement data encryption at rest and in transit",
  ],
  Reliability: [
    "Add global error boundary with recovery",
    "Implement retry logic for failed API calls",
    "Add data validation at API boundaries",
    "Set up health checks and uptime monitoring",
    "Implement graceful degradation for offline state",
  ],
  Customization: [
    "Build template system with user-created templates",
    "Add user preference settings panel",
    "Implement custom theme editor",
    "Add configurable workflow automations",
    "Build plugin/extension architecture",
  ],
  "Team & Collaboration": [
    "Add multi-user support with invitations",
    "Implement granular permissions system",
    "Build shared views and dashboards",
    "Add real-time notification system",
    "Implement activity feed with @mentions",
  ],
};

// ── Helper Functions ───────────────────────────────────────────────

export function createEmptyScores(): CategoryScore[] {
  return SCORING_CATEGORIES.map((cat) => ({
    name: cat.name,
    weight: cat.weight,
    subCriteria: cat.subCriteria.map((sc) => ({ name: sc, score: 0 })),
    avg: 0,
  }));
}

export function calcCategoryAvg(category: CategoryScore): number {
  const scores = category.subCriteria.map((sc) => sc.score);
  const sum = scores.reduce((a, b) => a + b, 0);
  return scores.length > 0 ? Math.round(sum / scores.length) : 0;
}

export function recalcAverages(scores: CategoryScore[]): CategoryScore[] {
  return scores.map((cat) => ({ ...cat, avg: calcCategoryAvg(cat) }));
}

export function calcWeightedOverall(scores: CategoryScore[]): number {
  const total = scores.reduce((sum, cat) => sum + cat.avg * cat.weight, 0);
  return Math.round(total);
}

export function calcConsensus(
  personaScores: PersonaScore[],
  team: TeamMember[]
): CategoryScore[] {
  if (personaScores.length === 0) return createEmptyScores();

  const base = createEmptyScores();
  const totalWeight = team.reduce((s, m) => s + m.vote_weight, 0);

  return base.map((cat, catIdx) => {
    const subCriteria = cat.subCriteria.map((sc, scIdx) => {
      let weightedSum = 0;
      personaScores.forEach((ps, pIdx) => {
        const w = team[pIdx]?.vote_weight ?? 1;
        const score = ps.scores[catIdx]?.subCriteria[scIdx]?.score ?? 0;
        weightedSum += score * w;
      });
      return { ...sc, score: Math.round(weightedSum / totalWeight) };
    });
    const avg = Math.round(
      subCriteria.reduce((s, sc) => s + sc.score, 0) / subCriteria.length
    );
    return { ...cat, subCriteria, avg };
  });
}

export function calcGapAnalysis(
  consensusScores: CategoryScore[],
  referenceApps: ReferenceApp[]
): GapItem[] {
  return consensusScores.map((cat) => {
    const yourScore = cat.avg;
    const bestRef = Math.max(
      ...referenceApps.map((app) => {
        const refCat = app.scores.find((s) => s.name === cat.name);
        return refCat ? refCat.avg : 0;
      }),
      0
    );
    const gap = Math.max(bestRef - yourScore, 0);
    const priority: GapItem["priority"] =
      gap > 50 ? "CRITICAL" : gap > 30 ? "HIGH" : gap > 10 ? "MED" : "LOW";
    return { category: cat.name, yourScore, bestRef, gap, priority };
  });
}

// Seed for deterministic-ish randomness per session
let _seed = 1;
function seededRandom(): number {
  _seed = (_seed * 16807) % 2147483647;
  return (_seed - 1) / 2147483646;
}

export function generatePersonaScores(
  selfScores: CategoryScore[],
  team: TeamMember[]
): PersonaScore[] {
  _seed = 42; // reset each generation
  return team.map((member) => {
    const domainCategories = Object.entries(CATEGORY_PERSONA_MAP)
      .filter(([, id]) => id === member.id)
      .map(([cat]) => cat);

    const scores = selfScores.map((cat) => {
      const isDomain = domainCategories.includes(cat.name);
      const subCriteria = cat.subCriteria.map((sc) => {
        const variance = isDomain
          ? Math.round((seededRandom() - 0.6) * 20) // domain experts score slightly lower (stricter)
          : Math.round((seededRandom() - 0.5) * 16);
        return {
          ...sc,
          score: Math.max(0, Math.min(100, sc.score + variance)),
        };
      });
      const avg = Math.round(
        subCriteria.reduce((s, sc) => s + sc.score, 0) / subCriteria.length
      );
      return { ...cat, subCriteria, avg };
    });

    return {
      personaId: member.id,
      personaName: member.name,
      scores,
      overall: calcWeightedOverall(scores),
    };
  });
}

export function simulateRound(draft: ImprovementDraft): Round {
  const { gapAnalysis, team, rounds, consensusScores } = draft;

  // Find highest-gap category, skip categories where the last 2 rounds used the same persona
  const sorted = [...gapAnalysis].sort((a, b) => b.gap - a.gap);
  const recentPersonas = rounds.slice(-2).map((r) => r.proposedBy);

  let chosen = sorted[0];
  let chosenPersonaId = CATEGORY_PERSONA_MAP[chosen.category] ?? "product_lead";

  for (const item of sorted) {
    const pid = CATEGORY_PERSONA_MAP[item.category] ?? "product_lead";
    const consecutive = recentPersonas.every((rp) => rp === pid);
    if (!consecutive || sorted.indexOf(item) === sorted.length - 1) {
      chosen = item;
      chosenPersonaId = pid;
      break;
    }
  }

  const persona = team.find((m) => m.id === chosenPersonaId) ?? team[0];

  // Pick an unused suggestion
  const suggestions = IMPROVEMENT_SUGGESTIONS[chosen.category] ?? [
    "General improvement",
  ];
  const usedDecisions = rounds
    .filter((r) => r.categoryAffected === chosen.category)
    .map((r) => r.decision);
  const available = suggestions.filter((s) => !usedDecisions.includes(s));
  const decision =
    available.length > 0 ? available[0] : suggestions[suggestions.length - 1];

  // Score bump: ~30% of gap, capped at 25, min 5
  const bump = Math.max(5, Math.min(25, Math.round(chosen.gap * 0.3)));

  const catIdx = consensusScores.findIndex((c) => c.name === chosen.category);
  const scoreBefore = chosen.yourScore;
  const scoreAfter = scoreBefore + bump;
  const overallBefore = calcWeightedOverall(consensusScores);

  // Calculate new overall with the bump applied
  const updatedScores = consensusScores.map((cat, i) => {
    if (i !== catIdx) return cat;
    const newAvg = Math.min(100, cat.avg + bump);
    return { ...cat, avg: newAvg };
  });
  const overallAfter = calcWeightedOverall(updatedScores);

  // Voter count
  const approvals = Math.min(team.length, 3 + Math.floor(seededRandom() * 3));
  const vote = `${approvals}/${team.length} agree`;

  return {
    number: rounds.length + 1,
    decision,
    proposedBy: persona.id,
    proposedByRole: `${persona.name} (${persona.role})`,
    vote,
    changes: [decision],
    categoryAffected: chosen.category,
    scoreBefore,
    scoreAfter: Math.min(100, scoreAfter),
    overallBefore,
    overallAfter,
    gapRemaining: Math.max(0, chosen.bestRef - scoreAfter),
  };
}

export function applyRound(
  draft: ImprovementDraft,
  round: Round
): Partial<ImprovementDraft> {
  const catIdx = draft.consensusScores.findIndex(
    (c) => c.name === round.categoryAffected
  );
  if (catIdx === -1) return {};

  const bump = round.scoreAfter - round.scoreBefore;

  // Spread the bump evenly across sub-criteria
  const updatedScores = draft.consensusScores.map((cat, i) => {
    if (i !== catIdx) return cat;
    const perSub = Math.ceil(bump / cat.subCriteria.length);
    const subCriteria = cat.subCriteria.map((sc) => ({
      ...sc,
      score: Math.min(100, sc.score + perSub),
    }));
    const avg = Math.round(
      subCriteria.reduce((s, sc) => s + sc.score, 0) / subCriteria.length
    );
    return { ...cat, subCriteria, avg };
  });

  const newGapAnalysis = calcGapAnalysis(updatedScores, draft.referenceApps);

  return {
    consensusScores: updatedScores,
    gapAnalysis: newGapAnalysis,
    rounds: [...draft.rounds, round],
    currentRound: draft.currentRound + 1,
  };
}

// ── Empty Draft ────────────────────────────────────────────────────

export const EMPTY_APP_BRIEF: AppBrief = {
  name: "",
  description: "",
  target_users: "",
  core_value: "",
  tech_stack: "",
  current_state: "",
};

export const EMPTY_IMPROVEMENT_DRAFT: ImprovementDraft = {
  team: DEFAULT_TEAM.map((m) => ({ ...m })),
  app: { ...EMPTY_APP_BRIEF },
  referenceApps: [],
  selfScores: createEmptyScores(),
  personaScores: [],
  consensusScores: createEmptyScores(),
  gapAnalysis: [],
  rounds: [],
  currentRound: 0,
  targetScore: 80,
};
