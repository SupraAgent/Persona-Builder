"use client";

import * as React from "react";
import {
  type LaunchKitDraft,
  type ConfidenceLevel,
  type ConsensusConfig,
  CONFIDENCE_WEIGHTS,
  PROJECT_PHASES,
  CEO_TIEBREAKER_CRITERIA,
} from "@/lib/launch-kit";

type Props = {
  draft: LaunchKitDraft;
  onChange: (patch: Partial<LaunchKitDraft>) => void;
};

export function StepConsensus({ draft, onChange }: Props) {
  const { team, consensus } = draft;

  function patch(updates: Partial<ConsensusConfig>) {
    onChange({ consensus: { ...consensus, ...updates } });
  }

  function setCeo(index: number | null) {
    patch({ ceoIndex: index });
  }

  function setConfidence(teamIndex: number, level: ConfidenceLevel) {
    patch({
      confidenceLevels: { ...consensus.confidenceLevels, [teamIndex]: level },
    });
  }

  function setPhaseAuthority(phaseId: string, teamIndex: number | null) {
    patch({
      phaseAuthority: { ...consensus.phaseAuthority, [phaseId]: teamIndex },
    });
  }

  const ceo =
    consensus.ceoIndex !== null ? team[consensus.ceoIndex] : null;

  if (team.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Consensus Protocol
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Go back to the Team step and add at least one role first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">
          Consensus Protocol
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure how your persona team resolves disputes. When personas
          disagree, this protocol determines how decisions are made.
        </p>
      </div>

      {/* CEO / Tiebreaker */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            CEO / Dispute Resolver
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            When personas deadlock, the CEO makes the final call using weighted
            criteria.
          </p>
        </div>

        <div className="grid gap-2">
          {team.map((member, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCeo(i)}
              className={`flex items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition cursor-pointer ${
                consensus.ceoIndex === i
                  ? "border-primary/40 bg-primary/5"
                  : "border-white/10 bg-white/[0.02] hover:bg-white/5"
              }`}
            >
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium ${
                  consensus.ceoIndex === i
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/5 text-muted-foreground"
                }`}
              >
                {consensus.ceoIndex === i ? "\u2605" : i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground">
                  {member.role || `Role ${i + 1}`}
                </span>
                {member.company && (
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    ({member.company})
                  </span>
                )}
              </div>
              {consensus.ceoIndex === i && (
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                  CEO
                </span>
              )}
            </button>
          ))}
        </div>

        {ceo && (
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
            <p className="text-xs font-medium text-primary">
              CEO Tiebreaker Criteria
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1">
              {CEO_TIEBREAKER_CRITERIA.map((c) => (
                <div key={c.id} className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {c.label}
                  </span>
                  <span className="text-xs font-medium text-foreground">
                    {c.weight}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confidence Levels */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Confidence-Weighted Voting
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Higher confidence gives a persona more influence. High = 1.0x,
            Medium = 0.7x, Low = 0.4x.
          </p>
        </div>

        <div className="space-y-2">
          {team.map((member, i) => {
            const level = consensus.confidenceLevels[i] || "high";
            return (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
              >
                <span className="min-w-0 flex-1 text-sm text-foreground truncate">
                  {member.role || `Role ${i + 1}`}
                </span>
                <div className="flex gap-1">
                  {(["high", "medium", "low"] as ConfidenceLevel[]).map(
                    (conf) => (
                      <button
                        key={conf}
                        type="button"
                        onClick={() => setConfidence(i, conf)}
                        className={`rounded-md px-2 py-1 text-[11px] font-medium transition cursor-pointer ${
                          level === conf
                            ? conf === "high"
                              ? "bg-green-500/15 text-green-400 border border-green-500/30"
                              : conf === "medium"
                                ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30"
                                : "bg-red-500/15 text-red-400 border border-red-500/30"
                            : "bg-white/[0.02] text-muted-foreground border border-white/10 hover:bg-white/5"
                        }`}
                      >
                        {conf} ({CONFIDENCE_WEIGHTS[conf]}x)
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Phase-Based Authority */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Phase-Based Authority
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Assign a lead persona for each project phase. They get a 1.5x
            authority bonus on close calls during that phase.
          </p>
        </div>

        <div className="space-y-2">
          {PROJECT_PHASES.map((phase) => {
            const selectedIdx = consensus.phaseAuthority[phase.id] ?? null;
            return (
              <div
                key={phase.id}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-sm text-foreground">
                    {phase.label}
                  </span>
                  <span className="ml-1.5 text-xs text-muted-foreground">
                    {phase.description}
                  </span>
                </div>
                <select
                  value={selectedIdx ?? ""}
                  onChange={(e) =>
                    setPhaseAuthority(
                      phase.id,
                      e.target.value === "" ? null : Number(e.target.value)
                    )
                  }
                  className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-foreground cursor-pointer min-w-[140px]"
                >
                  <option value="">None</option>
                  {team.map((member, i) => (
                    <option key={i} value={i}>
                      {member.role || `Role ${i + 1}`}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consensus Threshold */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">
            Consensus Threshold
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Minimum agreement percentage needed to proceed without CEO
            intervention.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={50}
            max={100}
            step={1}
            value={consensus.consensusThreshold}
            onChange={(e) =>
              patch({ consensusThreshold: Number(e.target.value) })
            }
            className="flex-1 accent-primary"
          />
          <span className="w-12 text-right text-sm font-medium text-foreground">
            {consensus.consensusThreshold}%
          </span>
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground px-1">
          <span>Simple majority (50%)</span>
          <span>Default (67%)</span>
          <span>Unanimous (100%)</span>
        </div>
      </div>

      {/* Protocol Summary */}
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
        <h3 className="text-sm font-medium text-foreground">
          Resolution Flow
        </h3>
        <ol className="ml-4 space-y-1 text-xs text-muted-foreground list-decimal">
          <li>Each persona provides their position + confidence level</li>
          <li>
            Confidence weights adjust votes (High 1.0x, Medium 0.7x, Low 0.4x)
          </li>
          <li>
            Phase lead gets 1.5x authority bonus on close calls
          </li>
          <li>
            {consensus.consensusThreshold}%+ agreement = proceed with majority
            (dissent documented)
          </li>
          <li>
            Deadlock = {ceo ? ceo.role : "CEO"} evaluates using weighted
            criteria
          </li>
          <li>User always has final override</li>
        </ol>
      </div>

      <p className="text-xs text-muted-foreground">
        {team.length} team member{team.length !== 1 ? "s" : ""}
        {ceo ? ` \u00b7 CEO: ${ceo.role}` : " \u00b7 No CEO selected"}
      </p>
    </div>
  );
}
