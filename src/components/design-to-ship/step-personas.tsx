"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type DesignToShipDraft,
  PROJECT_TYPES,
} from "@/lib/design-to-ship";
import type { TeamRole } from "@/lib/launch-kit";

type Props = {
  draft: DesignToShipDraft;
  onChange: (patch: Partial<DesignToShipDraft>) => void;
};

const ROLE_ICONS: Record<string, string> = {
  product: "\u{1F3AF}",
  "ui/ux": "\u{1F3A8}",
  design: "\u{1F3A8}",
  retention: "\u{1F504}",
  growth: "\u{1F4C8}",
  tech: "\u2699\uFE0F",
  architect: "\u2699\uFE0F",
  revenue: "\u{1F4B0}",
  trust: "\u{1F6E1}\uFE0F",
  customer: "\u{1F91D}",
  devrel: "\u{1F4BB}",
  content: "\u270D\uFE0F",
  community: "\u{1F465}",
  conversion: "\u{1F4CA}",
  qa: "\u2705",
};

function iconForRole(role: string): string {
  const lower = role.toLowerCase();
  for (const [key, icon] of Object.entries(ROLE_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return "\u{1F9D1}\u200D\u{1F4BC}";
}

export function StepPersonas({ draft, onChange }: Props) {
  const [expanded, setExpanded] = React.useState<number | null>(null);

  const suggestedRoles = React.useMemo(() => {
    const pt = PROJECT_TYPES.find((p) => p.id === draft.projectType);
    return pt?.suggestedRoles || [];
  }, [draft.projectType]);

  function addRole(role: string) {
    if (draft.team.some((t) => t.role === role)) return;
    onChange({
      team: [...draft.team, { role, company: "", focus: "", triggers: [] }],
    });
  }

  function updateRole(index: number, patch: Partial<TeamRole>) {
    const next = [...draft.team];
    next[index] = { ...next[index], ...patch };
    onChange({ team: next });
  }

  function removeRole(index: number) {
    onChange({ team: draft.team.filter((_, i) => i !== index) });
    if (expanded === index) setExpanded(null);
  }

  function addTrigger(index: number) {
    const next = [...draft.team];
    next[index] = { ...next[index], triggers: [...next[index].triggers, ""] };
    onChange({ team: next });
  }

  function updateTrigger(roleIndex: number, triggerIndex: number, value: string) {
    const next = [...draft.team];
    const triggers = [...next[roleIndex].triggers];
    triggers[triggerIndex] = value;
    next[roleIndex] = { ...next[roleIndex], triggers };
    onChange({ team: next });
  }

  function removeTrigger(roleIndex: number, triggerIndex: number) {
    const next = [...draft.team];
    next[roleIndex] = {
      ...next[roleIndex],
      triggers: next[roleIndex].triggers.filter((_, i) => i !== triggerIndex),
    };
    onChange({ team: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Persona Team</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Assemble expert personas to guide design and development decisions.
        </p>
      </div>

      {/* Suggested Roles */}
      {suggestedRoles.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Suggested for {PROJECT_TYPES.find((p) => p.id === draft.projectType)?.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {suggestedRoles.map((role) => {
              const added = draft.team.some((t) => t.role === role);
              return (
                <button
                  key={role}
                  type="button"
                  disabled={added}
                  onClick={() => addRole(role)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                    added
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  {iconForRole(role)} {role} {added && "\u2713"}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Team List */}
      <div className="space-y-2">
        {draft.team.map((member, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            {/* Header */}
            <button
              type="button"
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="flex items-center gap-3 w-full px-4 py-3 text-left cursor-pointer hover:bg-white/[0.02] transition"
            >
              <span className="text-base">{iconForRole(member.role)}</span>
              <span className="flex-1 text-sm font-medium text-foreground">
                {member.role}
                {member.company && (
                  <span className="ml-2 text-muted-foreground font-normal">
                    ({member.company})
                  </span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">
                {expanded === i ? "\u25B2" : "\u25BC"}
              </span>
            </button>

            {/* Expanded Details */}
            {expanded === i && (
              <div className="px-4 pb-4 space-y-3 border-t border-white/5">
                <div className="pt-3 grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Company to Model</label>
                    <Input
                      value={member.company}
                      onChange={(e) => updateRole(i, { company: e.target.value })}
                      placeholder="e.g. Stripe"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs text-muted-foreground">Focus Area</label>
                    <Input
                      value={member.focus}
                      onChange={(e) => updateRole(i, { focus: e.target.value })}
                      placeholder="e.g. Conversion optimization"
                    />
                  </div>
                </div>

                {/* Triggers */}
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Consultation Triggers</label>
                  {member.triggers.map((trigger, ti) => (
                    <div key={ti} className="flex items-center gap-2">
                      <Input
                        value={trigger}
                        onChange={(e) => updateTrigger(i, ti, e.target.value)}
                        placeholder="Consult when..."
                      />
                      <button
                        type="button"
                        onClick={() => removeTrigger(i, ti)}
                        className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer"
                      >
                        x
                      </button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addTrigger(i)}
                    className="text-xs"
                  >
                    + Add trigger
                  </Button>
                </div>

                <button
                  type="button"
                  onClick={() => removeRole(i)}
                  className="text-xs text-red-400 hover:text-red-300 cursor-pointer"
                >
                  Remove persona
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Custom Role */}
      <AddCustomRole onAdd={addRole} />

      {/* Count */}
      <p className="text-xs text-muted-foreground text-right">
        {draft.team.length} persona{draft.team.length !== 1 ? "s" : ""} assembled
      </p>
    </div>
  );
}

function AddCustomRole({ onAdd }: { onAdd: (role: string) => void }) {
  const [value, setValue] = React.useState("");
  return (
    <div className="flex gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Custom role name..."
        onKeyDown={(e) => {
          if (e.key === "Enter" && value.trim()) {
            onAdd(value.trim());
            setValue("");
          }
        }}
      />
      <Button
        variant="secondary"
        size="sm"
        disabled={!value.trim()}
        onClick={() => {
          onAdd(value.trim());
          setValue("");
        }}
      >
        Add
      </Button>
    </div>
  );
}
