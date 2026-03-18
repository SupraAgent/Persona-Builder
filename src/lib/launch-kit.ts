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
  techChoices: TechChoice[];
  // Roadmap
  buildPhases: { phase: string; features: string[] }[];
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
  techChoices: [...DEFAULT_TECH_CHOICES],
  buildPhases: [
    { phase: "Foundation", features: [] },
    { phase: "Core Feature 1", features: [] },
    { phase: "Core Feature 2", features: [] },
    { phase: "Polish & Launch", features: [] },
  ],
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
