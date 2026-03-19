/* ── Design-to-Ship Kit ── */

import {
  type ProjectType,
  type TeamRole,
  type TechChoice,
  PROJECT_TYPES,
  TECH_CATEGORIES,
  DEFAULT_TECH_CHOICES,
} from "./launch-kit";

/* ── Types ── */

export type DesignToken = {
  role: string; // e.g. "Primary", "Background"
  name: string; // descriptive name, e.g. "Ocean-deep Cerulean"
  hex: string; // e.g. "#0077B6"
  usage: string; // when/where it's used
};

export type TypographyRule = {
  level: string; // e.g. "Display", "Heading", "Body"
  description: string;
};

export type ComponentPattern = {
  element: string; // e.g. "Buttons", "Cards", "Inputs"
  description: string;
};

export type StitchScreen = {
  id: string;
  name: string;
  prompt: string;
  status: "pending" | "generating" | "generated" | "approved";
  personaReviewed: boolean;
};

export type ShipConfig = {
  exportFormat: "react" | "html" | "nextjs";
  includeDesignMd: boolean;
  includeClaudeMd: boolean;
  includePersonas: boolean;
  deployTarget: "vercel" | "netlify" | "railway" | "manual";
};

export type DesignToShipDraft = {
  // Step 1: Brief (reuse from launch-kit)
  projectName: string;
  projectType: ProjectType | null;
  description: string;
  targetUser: string;
  atmosphere: string; // design mood
  referenceUrl: string;

  // Step 2: Personas
  team: TeamRole[];

  // Step 3: Design System
  colors: DesignToken[];
  typography: TypographyRule[];
  components: ComponentPattern[];
  layoutPrinciples: string;
  designPrinciples: string[];
  antiPatterns: string[];

  // Step 4: Screens
  screens: StitchScreen[];

  // Step 5: Ship
  techChoices: TechChoice[];
  shipConfig: ShipConfig;
};

/* ── Constants ── */

export const ATMOSPHERE_PRESETS = [
  { id: "minimal", label: "Minimal & Airy", description: "Clean lines, generous white space, subtle shadows" },
  { id: "bold", label: "Bold & Vibrant", description: "Strong colors, high contrast, energetic feel" },
  { id: "warm", label: "Warm & Organic", description: "Earth tones, rounded shapes, approachable" },
  { id: "dark", label: "Dark & Sleek", description: "Dark backgrounds, neon accents, modern tech" },
  { id: "editorial", label: "Editorial & Refined", description: "Typography-driven, sophisticated, magazine-like" },
  { id: "playful", label: "Playful & Colorful", description: "Fun palette, rounded elements, micro-animations" },
];

