"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  PHASE_LABELS,
  type PersonaTeamDraft,
} from "@/lib/persona-builder-v2";

type Props = {
  draft: PersonaTeamDraft;
  onChange: (patch: Partial<PersonaTeamDraft>) => void;
};

export function StepDynamics({ draft, onChange }: Props) {
  function setCeoTiebreaker(id: string) {
    onChange({
      dynamics: { ...draft.dynamics, ceoTiebreakerId: id },
    });
  }

  function togglePhaseAuthority(memberId: string, phase: number) {
    const updated = draft.members.map((m) => {
      if (m.id === memberId) {
        const has = m.phaseAuthority.includes(phase);
        return {
          ...m,
          phaseAuthority: has
            ? m.phaseAuthority.filter((p) => p !== phase)
            : [...m.phaseAuthority, phase],
        };
      }
      // Remove phase from other members (single lead per phase)
      return {
        ...m,
        phaseAuthority: m.phaseAuthority.filter((p) => p !== phase),
      };
    });
    onChange({ members: updated });
  }

  function addConflict() {
    if (draft.members.length < 2) return;
    const ids = draft.members.map((m) => m.id);
    onChange({
      dynamics: {
        ...draft.dynamics,
        expectedConflicts: [
          ...draft.dynamics.expectedConflicts,
          { betweenIds: [ids[0], ids[1]] as [string, string], topic: "" },
        ],
      },
    });
  }

  function updateConflict(
    index: number,
    field: "betweenIds" | "topic",
    value: [string, string] | string
  ) {
    const next = [...draft.dynamics.expectedConflicts];
    if (field === "topic" && typeof value === "string") {
      next[index] = { ...next[index], topic: value };
    } else if (field === "betweenIds" && Array.isArray(value)) {
      next[index] = { ...next[index], betweenIds: value };
    }
    onChange({
      dynamics: { ...draft.dynamics, expectedConflicts: next },
    });
  }

  function removeConflict(index: number) {
    onChange({
      dynamics: {
        ...draft.dynamics,
        expectedConflicts: draft.dynamics.expectedConflicts.filter((_, i) => i !== index),
      },
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Team Dynamics</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Configure phase authority, expected conflicts, and the CEO tiebreaker.
        </p>
      </div>

      {/* CEO Tiebreaker */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          CEO Tiebreaker
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          When personas deadlock, this member makes the final call.
        </p>
        <div className="flex flex-wrap gap-2">
          {draft.members.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setCeoTiebreaker(m.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition cursor-pointer ${
                draft.dynamics.ceoTiebreakerId === m.id
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
              }`}
            >
              {m.draft.name || m.agentRole?.title || "Member"}
            </button>
          ))}
        </div>
      </div>

      {/* Phase Authority */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Phase Authority
        </label>
        <p className="mb-3 text-xs text-muted-foreground">
          Assign a phase lead. That persona gets 1.5x weight on close calls in their phase.
        </p>
        <div className="space-y-2">
          {PHASE_LABELS.map((label, pi) => {
            const currentLead = draft.members.find((m) => m.phaseAuthority.includes(pi));
            return (
              <div key={pi} className="flex items-center gap-3">
                <span className="w-40 text-xs text-muted-foreground truncate">{label}</span>
                <div className="flex flex-wrap gap-1">
                  {draft.members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => togglePhaseAuthority(m.id, pi)}
                      className={`rounded px-2 py-0.5 text-[11px] font-medium transition cursor-pointer ${
                        currentLead?.id === m.id
                          ? "bg-primary/10 text-primary border border-primary/30"
                          : "bg-white/[0.02] text-muted-foreground border border-white/5 hover:border-white/15"
                      }`}
                    >
                      {m.draft.name?.split(" ")[0] || m.agentRole?.title?.split(" ")[0] || "?"}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Consensus Threshold */}
      <div>
        <label className="mb-1.5 block text-sm font-medium text-foreground">
          Consensus Threshold
        </label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min={50}
            max={100}
            value={Math.round(draft.dynamics.consensusThreshold * 100)}
            onChange={(e) =>
              onChange({
                dynamics: {
                  ...draft.dynamics,
                  consensusThreshold: Number(e.target.value) / 100,
                },
              })
            }
            className="flex-1 accent-primary"
          />
          <span className="text-sm font-medium text-foreground w-12 text-right">
            {Math.round(draft.dynamics.consensusThreshold * 100)}%
          </span>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Minimum agreement needed. Default: 67% (2/3 majority).
        </p>
      </div>

      {/* Expected Conflicts */}
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground">
          Expected Conflicts
        </label>
        <p className="mb-2 text-xs text-muted-foreground">
          Document where personas are likely to disagree.
        </p>
        <div className="space-y-2">
          {draft.dynamics.expectedConflicts.map((conflict, ci) => (
            <div key={ci} className="flex items-start gap-2">
              <select
                value={conflict.betweenIds[0]}
                onChange={(e) =>
                  updateConflict(ci, "betweenIds", [e.target.value, conflict.betweenIds[1]])
                }
                className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-foreground"
              >
                {draft.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.draft.name || m.agentRole?.title || "Member"}
                  </option>
                ))}
              </select>
              <span className="mt-1 text-xs text-muted-foreground">vs</span>
              <select
                value={conflict.betweenIds[1]}
                onChange={(e) =>
                  updateConflict(ci, "betweenIds", [conflict.betweenIds[0], e.target.value])
                }
                className="h-8 rounded-lg border border-white/10 bg-white/5 px-2 text-xs text-foreground"
              >
                {draft.members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.draft.name || m.agentRole?.title || "Member"}
                  </option>
                ))}
              </select>
              <Input
                value={conflict.topic}
                onChange={(e) => updateConflict(ci, "topic", e.target.value)}
                placeholder="Topic of disagreement"
                className="h-8 flex-1 text-xs"
              />
              <button
                type="button"
                onClick={() => removeConflict(ci)}
                className="mt-1 text-xs text-muted-foreground hover:text-red-400 cursor-pointer"
              >
                x
              </button>
            </div>
          ))}
        </div>
        {draft.members.length >= 2 && (
          <Button variant="ghost" size="sm" onClick={addConflict} className="mt-2 text-xs">
            + Add conflict
          </Button>
        )}
      </div>
    </div>
  );
}
