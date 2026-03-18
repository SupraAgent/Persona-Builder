/** Agent Persona Builder types and constants */

export type AgentRole = {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  category: "leadership" | "product" | "engineering" | "growth" | "operations";
};

export const AGENT_ROLES: AgentRole[] = [
  { id: "ceo", title: "Chief Executive Officer", shortDescription: "Vision, strategy, company direction", icon: "crown", category: "leadership" },
  { id: "cto", title: "Chief Technology Officer", shortDescription: "Tech stack, architecture, engineering culture", icon: "cpu", category: "leadership" },
  { id: "cpo", title: "Chief Product Officer", shortDescription: "Product vision, roadmap, user value", icon: "compass", category: "leadership" },
  { id: "cmo", title: "Chief Marketing Officer", shortDescription: "Brand, positioning, go-to-market", icon: "megaphone", category: "leadership" },
  { id: "cfo", title: "Chief Financial Officer", shortDescription: "Unit economics, runway, pricing", icon: "chart", category: "leadership" },
  { id: "cro", title: "Chief Revenue Officer", shortDescription: "Revenue growth, sales strategy, monetization", icon: "trending", category: "leadership" },
  { id: "cdo", title: "Chief Design Officer", shortDescription: "Design systems, UX vision, brand identity", icon: "palette", category: "leadership" },
  { id: "retention", title: "Chief Retention Officer", shortDescription: "User retention, engagement loops, churn reduction", icon: "magnet", category: "leadership" },
  { id: "pm", title: "Product Manager", shortDescription: "Feature prioritization, user stories, shipping", icon: "clipboard", category: "product" },
  { id: "ux_researcher", title: "UX Researcher", shortDescription: "User interviews, usability, behavioral insights", icon: "search", category: "product" },
  { id: "product_analyst", title: "Product Analyst", shortDescription: "Metrics, funnels, A/B testing", icon: "bar-chart", category: "product" },
  { id: "staff_eng", title: "Staff Engineer", shortDescription: "System design, code quality, technical leadership", icon: "code", category: "engineering" },
  { id: "qa_lead", title: "QA Lead", shortDescription: "Test strategy, quality gates, regression prevention", icon: "shield", category: "engineering" },
  { id: "devops", title: "DevOps Engineer", shortDescription: "CI/CD, infra, deployment reliability", icon: "server", category: "engineering" },
  { id: "security", title: "Security Engineer", shortDescription: "Threat modeling, audits, vulnerability management", icon: "lock", category: "engineering" },
  { id: "growth_lead", title: "Growth Lead", shortDescription: "Acquisition, activation, viral loops", icon: "rocket", category: "growth" },
  { id: "content", title: "Content Strategist", shortDescription: "Content marketing, SEO, developer relations", icon: "pen", category: "growth" },
  { id: "community", title: "Community Manager", shortDescription: "Developer community, feedback loops, advocacy", icon: "users", category: "growth" },
  { id: "ops", title: "Operations Manager", shortDescription: "Process efficiency, team velocity, bottleneck removal", icon: "settings", category: "operations" },
  { id: "data_analyst", title: "Data Analyst", shortDescription: "Dashboards, KPIs, data-driven decisions", icon: "database", category: "operations" },
];

export const ROLE_CATEGORIES: { id: AgentRole["category"]; label: string }[] = [
  { id: "leadership", label: "Leadership" },
  { id: "product", label: "Product" },
  { id: "engineering", label: "Engineering" },
  { id: "growth", label: "Growth" },
  { id: "operations", label: "Operations" },
];

export type CommunicationStyle = {
  id: string;
  label: string;
  description: string;
};

export const COMMUNICATION_STYLES: CommunicationStyle[] = [
  { id: "data_driven", label: "Data-Driven", description: "Leads with metrics and evidence. Every recommendation backed by numbers." },
  { id: "first_principles", label: "First Principles", description: "Breaks problems down to fundamentals. Questions assumptions." },
  { id: "user_obsessed", label: "User-Obsessed", description: "Everything starts and ends with the user experience." },
  { id: "move_fast", label: "Move Fast", description: "Bias for action. Ship, measure, iterate. Perfect is the enemy of done." },
  { id: "systems_thinker", label: "Systems Thinker", description: "Sees interconnections and second-order effects. Optimizes the whole." },
  { id: "creative", label: "Creative", description: "Lateral thinking, novel approaches, challenges conventional wisdom." },
  { id: "methodical", label: "Methodical", description: "Structured, thorough, process-oriented. Minimizes risk through rigor." },
  { id: "collaborative", label: "Collaborative", description: "Cross-functional alignment, consensus building, team empowerment." },
];

