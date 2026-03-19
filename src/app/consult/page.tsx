"use client";

import * as React from "react";
import { ResearchPanel } from "@/components/consult/research-panel";
import { ChecklistPanel } from "@/components/consult/checklist-panel";

type Tab = "team" | "checklist";

export default function ConsultPage() {
  const [tab, setTab] = React.useState<Tab>("team");

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Auto-Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Score, evaluate, and improve your personas and skills using AI.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="mb-8 flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.02] p-1">
        <button
          onClick={() => setTab("team")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
            tab === "team"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground border border-transparent"
          }`}
        >
          Team Evaluation
          <span className="block text-[10px] mt-0.5 font-normal">
            Score personas on 5 metrics + gap analysis
          </span>
        </button>
        <button
          onClick={() => setTab("checklist")}
          className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition cursor-pointer ${
            tab === "checklist"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "text-muted-foreground hover:text-foreground border border-transparent"
          }`}
        >
          Checklist Scoring
          <span className="block text-[10px] mt-0.5 font-normal">
            Yes/no checklist loop (autoresearch method)
          </span>
        </button>
      </div>

      {tab === "team" ? <ResearchPanel /> : <ChecklistPanel />}
    </div>
  );
}
