"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import type { CategoryScore } from "@/lib/improvement";
import { calcWeightedOverall } from "@/lib/improvement";

type Props = {
  scores: CategoryScore[];
  onScoreChange: (
    categoryIndex: number,
    subIndex: number,
    value: number
  ) => void;
  readOnly?: boolean;
};

export function ScoringGrid({ scores, onScoreChange, readOnly }: Props) {
  const [expanded, setExpanded] = React.useState<number | null>(0);
  const overall = calcWeightedOverall(scores);

  return (
    <div className="space-y-2">
      {scores.map((cat, catIdx) => {
        const isOpen = expanded === catIdx;
        const hasScores = cat.subCriteria.some((sc) => sc.score > 0);

        return (
          <div
            key={cat.name}
            className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            {/* Category header */}
            <button
              onClick={() => setExpanded(isOpen ? null : catIdx)}
              className="flex w-full items-center gap-3 px-4 py-3 text-left cursor-pointer hover:bg-white/[0.02] transition"
            >
              <div className="flex-1 min-w-0">
                <span className="text-sm font-medium text-foreground">
                  {cat.name}
                </span>
              </div>
              <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-muted-foreground tabular-nums">
                {Math.round(cat.weight * 100)}%
              </span>
              {hasScores && (
                <span className="text-sm font-semibold text-primary tabular-nums min-w-[36px] text-right">
                  {cat.avg}
                </span>
              )}
              <svg
                className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </button>

            {/* Sub-criteria */}
            {isOpen && (
              <div className="border-t border-white/5 px-4 py-3 space-y-2">
                {cat.subCriteria.map((sc, scIdx) => (
                  <div
                    key={sc.name}
                    className="flex items-center gap-3"
                  >
                    <span className="flex-1 text-sm text-muted-foreground">
                      {sc.name}
                    </span>
                    {readOnly ? (
                      <span className="text-sm font-medium text-foreground tabular-nums w-12 text-right">
                        {sc.score}
                      </span>
                    ) : (
                      <Input
                        type="number"
                        min={0}
                        max={100}
                        step={5}
                        value={sc.score || ""}
                        onChange={(e) => {
                          const v = Math.max(
                            0,
                            Math.min(100, parseInt(e.target.value) || 0)
                          );
                          onScoreChange(catIdx, scIdx, v);
                        }}
                        className="w-20 h-8 text-center text-sm"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {/* Overall */}
      <div className="flex items-center justify-between rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
        <span className="text-sm font-semibold text-foreground">
          Weighted Overall
        </span>
        <span className="text-lg font-bold text-primary tabular-nums">
          {overall}
        </span>
      </div>
    </div>
  );
}
