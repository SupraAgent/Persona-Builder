"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicList } from "@/components/ui/dynamic-list";
import type { PersonaDraft } from "@/lib/persona-builder";

type Props = {
  draft: PersonaDraft;
  onChange: (patch: Partial<PersonaDraft>) => void;
};

export function StepMindset({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Strategic Mindset</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What principles guide this persona? What do they optimize for and push back on?
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Core Beliefs</label>
          <DynamicList
            value={draft.coreBeliefs.length > 0 ? draft.coreBeliefs : [""]}
            onChange={(coreBeliefs) => onChange({ coreBeliefs: coreBeliefs.filter(Boolean) })}
            placeholder="e.g. Ship fast, measure everything, iterate based on data"
            addLabel="Add belief"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">What They Optimize For</label>
          <Input
            value={draft.optimizeFor}
            onChange={(e) => onChange({ optimizeFor: e.target.value })}
            placeholder="e.g. 30-day retention rate"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">What They Push Back On</label>
          <DynamicList
            value={draft.pushBackOn.length > 0 ? draft.pushBackOn : [""]}
            onChange={(pushBackOn) => onChange({ pushBackOn: pushBackOn.filter(Boolean) })}
            placeholder="e.g. Building features without data to support the decision"
            addLabel="Add item"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Decision-Making Style</label>
          <Textarea
            value={draft.decisionMakingStyle}
            onChange={(e) => onChange({ decisionMakingStyle: e.target.value })}
            placeholder="How do they evaluate trade-offs? e.g. Data-first but willing to trust instinct on UX when sample sizes are too small..."
            className="min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}
