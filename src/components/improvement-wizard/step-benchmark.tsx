"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScoringGrid } from "./scoring-grid";
import {
  createEmptyScores,
  recalcAverages,
  type ImprovementDraft,
  type ReferenceApp,
  type CategoryScore,
} from "@/lib/improvement";

type Props = {
  draft: ImprovementDraft;
  onChange: (patch: Partial<ImprovementDraft>) => void;
};

export function StepBenchmark({ draft, onChange }: Props) {
  const [activeTab, setActiveTab] = React.useState(0);

  // Ensure we have exactly 3 reference app slots
  React.useEffect(() => {
    if (draft.referenceApps.length < 3) {
      const apps: ReferenceApp[] = [];
      for (let i = 0; i < 3; i++) {
        apps.push(
          draft.referenceApps[i] ?? {
            name: "",
            why: "",
            scores: createEmptyScores(),
          }
        );
      }
      onChange({ referenceApps: apps });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function patchApp(index: number, patch: Partial<ReferenceApp>) {
    const next = [...draft.referenceApps];
    next[index] = { ...next[index], ...patch };
    onChange({ referenceApps: next });
  }

  function handleScoreChange(
    appIndex: number,
    catIndex: number,
    subIndex: number,
    value: number
  ) {
    const app = draft.referenceApps[appIndex];
    if (!app) return;

    const newScores: CategoryScore[] = app.scores.map((cat, ci) => {
      if (ci !== catIndex) return cat;
      const subCriteria = cat.subCriteria.map((sc, si) =>
        si === subIndex ? { ...sc, score: value } : sc
      );
      return { ...cat, subCriteria };
    });

    patchApp(appIndex, { scores: recalcAverages(newScores) });
  }

  const apps = draft.referenceApps;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Benchmark Reference Apps
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick 3 apps that represent the best in your category. Score them
          across 8 dimensions — they set the ceiling.
        </p>
      </div>

      {/* Reference app names */}
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-2">
            <Input
              value={apps[i]?.name ?? ""}
              onChange={(e) => patchApp(i, { name: e.target.value })}
              placeholder={`App ${i + 1} name`}
            />
            <Input
              value={apps[i]?.why ?? ""}
              onChange={(e) => patchApp(i, { why: e.target.value })}
              placeholder="Why this app?"
              className="h-8 text-xs"
            />
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.02] p-1">
        {[0, 1, 2].map((i) => (
          <Button
            key={i}
            variant={activeTab === i ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(i)}
            className="flex-1"
          >
            {apps[i]?.name || `App ${i + 1}`}
          </Button>
        ))}
      </div>

      {/* Scoring grid for active app */}
      {apps[activeTab] && (
        <ScoringGrid
          scores={apps[activeTab].scores}
          onScoreChange={(catIdx, subIdx, value) =>
            handleScoreChange(activeTab, catIdx, subIdx, value)
          }
        />
      )}
    </div>
  );
}
