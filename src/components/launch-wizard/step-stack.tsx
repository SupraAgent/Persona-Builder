"use client";

import { TECH_CATEGORIES, type LaunchKitDraft, type TechChoice } from "@/lib/launch-kit";

type Props = {
  draft: LaunchKitDraft;
  onChange: (patch: Partial<LaunchKitDraft>) => void;
};

export function StepStack({ draft, onChange }: Props) {
  function selectChoice(category: string, choice: string) {
    const next: TechChoice[] = draft.techChoices.filter(
      (tc) => tc.category !== category
    );
    next.push({ category, choice });
    onChange({ techChoices: next });
  }

  function getChoice(category: string): string {
    return (
      draft.techChoices.find((tc) => tc.category === category)?.choice ?? ""
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Tech Stack</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your technology for each layer. Defaults are pre-selected.
        </p>
      </div>

      <div className="space-y-5">
        {TECH_CATEGORIES.map((cat) => {
          const selected = getChoice(cat.id);
          return (
            <div key={cat.id}>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {cat.label}
              </label>
              <div className="flex flex-wrap gap-2">
                {cat.options.map((option) => {
                  const active = selected === option;
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => selectChoice(cat.id, option)}
                      className={`rounded-lg border px-3 py-2 text-sm font-medium transition cursor-pointer ${
                        active
                          ? "border-primary/60 bg-primary/10 text-primary"
                          : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-white/20 hover:text-foreground"
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <h3 className="text-xs font-medium text-muted-foreground mb-2">
          Selected Stack
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {draft.techChoices.map((tc) => (
            <span
              key={tc.category}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-foreground"
            >
              {tc.choice}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
