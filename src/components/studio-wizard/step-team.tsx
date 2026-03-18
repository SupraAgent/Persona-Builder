"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { Textarea } from "@/components/ui/textarea";
import {
  EMPTY_PERSONA,
  getPersonaPrompt,
  inferRoleIcon,
  type StudioDraft,
  type StudioPersona,
} from "@/lib/studio";
import { CONFIDENCE_WEIGHTS, type ConfidenceLevel } from "@/lib/launch-kit";
import {
  ROLE_SUGGESTIONS,
  COMPANY_SUGGESTIONS,
  FOCUS_SUGGESTIONS,
} from "@/lib/suggestions";

type Props = {
  draft: StudioDraft;
  onChange: (patch: Partial<StudioDraft>) => void;
};

export function StepTeam({ draft, onChange }: Props) {
  const [editingPrompt, setEditingPrompt] = React.useState(false);

  const activePersona = draft.personas[draft.activePersonaIndex] ?? null;
  const context = {
    projectName: draft.projectName,
    description: draft.description,
    targetUser: draft.targetUser,
    problem: draft.problem,
  };

  function updatePersona(index: number, patch: Partial<StudioPersona>) {
    const next = [...draft.personas];
    next[index] = { ...next[index], ...patch };
    onChange({ personas: next });
  }

  function addPersona() {
    onChange({
      personas: [...draft.personas, { ...EMPTY_PERSONA }],
      activePersonaIndex: draft.personas.length,
    });
  }

  function removePersona(index: number) {
    const next = draft.personas.filter((_, i) => i !== index);
    onChange({
      personas: next,
      activePersonaIndex: Math.min(draft.activePersonaIndex, Math.max(0, next.length - 1)),
    });
  }

  function setCeo(index: number) {
    const next = draft.personas.map((p, i) => ({
      ...p,
      isCeo: i === index,
    }));
    onChange({ personas: next });
  }

  function addTrigger(index: number) {
    const next = [...draft.personas];
    next[index] = { ...next[index], triggers: [...next[index].triggers, ""] };
    onChange({ personas: next });
  }

  function updateTrigger(personaIndex: number, triggerIndex: number, value: string) {
    const next = [...draft.personas];
    const triggers = [...next[personaIndex].triggers];
    triggers[triggerIndex] = value;
    next[personaIndex] = { ...next[personaIndex], triggers };
    onChange({ personas: next });
  }

  function removeTrigger(personaIndex: number, triggerIndex: number) {
    const next = [...draft.personas];
    next[personaIndex] = {
      ...next[personaIndex],
      triggers: next[personaIndex].triggers.filter((_, i) => i !== triggerIndex),
    };
    onChange({ personas: next });
  }

  const livePrompt = activePersona ? getPersonaPrompt(activePersona, context) : "";

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Build Your Team</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add advisors and watch their consultation prompt generate in real time.
        </p>
      </div>

      <div className="flex gap-6">
        {/* Left column — persona cards */}
        <div className="flex-1 min-w-0 space-y-4">
          {draft.personas.map((persona, i) => (
            <div
              key={i}
              onClick={() => {
                onChange({ activePersonaIndex: i });
                setEditingPrompt(false);
              }}
              className={`rounded-xl border p-4 space-y-3 cursor-pointer transition ${
                i === draft.activePersonaIndex
                  ? "border-primary/40 bg-primary/[0.03]"
                  : "border-white/10 bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{inferRoleIcon(persona.role)}</span>
                  <span className="text-xs font-medium text-muted-foreground">
                    {persona.role || `Advisor ${i + 1}`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCeo(i);
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-full border transition ${
                      persona.isCeo
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    {persona.isCeo ? "CEO" : "Set CEO"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePersona(i);
                    }}
                    className="text-xs text-muted-foreground hover:text-red-400"
                  >
                    remove
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Role</label>
                <Combobox
                  value={persona.role}
                  onChange={(v) => updatePersona(i, { role: v, promptOverride: null })}
                  suggestions={ROLE_SUGGESTIONS}
                  placeholder="Search roles..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Company to Model
                  </label>
                  <Combobox
                    value={persona.company}
                    onChange={(v) => updatePersona(i, { company: v, promptOverride: null })}
                    suggestions={COMPANY_SUGGESTIONS}
                    placeholder="Search companies..."
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">
                    Focus Area
                  </label>
                  <Combobox
                    value={persona.focus}
                    onChange={(v) => updatePersona(i, { focus: v, promptOverride: null })}
                    suggestions={FOCUS_SUGGESTIONS}
                    placeholder="Search focus areas..."
                  />
                </div>
              </div>

              {/* Confidence */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Confidence:</span>
                {(["high", "medium", "low"] as ConfidenceLevel[]).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      updatePersona(i, { confidence: level });
                    }}
                    className={`text-[10px] px-2 py-0.5 rounded-md border transition ${
                      persona.confidence === level
                        ? "border-primary/50 bg-primary/10 text-primary"
                        : "border-white/10 text-muted-foreground hover:border-white/20"
                    }`}
                  >
                    {level} ({CONFIDENCE_WEIGHTS[level]}x)
                  </button>
                ))}
              </div>

              {/* Triggers */}
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Consult When...
                </label>
                {persona.triggers.map((trigger, ti) => (
                  <div key={ti} className="flex items-center gap-2 mb-1.5">
                    <input
                      value={trigger}
                      onChange={(e) => updateTrigger(i, ti, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none focus:border-primary/50"
                      placeholder="e.g. Feature prioritization decisions"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeTrigger(i, ti);
                      }}
                      className="text-xs text-muted-foreground hover:text-red-400 px-1"
                    >
                      x
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    addTrigger(i);
                  }}
                  className="text-xs text-primary hover:text-primary/80"
                >
                  + Add trigger
                </button>
              </div>
            </div>
          ))}

          <Button type="button" variant="ghost" size="sm" onClick={addPersona}>
            + Add advisor
          </Button>

          {/* Consensus threshold */}
          {draft.personas.length > 1 && (
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-muted-foreground">
                  Consensus Threshold
                </label>
                <span className="text-xs text-foreground font-medium">
                  {draft.consensusThreshold}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={100}
                value={draft.consensusThreshold}
                onChange={(e) =>
                  onChange({ consensusThreshold: parseInt(e.target.value, 10) })
                }
                className="w-full accent-primary"
              />
              <p className="text-[10px] text-muted-foreground">
                When advisors disagree, {draft.consensusThreshold}% weighted agreement
                is needed. Deadlocks go to the CEO tiebreaker.
              </p>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            {draft.personas.length} advisor{draft.personas.length !== 1 ? "s" : ""}{" "}
            {draft.personas.some((p) => p.isCeo) ? "" : "— select a CEO to proceed"}
          </p>
        </div>

        {/* Right column — live prompt preview */}
        <div className="w-[380px] shrink-0 hidden lg:block">
          <div className="sticky top-8">
            <div className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xs font-medium text-foreground">
                  {activePersona
                    ? `Prompt: ${activePersona.role || "Untitled"}`
                    : "Prompt Preview"}
                </h3>
                {activePersona && (
                  <div className="flex items-center gap-2">
                    {activePersona.promptOverride !== null && (
                      <button
                        type="button"
                        onClick={() =>
                          updatePersona(draft.activePersonaIndex, {
                            promptOverride: null,
                          })
                        }
                        className="text-[10px] text-muted-foreground hover:text-foreground"
                      >
                        Reset
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setEditingPrompt(!editingPrompt)}
                      className={`text-[10px] px-2 py-0.5 rounded border transition ${
                        editingPrompt
                          ? "border-primary/50 bg-primary/10 text-primary"
                          : "border-white/10 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {editingPrompt ? "Preview" : "Edit"}
                    </button>
                  </div>
                )}
              </div>

              <div className="p-4 max-h-[calc(100vh-16rem)] overflow-y-auto">
                {activePersona ? (
                  editingPrompt ? (
                    <div className="space-y-2">
                      {activePersona.promptOverride !== null && (
                        <p className="text-[10px] text-yellow-400">
                          Custom prompt — changes to role/company/focus won't update this.
                        </p>
                      )}
                      <Textarea
                        value={
                          activePersona.promptOverride ??
                          getPersonaPrompt(activePersona, context)
                        }
                        onChange={(e) =>
                          updatePersona(draft.activePersonaIndex, {
                            promptOverride: e.target.value,
                          })
                        }
                        rows={20}
                        className="text-xs font-mono"
                      />
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap text-xs text-muted-foreground font-mono leading-relaxed">
                      {livePrompt}
                    </pre>
                  )
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Add an advisor to see the live prompt preview.
                  </p>
                )}
              </div>

              {activePersona && !editingPrompt && (
                <div className="px-4 py-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    {livePrompt.length} chars
                    {activePersona.promptOverride !== null && (
                      <span className="ml-2 text-yellow-400">custom</span>
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
