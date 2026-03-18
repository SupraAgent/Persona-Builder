"use client";

import { TagInput } from "@/components/ui/tag-input";
import type { AgentPersona } from "@/lib/agent-personas";

type Props = {
  persona: AgentPersona;
  onChange: (patch: Partial<AgentPersona>) => void;
};

const SUGGESTIONS = [
  "Linear",
  "Stripe",
  "Vercel",
  "Notion",
  "Figma",
  "Datadog",
  "Cloudflare",
  "PostHog",
  "Supabase",
  "Anthropic",
];

export function StepInspirations({ persona, onChange }: Props) {
  function addSuggestion(name: string) {
    if (!persona.inspirations.includes(name)) {
      onChange({ inspirations: [...persona.inspirations, name] });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Inspirations</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Which companies or products embody this agent's philosophy? Optional.
        </p>
      </div>

      <TagInput
        value={persona.inspirations}
        onChange={(v) => onChange({ inspirations: v })}
        placeholder="Type a company name and press Enter"
      />

      <div>
        <p className="mb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
          Quick add
        </p>
        <div className="flex flex-wrap gap-1.5">
          {SUGGESTIONS.filter((s) => !persona.inspirations.includes(s)).map(
            (name) => (
              <button
                key={name}
                type="button"
                onClick={() => addSuggestion(name)}
                className="rounded-full border border-white/10 bg-white/[0.02] px-2.5 py-1 text-xs text-muted-foreground transition hover:border-white/15 hover:text-foreground cursor-pointer"
              >
                + {name}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
