"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { TITLE_SUGGESTIONS, COMPANY_SUGGESTIONS } from "@/lib/suggestions";
import {
  AGENT_ROLES,
  COMMUNICATION_STYLES,
  SUGGESTED_TEAM_SIZES,
  createTeamMember,
  type PersonaTeamDraft,
  type TeamMember,
} from "@/lib/persona-builder-v2";

type Props = {
  draft: PersonaTeamDraft;
  onChange: (patch: Partial<PersonaTeamDraft>) => void;
};

export function StepMembers({ draft, onChange }: Props) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  function addMember() {
    const m = createTeamMember();
    onChange({ members: [...draft.members, m] });
    setExpandedId(m.id);
  }

  function removeMember(id: string) {
    onChange({ members: draft.members.filter((m) => m.id !== id) });
    if (expandedId === id) setExpandedId(null);
  }

  function patchMember(id: string, patch: Partial<TeamMember>) {
    onChange({
      members: draft.members.map((m) =>
        m.id === id ? { ...m, ...patch } : m
      ),
    });
  }

  function patchMemberDraft(id: string, draftPatch: Partial<TeamMember["draft"]>) {
    onChange({
      members: draft.members.map((m) =>
        m.id === id ? { ...m, draft: { ...m.draft, ...draftPatch } } : m
      ),
    });
  }

  function applyTemplate(templateId: string) {
    const template = SUGGESTED_TEAM_SIZES.find((t) => t.id === templateId);
    if (!template) return;
    const members = template.roles.map((roleId) => {
      const m = createTeamMember();
      const role = AGENT_ROLES.find((r) => r.id === roleId);
      if (role) {
        m.agentRole = role;
        m.draft.title = role.title;
      }
      return m;
    });
    onChange({ members });
    if (members.length > 0) setExpandedId(members[0].id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add personas to your team. Use a template or build from scratch.
        </p>
      </div>

      {/* Templates */}
      {draft.members.length === 0 && (
        <div>
          <label className="mb-2 block text-sm font-medium text-muted-foreground">
            Quick Start Templates
          </label>
          <div className="grid grid-cols-3 gap-2">
            {SUGGESTED_TEAM_SIZES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => applyTemplate(t.id)}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-left transition cursor-pointer hover:border-white/20"
              >
                <div className="text-sm font-medium text-foreground">{t.label}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{t.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Member list */}
      <div className="space-y-3">
        {draft.members.map((member, i) => {
          const isExpanded = expandedId === member.id;
          const displayName = member.draft.name || member.agentRole?.title || `Member ${i + 1}`;

          return (
            <div
              key={member.id}
              className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpandedId(isExpanded ? null : member.id)}
                className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-white/[0.02] transition"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {i + 1}
                  </span>
                  <div className="text-left">
                    <div className="text-sm font-medium text-foreground">{displayName}</div>
                    {member.draft.company && (
                      <div className="text-xs text-muted-foreground">{member.draft.company}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {member.communicationStyle && (
                    <span className="text-xs text-muted-foreground">{member.communicationStyle.label}</span>
                  )}
                  <svg
                    className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </button>

              {/* Expanded form */}
              {isExpanded && (
                <div className="border-t border-white/10 px-4 py-4 space-y-4">
                  {/* Role selection */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Agent Role</label>
                    <div className="flex flex-wrap gap-1.5">
                      {AGENT_ROLES.slice(0, 10).map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            patchMember(member.id, { agentRole: role });
                            patchMemberDraft(member.id, { title: role.title });
                          }}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            member.agentRole?.id === role.id
                              ? "border-primary/60 bg-primary/10 text-primary"
                              : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          {role.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Name</label>
                      <Input
                        value={member.draft.name}
                        onChange={(e) => patchMemberDraft(member.id, { name: e.target.value })}
                        placeholder="e.g. Sarah Chen"
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Company</label>
                      <Combobox
                        value={member.draft.company}
                        onChange={(v) => patchMemberDraft(member.id, { company: v })}
                        suggestions={COMPANY_SUGGESTIONS}
                        placeholder="Search companies..."
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted-foreground">Focus / Background</label>
                    <Textarea
                      value={member.draft.backgroundSummary}
                      onChange={(e) => patchMemberDraft(member.id, { backgroundSummary: e.target.value })}
                      placeholder="What does this persona specialize in?"
                      className="min-h-[60px] text-sm"
                    />
                  </div>

                  {/* Communication style */}
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Communication Style</label>
                    <div className="flex flex-wrap gap-1.5">
                      {COMMUNICATION_STYLES.map((style) => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => patchMember(member.id, { communicationStyle: style })}
                          className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition cursor-pointer ${
                            member.communicationStyle?.id === style.id
                              ? "border-primary/60 bg-primary/10 text-primary"
                              : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20"
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      className="text-xs text-muted-foreground hover:text-red-400 transition cursor-pointer"
                    >
                      Remove member
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button variant="ghost" size="sm" onClick={addMember} className="text-xs">
        + Add team member
      </Button>
    </div>
  );
}
