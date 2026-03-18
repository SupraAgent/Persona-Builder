"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { PROJECT_TYPES, type LaunchKitDraft, type TeamRole } from "@/lib/launch-kit";
import { ROLE_SUGGESTIONS, COMPANY_SUGGESTIONS, FOCUS_SUGGESTIONS } from "@/lib/suggestions";

type Props = {
  draft: LaunchKitDraft;
  onChange: (patch: Partial<LaunchKitDraft>) => void;
};

export function StepTeam({ draft, onChange }: Props) {
  const suggestedRoles = React.useMemo(() => {
    if (!draft.projectType) return [];
    const pt = PROJECT_TYPES.find((p) => p.id === draft.projectType);
    return pt?.suggestedRoles ?? [];
  }, [draft.projectType]);

  // Auto-populate from suggestions when team is empty and project type is set
  React.useEffect(() => {
    if (draft.team.length === 0 && suggestedRoles.length > 0) {
      onChange({
        team: suggestedRoles.map((role) => ({
          role,
          company: "",
          focus: "",
        })),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestedRoles]);

  function updateRole(index: number, field: keyof TeamRole, value: string) {
    const next = [...draft.team];
    next[index] = { ...next[index], [field]: value };
    onChange({ team: next });
  }

  function addRole() {
    onChange({ team: [...draft.team, { role: "", company: "", focus: "" }] });
  }

  function removeRole(index: number) {
    onChange({ team: draft.team.filter((_, i) => i !== index) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Team Assembly</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Define the persona team for your project. Each role becomes a persona
          modeled after the company you specify.
        </p>
      </div>

      {suggestedRoles.length > 0 && draft.team.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
          <p className="text-sm text-muted-foreground">
            Suggested roles for{" "}
            {PROJECT_TYPES.find((p) => p.id === draft.projectType)?.label}:
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {suggestedRoles.map((role) => (
              <span
                key={role}
                className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {draft.team.map((member, i) => (
          <div
            key={i}
            className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Role {i + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRole(i)}
                className="text-xs text-muted-foreground hover:text-red-400 cursor-pointer"
              >
                remove
              </button>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">
                Role Name
              </label>
              <Combobox
                value={member.role}
                onChange={(v) => updateRole(i, "role", v)}
                suggestions={ROLE_SUGGESTIONS}
                placeholder="Search roles or type custom..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Company to Model After
                </label>
                <Combobox
                  value={member.company}
                  onChange={(v) => updateRole(i, "company", v)}
                  suggestions={COMPANY_SUGGESTIONS}
                  placeholder="Search companies..."
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Focus Area
                </label>
                <Combobox
                  value={member.focus}
                  onChange={(v) => updateRole(i, "focus", v)}
                  suggestions={FOCUS_SUGGESTIONS}
                  placeholder="Search focus areas..."
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={addRole}>
        + Add role
      </Button>

      <p className="text-xs text-muted-foreground">
        {draft.team.length} role{draft.team.length !== 1 ? "s" : ""} defined
      </p>
    </div>
  );
}