export const DEFAULT_COLOR_PALETTES: Record<string, DesignToken[]> = {
  minimal: [
    { role: "Primary", name: "Deep Indigo", hex: "#4F46E5", usage: "Primary actions and active states" },
    { role: "Secondary", name: "Soft Slate", hex: "#64748B", usage: "Secondary text and icons" },
    { role: "Background", name: "Clean White", hex: "#FFFFFF", usage: "Page background" },
    { role: "Surface", name: "Whisper Gray", hex: "#F8FAFC", usage: "Card and container backgrounds" },
    { role: "Text Primary", name: "Near Black", hex: "#0F172A", usage: "Headlines and body text" },
    { role: "Text Secondary", name: "Muted Slate", hex: "#94A3B8", usage: "Captions and helper text" },
    { role: "Accent", name: "Electric Violet", hex: "#7C3AED", usage: "Highlights and badges" },
    { role: "Error", name: "Warm Red", hex: "#EF4444", usage: "Error states and destructive actions" },
    { role: "Success", name: "Emerald", hex: "#10B981", usage: "Success states and confirmations" },
  ],
  bold: [
    { role: "Primary", name: "Electric Blue", hex: "#2563EB", usage: "Primary actions and CTAs" },
    { role: "Secondary", name: "Hot Orange", hex: "#F97316", usage: "Secondary actions and highlights" },
    { role: "Background", name: "Pure White", hex: "#FFFFFF", usage: "Page background" },
    { role: "Surface", name: "Light Gray", hex: "#F3F4F6", usage: "Card backgrounds" },
    { role: "Text Primary", name: "Charcoal", hex: "#111827", usage: "Headlines" },
    { role: "Text Secondary", name: "Cool Gray", hex: "#6B7280", usage: "Body and secondary text" },
    { role: "Accent", name: "Vivid Pink", hex: "#EC4899", usage: "Attention-grabbing elements" },
    { role: "Error", name: "Crimson", hex: "#DC2626", usage: "Error states" },
    { role: "Success", name: "Bright Green", hex: "#22C55E", usage: "Success confirmations" },
  ],
  warm: [
    { role: "Primary", name: "Terracotta", hex: "#C2410C", usage: "Primary actions and navigation" },
    { role: "Secondary", name: "Sage Green", hex: "#65A30D", usage: "Secondary actions and accents" },
    { role: "Background", name: "Warm Cream", hex: "#FFFBEB", usage: "Page background" },
    { role: "Surface", name: "Soft Linen", hex: "#FEF3C7", usage: "Card backgrounds" },
    { role: "Text Primary", name: "Dark Walnut", hex: "#451A03", usage: "Headlines" },
    { role: "Text Secondary", name: "Warm Brown", hex: "#92400E", usage: "Body text" },
    { role: "Accent", name: "Golden Honey", hex: "#D97706", usage: "Highlights and badges" },
    { role: "Error", name: "Deep Rose", hex: "#BE123C", usage: "Error states" },
    { role: "Success", name: "Forest Green", hex: "#15803D", usage: "Success states" },
  ],
  dark: [
    { role: "Primary", name: "Neon Cyan", hex: "#06B6D4", usage: "Primary actions and CTAs" },
    { role: "Secondary", name: "Electric Purple", hex: "#A855F7", usage: "Secondary highlights" },
    { role: "Background", name: "Deep Space", hex: "#0F172A", usage: "Page background" },
    { role: "Surface", name: "Dark Slate", hex: "#1E293B", usage: "Card and container backgrounds" },
    { role: "Text Primary", name: "Bright White", hex: "#F1F5F9", usage: "Headlines and primary text" },
    { role: "Text Secondary", name: "Cool Silver", hex: "#94A3B8", usage: "Secondary text" },
    { role: "Accent", name: "Hot Pink", hex: "#F472B6", usage: "Badges and attention elements" },
    { role: "Error", name: "Neon Red", hex: "#FB7185", usage: "Error states" },
    { role: "Success", name: "Neon Green", hex: "#34D399", usage: "Success states" },
  ],
  editorial: [
    { role: "Primary", name: "Deep Navy", hex: "#1E3A5F", usage: "Headlines and primary actions" },
    { role: "Secondary", name: "Dusty Rose", hex: "#BE7B7B", usage: "Accents and decorative elements" },
    { role: "Background", name: "Off-White", hex: "#FAF9F6", usage: "Page background" },
    { role: "Surface", name: "Pale Stone", hex: "#F0EFEB", usage: "Card backgrounds" },
    { role: "Text Primary", name: "Rich Black", hex: "#1A1A1A", usage: "Body and headlines" },
    { role: "Text Secondary", name: "Warm Gray", hex: "#737373", usage: "Captions and metadata" },
    { role: "Accent", name: "Burnished Gold", hex: "#B8860B", usage: "Pull quotes and highlights" },
    { role: "Error", name: "Muted Red", hex: "#C0392B", usage: "Error states" },
    { role: "Success", name: "Deep Teal", hex: "#0D9488", usage: "Success states" },
  ],
  playful: [
    { role: "Primary", name: "Sunny Yellow", hex: "#EAB308", usage: "Primary actions and CTAs" },
    { role: "Secondary", name: "Sky Blue", hex: "#38BDF8", usage: "Secondary actions" },
    { role: "Background", name: "Soft White", hex: "#FEFCE8", usage: "Page background" },
    { role: "Surface", name: "Light Lavender", hex: "#F5F3FF", usage: "Card backgrounds" },
    { role: "Text Primary", name: "Deep Purple", hex: "#3B0764", usage: "Headlines" },
    { role: "Text Secondary", name: "Plum", hex: "#7E22CE", usage: "Body text" },
    { role: "Accent", name: "Coral", hex: "#FB923C", usage: "Badges and highlights" },
    { role: "Error", name: "Raspberry", hex: "#E11D48", usage: "Error states" },
    { role: "Success", name: "Mint Green", hex: "#4ADE80", usage: "Success states" },
  ],
};

