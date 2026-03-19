import { NextRequest, NextResponse } from "next/server";
import { listDocs, type DocMeta } from "@/lib/docs-api";

export type PaperclipAgent = {
  id: string;
  name: string;
  role: string;
  company: string;
  description: string;
  systemPrompt: string;
  heartbeatMinutes: number;
  monthlyBudgetUsd: number;
  reportsTo: string | null;
  triggers: string[];
  sourceFile: string;
};

export type PaperclipOrgChart = {
  companyName: string;
  mission: string;
  agents: PaperclipAgent[];
  exportedAt: string;
};

/** Convert persona frontmatter + content into a Paperclip agent definition */
function personaToAgent(doc: DocMeta): PaperclipAgent | null {
  const fm = doc.frontmatter;
  if (!fm.name && !fm.role) return null;

  const name = String(fm.name || doc.filename.replace(".md", ""));
  const role = String(fm.role || "Advisor");
  const company = String(fm.company || fm.organization || "");

  // Build system prompt from persona content
  const systemPrompt = [
    `You are ${name}, ${role}${company ? ` at ${company}` : ""}.`,
    fm.experience ? `You have ${fm.experience}.` : "",
    doc.content.slice(0, 2000),
  ]
    .filter(Boolean)
    .join("\n\n");

  // Extract triggers from frontmatter
  const triggers: string[] = Array.isArray(fm.triggers)
    ? fm.triggers.map(String)
    : typeof fm.triggers === "string"
      ? [fm.triggers]
      : [];

  return {
    id: doc.filename.replace(".md", "").toLowerCase().replace(/\s+/g, "-"),
    name,
    role,
    company,
    description: String(fm.description || `${role} persona`),
    systemPrompt,
    heartbeatMinutes: Number(fm.heartbeat_minutes) || 60,
    monthlyBudgetUsd: Number(fm.monthly_budget_usd) || 50,
    reportsTo: fm.reports_to ? String(fm.reports_to) : null,
    triggers,
    sourceFile: doc.path,
  };
}

/** GET — List personas mapped as Paperclip agents */
export async function GET() {
  try {
    const docs = await listDocs("docs/personas");
    const agents = docs
      .map(personaToAgent)
      .filter((a): a is PaperclipAgent => a !== null);

    return NextResponse.json({ agents, count: agents.length });
  } catch (err) {
    console.error("[api/paperclip] GET error:", err);
    return NextResponse.json({ error: "Failed to load personas" }, { status: 500 });
  }
}

/** POST — Generate full Paperclip org chart export */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      companyName = "My Company",
      mission = "",
      selectedAgentIds,
      heartbeatOverrides,
      budgetOverrides,
    } = body as {
      companyName?: string;
      mission?: string;
      selectedAgentIds?: string[];
      heartbeatOverrides?: Record<string, number>;
      budgetOverrides?: Record<string, number>;
    };

    const docs = await listDocs("docs/personas");
    let agents = docs
      .map(personaToAgent)
      .filter((a): a is PaperclipAgent => a !== null);

    // Filter to selected agents if specified
    if (selectedAgentIds && selectedAgentIds.length > 0) {
      agents = agents.filter((a) => selectedAgentIds.includes(a.id));
    }

    // Apply overrides
    agents = agents.map((agent) => ({
      ...agent,
      heartbeatMinutes: heartbeatOverrides?.[agent.id] ?? agent.heartbeatMinutes,
      monthlyBudgetUsd: budgetOverrides?.[agent.id] ?? agent.monthlyBudgetUsd,
    }));

    const orgChart: PaperclipOrgChart = {
      companyName,
      mission,
      agents,
      exportedAt: new Date().toISOString(),
    };

    return NextResponse.json(orgChart);
  } catch (err) {
    console.error("[api/paperclip] POST error:", err);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
