"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { AutoResearchResult, PersonaScorecard, TeamGap } from "@/lib/auto-research";

type PersonaInput = {
  name: string;
  role: string;
  company: string;
  systemPrompt: string;
  style?: string;
};

export function ResearchPanel() {
  const [backend, setBackend] = React.useState<"anthropic" | "ollama">("anthropic");
  const [model, setModel] = React.useState("claude-sonnet-4-6");
  const [projectContext, setProjectContext] = React.useState("");
  const [sampleDecision, setSampleDecision] = React.useState("");
  const [personas, setPersonas] = React.useState<PersonaInput[]>([
    { name: "", role: "", company: "", systemPrompt: "", style: "" },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AutoResearchResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  function addPersona() {
    setPersonas([...personas, { name: "", role: "", company: "", systemPrompt: "", style: "" }]);
  }

  function removePersona(i: number) {
    setPersonas(personas.filter((_, idx) => idx !== i));
  }

  function updatePersona(i: number, patch: Partial<PersonaInput>) {
    const next = [...personas];
    next[i] = { ...next[i], ...patch };
    setPersonas(next);
  }

  async function runResearch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backend,
          model,
          projectContext,
          personas: personas.filter((p) => p.name && p.role),
          sampleDecision: sampleDecision || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data: AutoResearchResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Backend Selection */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Compute Backend</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose where to run the research — Claude API (cloud) or Ollama (your GPU).
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setBackend("anthropic"); setModel("claude-sonnet-4-6"); }}
            className={`rounded-xl border p-4 text-left transition cursor-pointer ${
              backend === "anthropic"
                ? "border-primary/60 bg-primary/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="text-sm font-medium text-foreground">Claude API</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Best quality. Requires ANTHROPIC_API_KEY in .env.local
            </div>
          </button>
          <button
            type="button"
            onClick={() => { setBackend("ollama"); setModel("llama3.1"); }}
            className={`rounded-xl border p-4 text-left transition cursor-pointer ${
              backend === "ollama"
                ? "border-primary/60 bg-primary/10"
                : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="text-sm font-medium text-foreground">Ollama (Local GPU)</div>
            <div className="mt-0.5 text-xs text-muted-foreground">
              Free, private. Requires Ollama running locally.
            </div>
          </button>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Model</label>
          {backend === "anthropic" ? (
            <div className="flex gap-2">
              {["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-6"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    model === m
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {m.replace("claude-", "").replace("-4-6", " 4.6").replace("-4-5", " 4.5")}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {["llama3.1", "llama3.1:70b", "mistral", "mixtral", "qwen2.5"].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setModel(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    model === m
                      ? "border-primary/60 bg-primary/10 text-primary"
                      : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Project Context */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Project Context</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the project so the research can evaluate personas against it.
        </p>
        <Textarea
          value={projectContext}
          onChange={(e) => setProjectContext(e.target.value)}
          placeholder="e.g. A mobile-first learning app for language learners. Target market: 18-35 year olds. Competing with Duolingo and Babbel. Freemium model with premium subscription."
          className="mt-3 min-h-[100px]"
        />
      </div>

      {/* Personas */}
      <div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Personas to Evaluate</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add personas — the research will score, find gaps, and suggest improvements.
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={addPersona} className="text-xs">
            + Add persona
          </Button>
        </div>
        <div className="mt-3 space-y-3">
          {personas.map((p, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">Persona {i + 1}</span>
                {personas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePersona(i)}
                    className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  value={p.name}
                  onChange={(e) => updatePersona(i, { name: e.target.value })}
                  placeholder="Name"
                  className="text-sm"
                />
                <Input
                  value={p.role}
                  onChange={(e) => updatePersona(i, { role: e.target.value })}
                  placeholder="Role (e.g. CTO)"
                  className="text-sm"
                />
                <Input
                  value={p.company}
                  onChange={(e) => updatePersona(i, { company: e.target.value })}
                  placeholder="Company"
                  className="text-sm"
                />
              </div>
              <Textarea
                value={p.systemPrompt}
                onChange={(e) => updatePersona(i, { systemPrompt: e.target.value })}
                placeholder="System prompt or background description..."
                className="min-h-[60px] text-xs"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Sample Decision */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Consensus Simulation (Optional)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pose a decision and see how the personas would debate and vote.
        </p>
        <Input
          value={sampleDecision}
          onChange={(e) => setSampleDecision(e.target.value)}
          placeholder="e.g. Should we use React Native or Flutter for the mobile app?"
          className="mt-3"
        />
      </div>

      {/* Run Button */}
      <div className="flex items-center gap-3">
        <Button
          onClick={runResearch}
          disabled={loading || !projectContext || personas.filter((p) => p.name && p.role).length === 0}
          size="lg"
        >
          {loading ? "Running Research..." : "Run Auto-Research"}
        </Button>
        {loading && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Calling {backend === "anthropic" ? "Claude API" : "Ollama"} — this may take 30-60s...
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-sm font-medium text-red-400">Error</div>
          <div className="mt-1 text-xs text-red-300">{error}</div>
        </div>
      )}

      {/* Results */}
      {result && <ResearchResults result={result} />}
    </div>
  );
}

function ResearchResults({ result }: { result: AutoResearchResult }) {
  return (
    <div className="space-y-6 border-t border-white/10 pt-6">
      {/* Team Score */}
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
          <span className={`text-3xl font-bold ${scoreColor(result.teamScore)}`}>
            {result.teamScore}
          </span>
        </div>
        <div>
          <div className="text-lg font-semibold text-foreground">Team Score</div>
          <div className="text-sm text-muted-foreground">
            Average across all personas ({result.scorecards.length} evaluated)
          </div>
        </div>
      </div>

      {/* Individual Scorecards */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">Individual Scorecards</h3>
        <div className="space-y-3">
          {result.scorecards.map((card) => (
            <ScorecardCard key={card.personaName} card={card} />
          ))}
        </div>
      </div>

      {/* Gaps */}
      {result.gaps.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Team Gaps</h3>
          <div className="space-y-2">
            {result.gaps.map((gap, i) => (
              <GapCard key={i} gap={gap} />
            ))}
          </div>
        </div>
      )}

      {/* Consensus Simulation */}
      {result.consensusSimulation && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">Consensus Simulation</h3>
          <ConsensusCard sim={result.consensusSimulation} />
        </div>
      )}
    </div>
  );
}

function ScorecardCard({ card }: { card: PersonaScorecard }) {
  const [expanded, setExpanded] = React.useState(false);
  const metrics = [
    { label: "Relevance", value: card.scores.relevance },
    { label: "Specificity", value: card.scores.specificity },
    { label: "Coverage", value: card.scores.coverage },
    { label: "Differentiation", value: card.scores.differentiation },
    { label: "Actionability", value: card.scores.actionability },
  ];

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition"
      >
        <div className="flex items-center gap-3">
          <span className={`text-xl font-bold ${scoreColor(card.overall)}`}>
            {card.overall}
          </span>
          <span className="text-sm font-medium text-foreground">{card.personaName}</span>
        </div>
        <svg
          className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>
      {expanded && (
        <div className="border-t border-white/10 px-4 py-4 space-y-4">
          {/* Score bars */}
          <div className="space-y-2">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center gap-3">
                <span className="w-28 text-xs text-muted-foreground">{m.label}</span>
                <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${barColor(m.value)}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <span className={`w-8 text-xs font-medium text-right ${scoreColor(m.value)}`}>
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {card.strengths.length > 0 && (
            <div>
              <div className="text-xs font-medium text-green-400 mb-1">Strengths</div>
              <ul className="space-y-0.5">
                {card.strengths.map((s, i) => (
                  <li key={i} className="text-xs text-muted-foreground">+ {s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Weaknesses */}
          {card.weaknesses.length > 0 && (
            <div>
              <div className="text-xs font-medium text-red-400 mb-1">Weaknesses</div>
              <ul className="space-y-0.5">
                {card.weaknesses.map((w, i) => (
                  <li key={i} className="text-xs text-muted-foreground">- {w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvements */}
          {card.improvements.length > 0 && (
            <div>
              <div className="text-xs font-medium text-blue-400 mb-1">Suggested Improvements</div>
              <ul className="space-y-0.5">
                {card.improvements.map((imp, i) => (
                  <li key={i} className="text-xs text-muted-foreground">{imp}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GapCard({ gap }: { gap: TeamGap }) {
  const severityColors = {
    critical: "border-red-500/30 bg-red-500/5",
    moderate: "border-yellow-500/30 bg-yellow-500/5",
    minor: "border-blue-500/30 bg-blue-500/5",
  };
  const severityText = {
    critical: "text-red-400",
    moderate: "text-yellow-400",
    minor: "text-blue-400",
  };

  return (
    <div className={`rounded-xl border p-3 ${severityColors[gap.severity]}`}>
      <div className="flex items-center gap-2">
        <span className={`text-xs font-medium uppercase ${severityText[gap.severity]}`}>
          {gap.severity}
        </span>
        <span className="text-sm font-medium text-foreground">{gap.area}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">{gap.suggestion}</div>
    </div>
  );
}

function ConsensusCard({ sim }: { sim: NonNullable<AutoResearchResult["consensusSimulation"]> }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
      <div>
        <div className="text-xs font-medium text-muted-foreground">Decision</div>
        <div className="text-sm font-medium text-foreground mt-1">{sim.decision}</div>
      </div>

      <div className="space-y-2">
        {sim.votes.map((vote, i) => (
          <div key={i} className="flex items-start gap-3 py-2 border-t border-white/5">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{vote.personaName}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                  vote.confidence === "high"
                    ? "bg-green-500/10 text-green-400"
                    : vote.confidence === "medium"
                      ? "bg-yellow-500/10 text-yellow-400"
                      : "bg-red-500/10 text-red-400"
                }`}>
                  {vote.confidence}
                </span>
              </div>
              <div className="text-xs text-primary mt-0.5">{vote.position}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{vote.reasoning}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-3">
        <div className="text-xs font-medium text-foreground">Outcome: {sim.outcome}</div>
        {sim.insights.length > 0 && (
          <div className="mt-2 space-y-1">
            {sim.insights.map((insight, i) => (
              <div key={i} className="text-xs text-muted-foreground">
                {insight}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function scoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 60) return "text-yellow-400";
  if (score >= 40) return "text-orange-400";
  return "text-red-400";
}

function barColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
}
