"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { PROJECT_TYPES, type LaunchKitDraft, type TeamRole } from "@/lib/launch-kit";
import { ROLE_SUGGESTIONS, COMPANY_SUGGESTIONS, FOCUS_SUGGESTIONS } from "@/lib/suggestions";

type SavedPersona = {
  id: string;
  name: string;
  role: string;
  icon: string | null;
};

type Props = {
  draft: LaunchKitDraft;
  onChange: (patch: Partial<LaunchKitDraft>) => void;
};

export function StepTeam({ draft, onChange }: Props) {
  const [savedPersonas, setSavedPersonas] = React.useState<SavedPersona[]>([]);
  const [showPicker, setShowPicker] = React.useState(false);

  const suggestedRoles = React.useMemo(() => {
    if (!draft.projectType) return [];
    const pt = PROJECT_TYPES.find((p) => p.id === draft.projectType);
    return pt?.suggestedRoles ?? [];
  }, [draft.projectType]);

  // Load saved personas
  React.useEffect(() => {
    fetch("/api/personas")
      .then((r) => r.json())
      .then((data) => setSavedPersonas(data.personas ?? []))
      .catch(() => {});
  }, []);

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

  function addFromPersona(persona: SavedPersona) {
    const roleName = persona.name;
    const company = persona.role?.includes(" at ") ? persona.role.split(" at ")[1] : "";
    onChange({
      team: [...draft.team, { role: roleName, company, focus: persona.role }],
    });
    setShowPicker(false);
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

      <div className="flex items-center gap-3">
        <Button type="button" variant="ghost" size="sm" onClick={addRole}>
          + Add role
        </Button>

        {savedPersonas.length > 0 && (
          <div className="relative">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setShowPicker(!showPicker)}
            >
              + From saved personas
            </Button>
            {showPicker && (
              <div className="absolute z-50 mt-1 w-72 max-h-[240px] overflow-y-auto rounded-xl border border-white/10 bg-card shadow-lg">
                {savedPersonas.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => addFromPersona(p)}
                    className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-white/5 cursor-pointer flex items-center gap-2"
                  >
                    <span className="text-base">{p.icon || "🤖"}</span>
                    <div>
                      <div className="font-medium">{p.name}</div>
                      {p.role && (
                        <div className="text-xs text-muted-foreground">{p.role}</div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <Link
          href="/expert"
          className="text-xs text-primary hover:text-primary/80 transition"
        >
          Create detailed persona
        </Link>
      </div>

      <p className="text-xs text-muted-foreground">
        {draft.team.length} role{draft.team.length !== 1 ? "s" : ""} defined
      </p>
    </div>
  );
}
