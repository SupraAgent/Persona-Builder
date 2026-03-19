"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  SKILL_TARGETS,
  type SkillTarget,
  type ChecklistItem,
  type AutoresearchLoopResult,
  type AutoresearchRound,
} from "@/lib/auto-research";

export function ChecklistPanel() {
  const [backend, setBackend] = React.useState<"anthropic" | "ollama">("anthropic");
  const [model, setModel] = React.useState("claude-sonnet-4-6");
  const [selectedTarget, setSelectedTarget] = React.useState<SkillTarget | null>(null);
  const [outputToScore, setOutputToScore] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<AutoresearchLoopResult | null>(null);
  const [rounds, setRounds] = React.useState<AutoresearchRound[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  async function runScoring() {
    if (!selectedTarget || !outputToScore) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          backend,
          model,
          skillTargetId: selectedTarget.id,
          outputToScore,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      const data: AutoresearchLoopResult = await res.json();
      setResult(data);

      // Track as a round
      setRounds((prev) => [
        ...prev,
        {
          round: prev.length + 1,
          changeDescription: prev.length === 0 ? "Baseline" : "Re-scored after change",
          previousScore: prev.length > 0 ? prev[prev.length - 1].newScore : 0,
          newScore: data.score,
          kept: true,
          failedItems: data.failedItems,
        },
      ]);
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
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => { setBackend("anthropic"); setModel("claude-sonnet-4-6"); }}
            className={`rounded-xl border p-4 text-left transition cursor-pointer ${
              backend === "anthropic" ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="text-sm font-medium text-foreground">Claude API</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Best quality. Requires ANTHROPIC_API_KEY</div>
          </button>
          <button
            type="button"
            onClick={() => { setBackend("ollama"); setModel("llama3.1"); }}
            className={`rounded-xl border p-4 text-left transition cursor-pointer ${
              backend === "ollama" ? "border-primary/60 bg-primary/10" : "border-white/10 bg-white/[0.02] hover:border-white/20"
            }`}
          >
            <div className="text-sm font-medium text-foreground">Ollama (Local GPU)</div>
            <div className="mt-0.5 text-xs text-muted-foreground">Free, private. Requires Ollama running.</div>
          </button>
        </div>
        <div className="mt-3">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Model</label>
          {backend === "anthropic" ? (
            <div className="flex gap-2">
              {["claude-sonnet-4-6", "claude-haiku-4-5", "claude-opus-4-6"].map((m) => (
                <button key={m} type="button" onClick={() => setModel(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    model === m ? "border-primary/60 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {m.replace("claude-", "").replace("-4-6", " 4.6").replace("-4-5", " 4.5")}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {["llama3.1", "llama3.1:70b", "mistral", "mixtral", "qwen2.5"].map((m) => (
                <button key={m} type="button" onClick={() => setModel(m)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    model === m ? "border-primary/60 bg-primary/10 text-primary" : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Skill Target Selection */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Skill Target</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select which skill output to score against its checklist.
        </p>
        <div className="mt-3 space-y-2">
          {SKILL_TARGETS.map((target) => (
            <button
              key={target.id}
              type="button"
              onClick={() => setSelectedTarget(target)}
              className={`w-full rounded-xl border p-3 text-left transition cursor-pointer ${
                selectedTarget?.id === target.id
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-foreground">{target.label}</div>
                <span className="text-[10px] text-muted-foreground">{target.checklist.length} checks</span>
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{target.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Checklist Preview */}
      {selectedTarget && (
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-2">Checklist: {selectedTarget.label}</h3>
          <div className="space-y-1">
            {selectedTarget.checklist.map((item, i) => (
              <div key={item.id} className="flex items-start gap-2 text-xs">
                <span className="text-muted-foreground w-4 text-right">{i + 1}.</span>
                <span className="text-foreground flex-1">{item.question}</span>
                <span className="text-muted-foreground italic">{item.catches}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Output to Score */}
      <div>
        <h2 className="text-lg font-semibold text-foreground">Output to Score</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the output you want to evaluate against the checklist.
        </p>
        <Textarea
          value={outputToScore}
          onChange={(e) => setOutputToScore(e.target.value)}
          placeholder="Paste the persona profile, CLAUDE.md, project brief, or any skill output here..."
          className="mt-3 min-h-[150px] font-mono text-xs"
        />
      </div>

      {/* Run */}
      <div className="flex items-center gap-3">
        <Button
          onClick={runScoring}
          disabled={loading || !selectedTarget || !outputToScore}
          size="lg"
        >
          {loading ? "Scoring..." : rounds.length === 0 ? "Run Baseline" : "Re-Score"}
        </Button>
        {loading && (
          <span className="text-xs text-muted-foreground animate-pulse">
            Running checklist evaluation...
          </span>
        )}
      </div>

      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4">
          <div className="text-sm font-medium text-red-400">Error</div>
          <div className="mt-1 text-xs text-red-300">{error}</div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6 border-t border-white/10 pt-6">
          {/* Score */}
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.02]">
              <span className={`text-3xl font-bold ${result.score >= 80 ? "text-green-400" : result.score >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                {result.score}%
              </span>
            </div>
            <div>
              <div className="text-lg font-semibold text-foreground">Checklist Score</div>
              <div className="text-sm text-muted-foreground">
                {result.results.filter((r) => r.passed).length}/{result.results.length} checks passed
              </div>
            </div>
          </div>

          {/* Per-check results */}
          <div className="space-y-1.5">
            {result.results.map((r, i) => (
              <div key={i} className={`flex items-start gap-2 rounded-lg border p-2.5 ${
                r.passed ? "border-green-500/20 bg-green-500/[0.03]" : "border-red-500/20 bg-red-500/[0.03]"
              }`}>
                <span className={`text-sm mt-0.5 ${r.passed ? "text-green-400" : "text-red-400"}`}>
                  {r.passed ? "\u2713" : "\u2717"}
                </span>
                <span className="text-xs text-foreground flex-1">{r.question}</span>
              </div>
            ))}
          </div>

          {/* Suggested improvement */}
          {result.suggestedChange && result.failedItems.length > 0 && (
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
              <div className="text-sm font-medium text-blue-400 mb-1">Suggested Change (ONE)</div>
              <div className="text-xs text-foreground">{result.suggestedChange}</div>
              <p className="mt-2 text-[10px] text-muted-foreground">
                Apply this change to your skill, paste the new output, and re-score to see if it improves.
              </p>
            </div>
          )}

          {/* Round history */}
          {rounds.length > 1 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-2">Round History</h3>
              <div className="space-y-1">
                {rounds.map((r) => (
                  <div key={r.round} className="flex items-center gap-3 text-xs">
                    <span className="text-muted-foreground w-16">Round {r.round}</span>
                    <span className={`font-medium ${r.newScore >= 80 ? "text-green-400" : r.newScore >= 60 ? "text-yellow-400" : "text-red-400"}`}>
                      {r.newScore}%
                    </span>
                    {r.round > 1 && (
                      <span className={r.newScore > r.previousScore ? "text-green-400" : r.newScore < r.previousScore ? "text-red-400" : "text-muted-foreground"}>
                        ({r.newScore > r.previousScore ? "+" : ""}{r.newScore - r.previousScore}%)
                      </span>
                    )}
                    <span className="text-muted-foreground">{r.changeDescription}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