export const SCREEN_TEMPLATES = [
  { id: "landing", label: "Landing Page", prompt: "A hero landing page with headline, subheadline, CTA button, feature highlights grid, and social proof section" },
  { id: "dashboard", label: "Dashboard", prompt: "An analytics dashboard with sidebar navigation, key metrics cards, a primary chart, and a recent activity list" },
  { id: "auth", label: "Login / Sign Up", prompt: "A centered auth card with email/password fields, social login buttons, and a toggle between login and sign up" },
  { id: "settings", label: "Settings", prompt: "A settings page with grouped sections, toggle switches, dropdown selectors, and a sticky save bar" },
  { id: "profile", label: "User Profile", prompt: "A profile page with avatar, user details, activity feed, and edit capabilities" },
  { id: "list", label: "List / Feed", prompt: "A content list with search, filters, sortable columns, pagination, and empty state" },
  { id: "detail", label: "Detail View", prompt: "A detail page with hero image, title, metadata, body content, and related items" },
  { id: "onboarding", label: "Onboarding Flow", prompt: "A multi-step onboarding with progress indicator, welcome message, and preference selection" },
];

export const EXPORT_FORMATS = [
  { id: "react" as const, label: "React + Tailwind", description: "Component-based React with Tailwind CSS" },
  { id: "nextjs" as const, label: "Next.js App", description: "Full Next.js app with routing and API" },
  { id: "html" as const, label: "HTML / CSS", description: "Static HTML with Tailwind CDN" },
];

export const DEPLOY_OPTIONS = [
  { id: "vercel" as const, label: "Vercel", description: "Zero-config deploys, great for Next.js" },
  { id: "netlify" as const, label: "Netlify", description: "Continuous deployment from Git" },
  { id: "railway" as const, label: "Railway", description: "Full-stack hosting with databases" },
  { id: "manual" as const, label: "Manual / Self-Host", description: "Download and deploy yourself" },
];

/* ── Initial State ── */

export const EMPTY_DESIGN_TO_SHIP: DesignToShipDraft = {
  projectName: "",
  projectType: null,
  description: "",
  targetUser: "",
  atmosphere: "",
  referenceUrl: "",
  team: [],
  colors: [],
  typography: [
    { level: "Display / Hero", description: "" },
    { level: "Headings", description: "" },
    { level: "Body", description: "" },
    { level: "Caption / Small", description: "" },
  ],
  components: [
    { element: "Buttons", description: "" },
    { element: "Cards / Containers", description: "" },
    { element: "Inputs / Forms", description: "" },
    { element: "Navigation", description: "" },
  ],
  layoutPrinciples: "",
  designPrinciples: [],
  antiPatterns: [],
  screens: [],
  techChoices: [...DEFAULT_TECH_CHOICES],
  shipConfig: {
    exportFormat: "react",
    includeDesignMd: true,
    includeClaudeMd: true,
    includePersonas: true,
    deployTarget: "vercel",
  },
};

/* ── Generators ── */

