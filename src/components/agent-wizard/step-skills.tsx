"use client";

import {
  AGENT_SKILLS,
  SKILL_CATEGORIES,
  type AgentPersona,
  type AgentSkill,
} from "@/lib/agent-personas";
import * as React from "react";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

export function StepSkills({ persona, onChange }: Props) {
  const [activeCategory, setActiveCategory] = React.useState<
    AgentSkill["category"] | "all"
  >("all");

  const filtered =
    activeCategory === "all"
      ? AGENT_SKILLS
      : AGENT_SKILLS.filter((s) => s.category === activeCategory);

  function toggle(skillId: string) {
    const next = persona.skills.includes(skillId)
      ? persona.skills.filter((s) => s !== skillId)
      : [...persona.skills, skillId];
    onChange({ skills: next });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Skills</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What can this agent do? Select all that apply.
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
        {SKILL_CATEGORIES.map((cat) => (
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

      {/* Skills grid */}
      <div className="grid grid-cols-2 gap-2">
        {filtered.map((skill) => {
          const isSelected = persona.skills.includes(skill.id);
          return (
            <button
              key={skill.id}
              type="button"
              onClick={() => toggle(skill.id)}
              className={`rounded-xl border p-3 text-left transition cursor-pointer ${
                isSelected
                  ? "border-primary/60 bg-primary/10"
                  : "border-white/10 bg-white/[0.02] hover:border-white/15"
              }`}
            >
              <div className="flex items-center gap-2">
                <div
                  className={`h-3.5 w-3.5 shrink-0 rounded border transition ${
                    isSelected
                      ? "border-primary bg-primary"
                      : "border-white/20 bg-white/5"
                  }`}
                >
                  {isSelected && (
                    <svg
                      className="h-3.5 w-3.5 text-primary-foreground"
                      viewBox="0 0 14 14"
                      fill="none"
                    >
                      <path
                        d="M3 7l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {skill.label}
                </span>
              </div>
              <div className="mt-1 pl-5.5 text-xs text-muted-foreground">
                {skill.description}
              </div>
            </button>
          );
        })}
      </div>

      {persona.skills.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {persona.skills.length} skill{persona.skills.length !== 1 && "s"}{" "}
          selected
        </p>
      )}
    </div>
  );
}
