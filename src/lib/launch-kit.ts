export type DeployTarget = "web_only" | "web_ios" | "web_ios_android";

export const DEPLOY_TARGETS: { id: DeployTarget; label: string; description: string; techNote: string }[] = [
  { id: "web_only", label: "Website Only", description: "Web app deployed to a single domain", techNote: "Standard Next.js or SPA" },
  { id: "web_ios", label: "Website + iOS", description: "Web app plus native iOS app from shared codebase", techNote: "React Native / Expo recommended" },
  { id: "web_ios_android", label: "Website + iOS + Android", description: "Universal app across all platforms from one codebase", techNote: "React Native / Expo or Flutter" },
];

export const MOBILE_FRAMEWORK_OPTIONS = ["React Native / Expo", "Flutter", "Capacitor", "PWA"];

export type ProjectType =
  | "consumer_app"
  | "saas"
  | "marketplace"
  | "content_platform"
  | "ecommerce"
  | "developer_tool";

export const PROJECT_TYPES: {
  id: ProjectType;
  label: string;
  description: string;
  suggestedRoles: string[];
}[] = [
  {
    id: "consumer_app",
    label: "Consumer App",
    description: "Mobile or web app for end users",
    suggestedRoles: [
      "Product Lead",
      "UI/UX Lead",
      "Retention Lead",
      "Growth Lead",
      "Tech Architect",
    ],
  },
  {
    id: "saas",
    label: "SaaS",
    description: "Business software as a service",
    suggestedRoles: [
      "Product Lead",
      "UI/UX Lead",
      "Revenue Lead",
      "Tech Architect",
      "Customer Success",
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace",
    description: "Two-sided platform connecting buyers and sellers",
    suggestedRoles: [
      "Product Lead",
      "UI/UX Lead",
      "Growth Lead",
      "Trust & Safety",
      "Tech Architect",
    ],
  },
  {
    id: "content_platform",
    label: "Content Platform",
    description: "Content creation and distribution",
    suggestedRoles: [
      "Product Lead",
      "UI/UX Lead",
      "Content Strategy",
      "Community Lead",
      "Tech Architect",
    ],
  },
  {
    id: "ecommerce",
    label: "E-commerce",
    description: "Online store or shopping experience",
    suggestedRoles: [
      "Product Lead",
      "UI/UX Lead",
      "Conversion Lead",
      "Growth Lead",
      "Tech Architect",
    ],
  },
  {
    id: "developer_tool",
    label: "Developer Tool",
    description: "Tools and APIs for developers",
    suggestedRoles: [
      "Product Lead",
      "Tech Architect",
      "DevRel Lead",
      "Growth Lead",
      "QA Lead",
    ],
  },
];

export type TeamRole = {
  role: string;
  company: string;
  focus: string;
};

export type TechChoice = {
  category: string;
  choice: string;
};

export const TECH_CATEGORIES = [
  {
    id: "frontend",
    label: "Frontend",
    options: ["Next.js", "React", "Vue", "Svelte", "Remix", "Astro"],
  },
  {
    id: "backend",
    label: "Backend",
    options: [
      "Node.js",
      "Python/Django",
      "Python/FastAPI",
      "Go",
      "Ruby/Rails",
      "Rust",
    ],
  },
  {
    id: "database",
    label: "Database",
    options: [
      "Supabase (Postgres)",
      "PostgreSQL",
      "MySQL",
      "MongoDB",
      "PlanetScale",
      "Firebase",
    ],
  },
  {
    id: "auth",
    label: "Auth",
    options: [
      "Supabase Auth",
      "Clerk",
      "Auth0",
      "NextAuth",
      "Firebase Auth",
      "Custom",
    ],
  },
  {
    id: "hosting",
    label: "Hosting",
    options: ["Vercel", "AWS", "GCP", "Railway", "Fly.io", "Cloudflare"],
  },
  {
    id: "analytics",
    label: "Analytics",
    options: [
      "PostHog",
      "Mixpanel",
      "Amplitude",
      "Google Analytics",
      "Plausible",
      "None",
    ],
  },
];

export const DEFAULT_TECH_CHOICES: TechChoice[] = [
  { category: "frontend", choice: "Next.js" },
  { category: "backend", choice: "Node.js" },
  { category: "database", choice: "Supabase (Postgres)" },
  { category: "auth", choice: "Supabase Auth" },
  { category: "hosting", choice: "Vercel" },
  { category: "analytics", choice: "PostHog" },
];

export type LaunchKitDraft = {
  // Brief
  projectName: string;
  projectType: ProjectType | null;
  description: string;
  targetUser: string;
  problem: string;
  platforms: string[];
  mvpFeatures: string[];
  comparables: { name: string; strength: string }[];
  // Team
  team: TeamRole[];
  // Stack
  deployTarget: DeployTarget;
  techChoices: TechChoice[];
  mobileFramework: string;
  // Roadmap
  buildPhases: { phase: string; features: string[] }[];
  planGenerated: boolean;
  // Whitepaper
  northStar: string;
  whitepaper: string;
};

export const EMPTY_LAUNCH_KIT: LaunchKitDraft = {
  projectName: "",
  projectType: null,
  description: "",
  targetUser: "",
  problem: "",
  platforms: [],
  mvpFeatures: [],
  comparables: [],
  team: [],
  deployTarget: "web_ios_android",
  techChoices: [...DEFAULT_TECH_CHOICES],
  mobileFramework: "React Native / Expo",
  buildPhases: [
    { phase: "Foundation", features: [] },
    { phase: "Core Feature 1", features: [] },
    { phase: "Core Feature 2", features: [] },
    { phase: "Polish & Launch", features: [] },
  ],
  planGenerated: false,
  northStar: "",
  whitepaper: "",
};

export const PLATFORM_OPTIONS = ["Web", "iOS", "Android", "Desktop", "CLI"];

export function generateTeamMarkdown(draft: LaunchKitDraft): string {
  const lines: string[] = [];

  lines.push(`# Team: ${draft.projectName || "Project"}`);
  lines.push("");

  if (draft.team.length === 0) {
    lines.push("No team roles defined yet.");
    return lines.join("\n");
  }

  lines.push("| Role | Modeled After | Focus Area |");
  lines.push("|------|---------------|------------|");
  draft.team.forEach((t) => {
    lines.push(`| ${t.role} | ${t.company || "---"} | ${t.focus || "---"} |`);
  });
  lines.push("");

  lines.push("## Persona Prompts\n");
  draft.team.forEach((t) => {
    lines.push(`### ${t.role}`);
    if (t.company) lines.push(`> Modeled after: **${t.company}**`);
    if (t.focus) lines.push(`\nFocus: ${t.focus}`);
    lines.push("");
  });

  return lines.join("\n");
}

export function generateBriefMarkdown(draft: LaunchKitDraft): string {
  const lines: string[] = [];

  lines.push(`# Project Brief: ${draft.projectName || "Untitled Project"}`);
  lines.push("");

  if (draft.projectType) {
    const pt = PROJECT_TYPES.find((p) => p.id === draft.projectType);
    if (pt) lines.push(`**Type:** ${pt.label}\n`);
  }

  if (draft.description) {
    lines.push(`## Description\n\n${draft.description}\n`);
  }

  if (draft.targetUser) {
    lines.push(`## Target User\n\n${draft.targetUser}\n`);
  }

  if (draft.problem) {
    lines.push(`## Problem\n\n${draft.problem}\n`);
  }

  if (draft.platforms.length > 0) {
    lines.push(`## Platforms\n\n${draft.platforms.join(", ")}\n`);
  }

  if (draft.mvpFeatures.length > 0) {
    lines.push("## MVP Features\n");
    draft.mvpFeatures.forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  if (draft.comparables.length > 0) {
    lines.push("## Comparable Products\n");
    lines.push("| Product | What They Do Well |");
    lines.push("|---------|-------------------|");
    draft.comparables.forEach((c) => {
      lines.push(`| ${c.name} | ${c.strength} |`);
    });
    lines.push("");
  }

  // Tech Stack
  if (draft.techChoices.length > 0) {
    lines.push("## Tech Stack\n");
    lines.push("| Category | Choice |");
    lines.push("|----------|--------|");
    draft.techChoices.forEach((tc) => {
      const cat = TECH_CATEGORIES.find((c) => c.id === tc.category);
      lines.push(`| ${cat?.label || tc.category} | ${tc.choice} |`);
    });
    lines.push("");
  }

  // Roadmap
  if (draft.buildPhases.some((p) => p.features.length > 0)) {
    lines.push("## Build Roadmap\n");
    draft.buildPhases.forEach((phase, i) => {
      lines.push(`### Phase ${i + 1}: ${phase.phase}`);
      if (phase.features.length > 0) {
        phase.features.forEach((f) => lines.push(`- ${f}`));
      } else {
        lines.push("- (no features defined)");
      }
      lines.push("");
    });
  }

  // Team
  if (draft.team.length > 0) {
    lines.push("## Team\n");
    lines.push("| Role | Modeled After | Focus |");
    lines.push("|------|---------------|-------|");
    draft.team.forEach((t) => {
      lines.push(
        `| ${t.role} | ${t.company || "---"} | ${t.focus || "---"} |`
      );
    });
    lines.push("");
  }

  return lines.join("\n");
}

export function generatePlan(draft: LaunchKitDraft): { phase: string; features: string[] }[] {
  const phases: { phase: string; features: string[] }[] = [];

  // Phase 1: Foundation
  const foundation: string[] = [];
  foundation.push("Set up repository and project structure");
  const stack = draft.techChoices.map((tc) => tc.choice);
  if (stack.length > 0) foundation.push(`Configure ${stack.slice(0, 3).join(", ")}`);
  foundation.push("Database schema and migrations");
  foundation.push("Authentication (sign up, sign in, sign out)");
  if (draft.deployTarget !== "web_only") {
    foundation.push(`Mobile scaffold (${draft.mobileFramework || "React Native / Expo"})`);
  }
  foundation.push("CI/CD pipeline and preview deployments");
  phases.push({ phase: "Foundation", features: foundation });

  // Phase 2: Core MVP features
  const core1: string[] = [];
  const mvp = draft.mvpFeatures.length > 0 ? draft.mvpFeatures : [];
  const half = Math.ceil(mvp.length / 2);
  mvp.slice(0, half).forEach((f) => core1.push(f));
  if (core1.length === 0) core1.push("Primary user flow (end-to-end)");
  core1.push("Loading states, error handling, empty states");
  phases.push({ phase: "Core Features", features: core1 });

  // Phase 3: Remaining features + integrations
  const core2: string[] = [];
  mvp.slice(half).forEach((f) => core2.push(f));
  if (core2.length === 0) core2.push("Secondary user flows");
  if (draft.deployTarget !== "web_only") {
    core2.push("Mobile-specific UX (navigation, gestures, push notifications)");
  }
  core2.push("Analytics and event tracking");
  phases.push({ phase: "Integrations & Polish", features: core2 });

  // Phase 4: Launch prep
  const launch: string[] = [];
  launch.push("Responsive design audit");
  if (draft.deployTarget !== "web_only") {
    launch.push("App store assets and submission");
  }
  launch.push("SEO and meta tags");
  launch.push("Performance optimization");
  launch.push("Security review (RLS, input validation, secrets)");
  launch.push("README and documentation");
  phases.push({ phase: "Launch Prep", features: launch });

  return phases;
}

export function generateWhitepaper(draft: LaunchKitDraft): string {
  const lines: string[] = [];
  const target = DEPLOY_TARGETS.find((d) => d.id === draft.deployTarget);

  lines.push(`# ${draft.projectName || "Project"} -- Whitepaper`);
  lines.push("");
  lines.push("---");
  lines.push("");

  if (draft.northStar) {
    lines.push("## Vision");
    lines.push("");
    lines.push(draft.northStar);
    lines.push("");
  }

  if (draft.problem) {
    lines.push("## Problem");
    lines.push("");
    lines.push(draft.problem);
    lines.push("");
  }

  lines.push("## Solution");
  lines.push("");
  if (draft.description) {
    lines.push(draft.description);
  } else {
    lines.push(`${draft.projectName || "This project"} addresses the problem above by providing a focused, well-designed solution for ${draft.targetUser || "its target users"}.`);
  }
  lines.push("");

  if (draft.targetUser) {
    lines.push("## Target User");
    lines.push("");
    lines.push(draft.targetUser);
    lines.push("");
  }

  if (draft.comparables.length > 0) {
    lines.push("## Competitive Landscape");
    lines.push("");
    lines.push("| Product | Strength | How We Differentiate |");
    lines.push("|---------|----------|---------------------|");
    draft.comparables.forEach((c) => {
      lines.push(`| ${c.name} | ${c.strength} | *To be defined* |`);
    });
    lines.push("");
  }

  if (draft.team.length > 0) {
    lines.push("## Team & Personas");
    lines.push("");
    lines.push("Each persona guides decisions in their domain throughout the build.");
    lines.push("");
    lines.push("| Role | Modeled After | Focus |");
    lines.push("|------|---------------|-------|");
    draft.team.forEach((t) => {
      lines.push(`| ${t.role} | ${t.company || "---"} | ${t.focus || "---"} |`);
    });
    lines.push("");
  }

  lines.push("## Technical Architecture");
  lines.push("");
  lines.push(`**Deployment Target:** ${target?.label || draft.deployTarget}`);
  if (draft.deployTarget !== "web_only" && draft.mobileFramework) {
    lines.push(`**Mobile Framework:** ${draft.mobileFramework}`);
  }
  lines.push("");
  if (draft.techChoices.length > 0) {
    lines.push("| Layer | Technology |");
    lines.push("|-------|-----------|");
    draft.techChoices.forEach((tc) => {
      const cat = TECH_CATEGORIES.find((c) => c.id === tc.category);
      lines.push(`| ${cat?.label || tc.category} | ${tc.choice} |`);
    });
    lines.push("");
  }

  if (draft.buildPhases.some((p) => p.features.length > 0)) {
    lines.push("## MVP Roadmap");
    lines.push("");
    draft.buildPhases.forEach((phase, i) => {
      lines.push(`### Phase ${i + 1}: ${phase.phase}`);
      lines.push("");
      if (phase.features.length > 0) {
        phase.features.forEach((f) => lines.push(`- ${f}`));
      }
      lines.push("");
    });
  }

  if (draft.mvpFeatures.length > 0) {
    lines.push("## Core MVP Features");
    lines.push("");
    draft.mvpFeatures.forEach((f) => lines.push(`- ${f}`));
    lines.push("");
  }

  lines.push("## Success Metrics");
  lines.push("");
  lines.push("| Metric | Target | Timeframe |");
  lines.push("|--------|--------|-----------|");
  if (draft.team.some((t) => t.focus)) {
    draft.team.forEach((t) => {
      if (t.focus) {
        lines.push(`| ${t.focus} (${t.role}) | *TBD* | 3 months |`);
      }
    });
  } else {
    lines.push("| User acquisition | *TBD* | 3 months |");
    lines.push("| Retention (D7) | *TBD* | 3 months |");
    lines.push("| Core feature adoption | *TBD* | 3 months |");
  }
  lines.push("");

  lines.push("## Next Steps");
  lines.push("");
  lines.push("1. Finalize personas and consult at every major decision point");
  lines.push("2. Set up repository and infrastructure (Phase 1)");
  lines.push("3. Build core MVP features with persona-guided review");
  lines.push("4. Launch, measure, and iterate with weekly persona retros");
  lines.push("");
  lines.push("---");
  lines.push("");
  lines.push(`*Generated by Persona Builder on ${new Date().toISOString().split("T")[0]}*`);

  return lines.join("\n");
}
