"use client";

import { Input } from "@/components/ui/input";
import {
  AGENT_ROLES,
  ROLE_CATEGORIES,
  type AgentPersona,
  type AgentRole,
} from "@/lib/agent-personas";
import * as React from "react";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepRole({ persona, onChange }: Props) {
  const [activeCategory, setActiveCategory] = React.useState<
    AgentRole["category"] | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? AGENT_ROLES
      : AGENT_ROLES.filter((r) => r.category === activeCategory);

  function selectRole(role: AgentRole) {
    onChange({ role, customRole: "" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Choose a Role</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What position does this agent hold on the team?
        </p>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
            activeCategory === "all"
              ? "bg-primary/10 text-primary border border-primary/30"
              : "bg-white/[0.02] text-muted-foreground border border-white/10 hover:border-white/15"
          }`}
        >
          All
        </button>
        {ROLE_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer ${
              activeCategory === cat.id
                ? "bg-primary/10 text-primary border border-primary/30"
                : "bg-white/[0.02] text-muted-foreground border border-white/10 hover:border-white/15"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Role grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((role) => {
          const isSelected = persona.role?.id === role.id;
          return (
            <button
              key={role.id}
              type="button"
              onClick={() => selectRole(role)}
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                isSelected
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <div className="text-sm font-medium text-foreground">
                {role.title}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {role.shortDescription}
              </div>
            </button>
          );
        })}
      </div>

      {/* Custom role */}
      <div className="border-t border-white/10 pt-4">
        <label className="mb-1.5 block text-[11px] uppercase tracking-wider text-muted-foreground">
          Or enter a custom role
        </label>
        <Input
          value={persona.customRole}
          onChange={(e) =>
            onChange({ customRole: e.target.value, role: null })
          }
          placeholder="e.g. Developer Relations Lead"
        />
      </div>
    </div>
  );
}