export type AgentVisibility = "personal" | "company";

export const VISIBILITY_OPTIONS: { id: AgentVisibility; label: string; description: string }[] = [
  { id: "personal", label: "Personal", description: "Only visible to you. Tokens and API keys stay private." },
  { id: "company", label: "Company", description: "Visible to all team members. Shared identity across the org." },
];

export type AgentSkill = {
  id: string;
  label: string;
  description: string;
  category: "code" | "deploy" | "review" | "communicate" | "analyze" | "blockchain";
};

export const AGENT_SKILLS: AgentSkill[] = [
  { id: "code_review", label: "Code Review", description: "Read PRs and commits, leave inline review comments", category: "code" },
  { id: "write_code", label: "Write Code", description: "Create branches, commit code changes, open PRs", category: "code" },
  { id: "refactor", label: "Refactor", description: "Identify and execute code refactoring opportunities", category: "code" },
  { id: "deploy", label: "Deploy", description: "Trigger deployments and monitor build status", category: "deploy" },
  { id: "rollback", label: "Rollback", description: "Revert to previous deployments when issues are detected", category: "deploy" },
  { id: "preview", label: "Preview Builds", description: "Create and manage preview deployments for branches", category: "deploy" },
  { id: "score_builds", label: "Score Builds", description: "Evaluate deployment quality and assign scores", category: "review" },
  { id: "security_audit", label: "Security Audit", description: "Scan code for vulnerabilities and security issues", category: "review" },
  { id: "perf_review", label: "Performance Review", description: "Analyze and report on application performance", category: "review" },
  { id: "report", label: "Status Reports", description: "Generate summaries of team activity and progress", category: "communicate" },
  { id: "notify", label: "Notifications", description: "Alert team members about important events", category: "communicate" },
  { id: "metrics", label: "Track Metrics", description: "Monitor KPIs and flag anomalies", category: "analyze" },
  { id: "experiment", label: "Run Experiments", description: "Execute A/B tests and evaluate results", category: "analyze" },
  { id: "move_query", label: "Move VM Queries", description: "Read accounts, resources, modules via Supra Move VM", category: "blockchain" },
  { id: "move_tx", label: "Move Transactions", description: "Simulate and execute Move entry functions", category: "blockchain" },
  { id: "evm_query", label: "EVM Queries", description: "Read balances, contracts, tokens on Supra EVM", category: "blockchain" },
  { id: "evm_tx", label: "EVM Transactions", description: "Write to contracts, transfer tokens on Supra EVM", category: "blockchain" },
  { id: "autofi", label: "AutoFi", description: "Query and manage automated on-chain tasks", category: "blockchain" },
  { id: "oracle_dora", label: "dORA Oracle", description: "Read price feeds and oracle data via Supra dORA", category: "blockchain" },
  { id: "staking", label: "Staking", description: "Query validator sets, delegation stakes", category: "blockchain" },
  { id: "digital_assets", label: "Digital Assets", description: "Query collections, token ownership, metadata", category: "blockchain" },
  { id: "smart_contract_audit", label: "Contract Audit", description: "Review Move smart contracts for vulnerabilities", category: "blockchain" },
];

export const SKILL_CATEGORIES: { id: AgentSkill["category"]; label: string }[] = [
  { id: "code", label: "Code" },
  { id: "deploy", label: "Deploy" },
  { id: "review", label: "Review" },
  { id: "communicate", label: "Communicate" },
  { id: "analyze", label: "Analyze" },
  { id: "blockchain", label: "Blockchain" },
];

export type LLMProvider = {
  id: string;
  label: string;
  description: string;
  models: { id: string; label: string; context: string }[];
};

export const LLM_PROVIDERS: LLMProvider[] = [
  { id: "anthropic", label: "Anthropic", description: "Claude models. Strong reasoning, long context.", models: [{ id: "claude-opus-4-6", label: "Claude Opus 4.6", context: "200k" }, { id: "claude-sonnet-4-6", label: "Claude Sonnet 4.6", context: "200k" }, { id: "claude-haiku-4-5", label: "Claude Haiku 4.5", context: "200k" }] },
  { id: "openai", label: "OpenAI", description: "GPT models. Broad ecosystem, vision.", models: [{ id: "gpt-4o", label: "GPT-4o", context: "128k" }, { id: "gpt-4o-mini", label: "GPT-4o Mini", context: "128k" }, { id: "o3", label: "o3", context: "200k" }, { id: "o3-mini", label: "o3 Mini", context: "200k" }] },
  { id: "google", label: "Google", description: "Gemini models. Multimodal, long context.", models: [{ id: "gemini-2.5-pro", label: "Gemini 2.5 Pro", context: "1M" }, { id: "gemini-2.5-flash", label: "Gemini 2.5 Flash", context: "1M" }] },
  { id: "mistral", label: "Mistral", description: "Open-weight models. Fast, multilingual.", models: [{ id: "mistral-large", label: "Mistral Large", context: "128k" }, { id: "codestral", label: "Codestral", context: "256k" }] },
  { id: "groq", label: "Groq", description: "Ultra-fast inference. LPU hardware.", models: [{ id: "llama-3.3-70b", label: "Llama 3.3 70B", context: "128k" }, { id: "mixtral-8x7b", label: "Mixtral 8x7B", context: "32k" }] },
  { id: "xai", label: "xAI", description: "Grok models. Real-time knowledge.", models: [{ id: "grok-3", label: "Grok 3", context: "131k" }, { id: "grok-3-mini", label: "Grok 3 Mini", context: "131k" }] },
];