export function generateDesignMd(draft: DesignToShipDraft): string {
  const lines: string[] = [];
  const uiPersona = draft.team.find((t) => {
    const r = t.role.toLowerCase();
    return r.includes("ui") || r.includes("ux") || r.includes("design");
  });

  lines.push(`# Design System: ${draft.projectName || "Project"}`);
  lines.push("");
  if (uiPersona) {
    lines.push(`> Guided by ${uiPersona.role}${uiPersona.company ? `, modeled after ${uiPersona.company}` : ""}`);
    lines.push("");
  }

  // 1. Atmosphere
  lines.push("## 1. Visual Theme & Atmosphere");
  lines.push("");
  const preset = ATMOSPHERE_PRESETS.find((p) => p.id === draft.atmosphere);
  if (preset) {
    lines.push(`${preset.description}. ${draft.description ? `Designed for ${draft.targetUser || "the target user"} — ${preset.label.toLowerCase()} aesthetic that communicates trust and clarity.` : ""}`);
  } else if (draft.atmosphere) {
    lines.push(draft.atmosphere);
  } else {
    lines.push("*(Not defined yet)*");
  }
  lines.push("");

  // 2. Colors
  lines.push("## 2. Color Palette & Roles");
  lines.push("");
  if (draft.colors.length > 0) {
    lines.push("| Role | Color | Hex | Usage |");
    lines.push("|------|-------|-----|-------|");
    draft.colors.forEach((c) => {
      lines.push(`| ${c.role} | ${c.name} | ${c.hex} | ${c.usage} |`);
    });
  } else {
    lines.push("*(No colors defined yet)*");
  }
  lines.push("");

  // 3. Typography
  lines.push("## 3. Typography Rules");
  lines.push("");
  draft.typography.forEach((t) => {
    if (t.description) {
      lines.push(`- **${t.level}:** ${t.description}`);
    }
  });
  if (!draft.typography.some((t) => t.description)) {
    lines.push("*(Not defined yet)*");
  }
  lines.push("");

  // 4. Components
  lines.push("## 4. Component Patterns");
  lines.push("");
  draft.components.forEach((c) => {
    if (c.description) {
      lines.push(`### ${c.element}`);
      lines.push(c.description);
      lines.push("");
    }
  });
  if (!draft.components.some((c) => c.description)) {
    lines.push("*(Not defined yet)*");
  }
  lines.push("");

  // 5. Layout
  lines.push("## 5. Layout Principles");
  lines.push("");
  lines.push(draft.layoutPrinciples || "*(Not defined yet)*");
  lines.push("");

  // 6. Persona Design Principles
  lines.push("## 6. Persona Design Principles");
  lines.push("");
  if (draft.designPrinciples.length > 0) {
    draft.designPrinciples.forEach((p) => lines.push(`- ${p}`));
  } else {
    lines.push("*(Not defined yet)*");
  }
  lines.push("");

  // 7. Anti-Patterns
  lines.push("## 7. Anti-Patterns");
  lines.push("");
  if (draft.antiPatterns.length > 0) {
    draft.antiPatterns.forEach((a) => lines.push(`- ${a}`));
  } else {
    lines.push("*(Not defined yet)*");
  }
  lines.push("");

  lines.push("---");
  lines.push(`*Generated by Design-to-Ship Kit on ${new Date().toISOString().split("T")[0]}*`);

  return lines.join("\n");
}

export function generateScreenPrompt(
  screen: StitchScreen,
  draft: DesignToShipDraft
): string {
  const lines: string[] = [];
  const preset = ATMOSPHERE_PRESETS.find((p) => p.id === draft.atmosphere);

  lines.push("Use the following design system:");
  lines.push("");

  if (preset) {
    lines.push(`Atmosphere: ${preset.label} — ${preset.description}`);
  }
  if (draft.colors.length > 0) {
    lines.push(`Colors: ${draft.colors.map((c) => `${c.name} (${c.hex}) for ${c.usage.toLowerCase()}`).join("; ")}`);
  }
  lines.push("");
  lines.push(`Now generate: ${screen.prompt}`);

  return lines.join("\n");
}

