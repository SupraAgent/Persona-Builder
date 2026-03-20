"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  simulateRound,
  applyRound,
  calcWeightedOverall,
  type ImprovementDraft,
} from "@/lib/improvement";

type Props = {
  draft: ImprovementDraft;
  onChange: (patch: Partial<ImprovementDraft>) => void;
};

const PRIORITY_COLORS: Record<string, string> = {
  CRITICAL: "border-red-500/30 bg-red-500/10 text-red-400",
  HIGH: "border-orange-500/30 bg-orange-500/10 text-orange-400",
  MED: "border-yellow-500/30 bg-yellow-500/10 text-yellow-400",
  LOW: "border-green-500/30 bg-green-500/10 text-green-400",
};

export function StepImprove({ draft, onChange }: Props) {
  const [running, setRunning] = React.useState(false);

  const maxGap = Math.max(...draft.gapAnalysis.map((g) => g.gap), 0);
  const allGapsClosed = maxGap < 10;
  const maxRoundsReached = draft.currentRound >= 20;
  const isDone = allGapsClosed || maxRoundsReached;
  const overall = calcWeightedOverall(draft.consensusScores);

  async function runRound() {
    setRunning(true);
    // Small delay for visual feedback
    await new Promise((r) => setTimeout(r, 600));

    const round = simulateRound(draft);
    const updates = applyRound(draft, round);
    onChange(updates);
    setRunning(false);
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Improvement Loop
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Press the button. Your AI team picks the highest-impact change,
          implements it, and re-scores. Repeat until the gap closes.
        </p>
      </div>

      {/* Current status */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">Overall Score</p>
          <p className="mt-1 text-2xl font-bold text-primary tabular-nums">
            {overall}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">Largest Gap</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            {maxGap}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-center">
          <p className="text-xs text-muted-foreground">Rounds</p>
          <p className="mt-1 text-2xl font-bold text-foreground tabular-nums">
            {draft.currentRound}
            <span className="text-sm text-muted-foreground font-normal">
              /20
            </span>
          </p>
        </div>
      </div>

      {/* Gap summary */}
      <div className="flex flex-wrap gap-2">
        {draft.gapAnalysis
          .sort((a, b) => b.gap - a.gap)
          .map((item) => (
            <Badge key={item.category} className={PRIORITY_COLORS[item.priority] ?? ""}>
              {item.category}: -{item.gap}
            </Badge>
          ))}
      </div>

      {/* THE BUTTON */}
      <div className="flex flex-col items-center gap-3 py-4">
        {isDone ? (
          <div className="text-center space-y-3">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 text-3xl">
              {allGapsClosed ? "🎯" : "⏹️"}
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              {allGapsClosed
                ? "Target Reached!"
                : "Maximum Rounds Reached"}
            </h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {allGapsClosed
                ? `All gaps are below 10. Your app scores ${overall}/100 — competitive with the best in class.`
                : `After 20 rounds, your app scores ${overall}/100. Consider swapping personas or adjusting benchmarks.`}
            </p>
          </div>
        ) : (
          <Button
            size="lg"
            onClick={runRound}
            disabled={running || isDone}
            className="px-8 py-6 text-base font-semibold shadow-[0_0_20px_rgba(12,206,107,0.2)]"
          >
            {running ? (
              <span className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Team is working...
              </span>
            ) : (
              `Run Improvement Round ${draft.currentRound + 1}`
            )}
          </Button>
        )}
      </div>

      {/* Round log */}
      {draft.rounds.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Round Log</h3>
          <div className="space-y-3">
            {[...draft.rounds].reverse().map((round) => {
              const isRetro = round.number % 5 === 0;
              return (
                <React.Fragment key={round.number}>
                  {isRetro && (
                    <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                      <p className="text-sm font-medium text-primary">
                        🔄 Team Retro — Round {round.number}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {round.overallAfter - draft.rounds[0].overallBefore > 15
                          ? "Good progress. Team is converging effectively. Continuing with current lineup."
                          : "Progress is slow. Consider swapping a persona or adjusting reference benchmarks."}
                      </p>
                    </div>
                  )}
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] px-4 py-4 space-y-3">
                    {/* Round header */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Round {round.number}
                      </span>
                      <Badge
                        className={
                          round.scoreAfter > round.scoreBefore
                            ? "border-green-500/30 bg-green-500/10 text-green-400"
                            : "border-white/10 bg-white/5 text-muted-foreground"
                        }
                      >
                        +
                        {round.overallAfter - round.overallBefore} overall
                      </Badge>
                    </div>

                    {/* Decision */}
                    <p className="text-sm text-foreground">
                      <span className="text-muted-foreground">Decision: </span>
                      {round.decision}
                    </p>

                    {/* Proposed by */}
                    <p className="text-xs text-muted-foreground">
                      Proposed by {round.proposedByRole} — {round.categoryAffected}{" "}
                      gap was {round.scoreBefore < round.scoreAfter ? round.scoreAfter - round.scoreBefore + round.gapRemaining : "N/A"}
                    </p>

                    {/* Vote */}
                    <p className="text-xs text-muted-foreground">
                      Vote: {round.vote}
                    </p>

                    {/* Score impact */}
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">
                        {round.categoryAffected}:
                      </span>
                      <span className="tabular-nums">
                        <span className="text-muted-foreground">
                          {round.scoreBefore}
                        </span>
                        <span className="text-muted-foreground mx-1">→</span>
                        <span className="text-foreground font-medium">
                          {round.scoreAfter}
                        </span>
                        <span className="ml-1 text-green-400 text-xs">
                          (+{round.scoreAfter - round.scoreBefore})
                        </span>
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-muted-foreground">Overall:</span>
                      <span className="tabular-nums">
                        <span className="text-muted-foreground">
                          {round.overallBefore}
                        </span>
                        <span className="text-muted-foreground mx-1">→</span>
                        <span className="text-primary font-medium">
                          {round.overallAfter}
                        </span>
                      </span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Rules */}
      <div className="rounded-xl border border-white/5 bg-white/[0.01] px-4 py-3">
        <p className="text-xs font-medium text-muted-foreground mb-2">Rules</p>
        <ul className="text-xs text-muted-foreground space-y-1">
          <li>• One change per round — isolates impact</li>
          <li>• Score can&apos;t go down — revert if it does</li>
          <li>• No persona can be overruled 3 rounds in a row</li>
          <li>• Retro every 5 rounds — swap personas if not converging</li>
          <li>• Max 20 rounds per session</li>
        </ul>
      </div>
    </div>
  );
}