export type AgentPersona = {
  role: AgentRole | null;
  customRole: string;
  visibility: AgentVisibility;
  focusArea: string;
  inspirations: string[];
  communicationStyle: CommunicationStyle | null;
  principles: string[];
  skills: string[];
  llmProvider: string;
  llmModel: string;
  northStar: string;
  displayName: string;
};

export function createEmptyPersona(): AgentPersona {
  return { role: null, customRole: "", visibility: "company", focusArea: "", inspirations: [], communicationStyle: null, principles: [], skills: [], llmProvider: "anthropic", llmModel: "claude-sonnet-4-6", northStar: "", displayName: "" };
}

export const BUILDER_STEPS = [
  { step: 1, title: "Role", description: "What position does this agent hold?" },
  { step: 2, title: "Visibility", description: "Personal or company-wide?" },
  { step: 3, title: "Focus", description: "What specifically do they optimize for?" },
  { step: 4, title: "Inspirations", description: "Which companies embody their philosophy?" },
  { step: 5, title: "Style", description: "How do they think and communicate?" },
  { step: 6, title: "Principles", description: "What core beliefs guide their decisions?" },
  { step: 7, title: "Skills", description: "What can this agent do?" },
  { step: 8, title: "Model", description: "Which LLM powers this agent?" },
  { step: 9, title: "Review", description: "Review and generate North Star" },
] as const;

export function generateAgentNorthStar(persona: AgentPersona): string {
  const role = persona.role?.title ?? persona.customRole ?? "Agent";
  const focus = persona.focusArea || "delivering value";
  const style = persona.communicationStyle?.label ?? "balanced";
  const principles = persona.principles.slice(0, 2).join(" and ") || "quality and impact";
  return `As a ${role} with a ${style.toLowerCase()} approach, drive ${focus} by grounding every decision in ${principles}. Continuously evaluate impact, adapt to new information, and maintain the highest standards of execution.`;
}

export function agentPersonaToSupabase(persona: AgentPersona) {
  const role = persona.role?.title ?? persona.customRole;
  const systemPrompt = generateAgentSystemPrompt(persona);
  return {
    name: persona.displayName || role || "Agent",
    role: role || "",
    system_prompt: systemPrompt.slice(0, 2000),
    capabilities: persona.skills.length > 0 ? persona.skills : ["scoring"],
    output_format: "structured_report",
    review_focus: ["general"],
    scoring_weights: null,
    icon: persona.role?.icon === "crown" ? "\uD83D\uDC54" : persona.role?.icon === "code" ? "\uD83D\uDD27" : persona.role?.icon === "shield" ? "\uD83E\uDDEA" : persona.role?.icon === "rocket" ? "\uD83D\uDE80" : persona.role?.icon === "palette" ? "\uD83C\uDFA8" : persona.role?.icon === "lock" ? "\uD83D\uDD12" : "\uD83E\uDD16",
  };
}

function generateAgentSystemPrompt(persona: AgentPersona): string {
  const parts: string[] = [];
  const role = persona.role?.title ?? persona.customRole;
  if (role) parts.push(`You are a ${role}.`);
  if (persona.focusArea) parts.push(persona.focusArea);
  if (persona.communicationStyle) parts.push(`\nCommunication style: ${persona.communicationStyle.label} -- ${persona.communicationStyle.description}`);
  if (persona.principles.length > 0) { parts.push("\nCore principles:"); persona.principles.forEach(p => parts.push(`- ${p}`)); }
  if (persona.inspirations.length > 0) parts.push(`\nInspired by: ${persona.inspirations.join(", ")}`);
  if (persona.northStar) parts.push(`\nNorth Star: ${persona.northStar}`);
  return parts.join("\n");
}