export function generateExportBundle(draft: DesignToShipDraft): Record<string, string> {
  const bundle: Record<string, string> = {};

  if (draft.shipConfig.includeDesignMd) {
    bundle["DESIGN.md"] = generateDesignMd(draft);
  }

  if (draft.shipConfig.includeClaudeMd) {
    bundle["CLAUDE.md"] = generateProjectClaudeMd(draft);
  }

  if (draft.shipConfig.includePersonas && draft.team.length > 0) {
    bundle["docs/team.md"] = generateTeamExport(draft);
  }

  // Screen prompts
  draft.screens.forEach((s) => {
    bundle[`screens/${s.name.toLowerCase().replace(/\s+/g, "-")}.prompt.md`] =
      generateScreenPrompt(s, draft);
  });

  return bundle;
}

function generateProjectClaudeMd(draft: DesignToShipDraft): string {
  const lines: string[] = [];
  lines.push(`# ${draft.projectName || "Project"} -- Agent Instructions\n`);
  lines.push(`> Generated by Design-to-Ship Kit\n`);

  if (draft.description) {
    lines.push("## Project Overview\n");
    lines.push(draft.description + "\n");
    if (draft.targetUser) lines.push(`**Target User:** ${draft.targetUser}\n`);
  }

  lines.push("## Design System\n");
  lines.push("See [DESIGN.md](./DESIGN.md) for the visual design system.");
  lines.push("Consult this file before building any UI component.\n");

  if (draft.techChoices.length > 0) {
    lines.push("## Tech Stack\n");
    draft.techChoices.forEach((tc) => {
      const cat = TECH_CATEGORIES.find((c) => c.id === tc.category);
      lines.push(`- **${cat?.label || tc.category}:** ${tc.choice}`);
    });
    lines.push("");
  }

  if (draft.team.length > 0) {
    lines.push("## Persona Team\n");
    lines.push("| Role | Modeled After | Focus |");
    lines.push("|------|---------------|-------|");
    draft.team.forEach((t) => {
      lines.push(`| ${t.role} | ${t.company || "\u2014"} | ${t.focus || "\u2014"} |`);
    });
    lines.push("");
  }

  lines.push("## Consultation Rules\n");
  lines.push("1. **Before building any UI:** Read DESIGN.md, consult UI/UX persona");
  lines.push("2. **Feature planning:** Consult Product Lead + domain persona");
  lines.push("3. **Design tokens:** Only use colors/fonts from DESIGN.md, never hardcode");
  lines.push("4. **New patterns:** Consult UI/UX persona, then update DESIGN.md");
  lines.push("5. **Deadlock:** Follow Consensus Protocol (67% majority or CEO tiebreak)\n");

  lines.push("---\n");
  lines.push(`*Generated on ${new Date().toISOString().split("T")[0]}*`);

  return lines.join("\n");
}

function generateTeamExport(draft: DesignToShipDraft): string {
  const lines: string[] = [];
  lines.push(`# Team: ${draft.projectName || "Project"}\n`);
  lines.push("| Role | Modeled After | Focus |");
  lines.push("|------|---------------|-------|");
  draft.team.forEach((t) => {
    lines.push(`| ${t.role} | ${t.company || "\u2014"} | ${t.focus || "\u2014"} |`);
  });
  lines.push("");
  draft.team.forEach((t) => {
    lines.push(`## ${t.role}`);
    if (t.company) lines.push(`> Modeled after: **${t.company}**`);
    if (t.focus) lines.push(`\nFocus: ${t.focus}`);
    if (t.triggers.length > 0) {
      lines.push("\n**Consult when:**");
      t.triggers.forEach((tr) => lines.push(`- ${tr}`));
    }
    lines.push("");
  });
  return lines.join("\n");
}

/* ── Re-exports ── */
export { PROJECT_TYPES, TECH_CATEGORIES } from "./launch-kit";
