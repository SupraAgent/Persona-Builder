"use client";

import { Input } from "@/components/ui/input";
import { Combobox } from "@/components/ui/combobox";
import { ComboboxTags } from "@/components/ui/combobox";
import { FOCUS_SUGGESTIONS } from "@/lib/suggestions";
import type { PersonaDraft } from "@/lib/persona-builder";

const SKILL_SUGGESTIONS = [
  "Product strategy", "User research", "Data analysis", "A/B testing", "Growth hacking",
  "Content marketing", "SEO", "Paid acquisition", "Retention optimization", "Funnel analysis",
  "System design", "API design", "Database design", "Security", "Performance optimization",
  "CI/CD", "DevOps", "Cloud infrastructure", "Mobile development", "Frontend architecture",
  "UI design", "UX design", "Design systems", "Prototyping", "User testing",
  "Gamification", "Behavioral psychology", "Notification strategy", "Onboarding design",
  "Machine learning", "NLP", "Computer vision", "Data pipelines", "Analytics",
  "Smart contracts", "Token economics", "DeFi protocols", "Cross-chain", "Move/Solidity",
  "Technical writing", "Developer relations", "Community building", "Public speaking",
];

const TOOL_SUGGESTIONS = [
  "React", "Next.js", "TypeScript", "Node.js", "Python", "Go", "Rust", "Swift", "Kotlin",
  "PostgreSQL", "Redis", "MongoDB", "Supabase", "Firebase", "AWS", "GCP", "Vercel",
  "Figma", "Sketch", "Adobe XD", "Framer", "Storybook",
  "GitHub", "Linear", "Notion", "Slack", "Jira", "Confluence",
  "Mixpanel", "Amplitude", "PostHog", "Google Analytics", "Hotjar", "FullStory",
  "Stripe", "Twilio", "SendGrid", "Auth0", "Clerk",
  "Docker", "Kubernetes", "Terraform", "GitHub Actions", "CircleCI",
  "Jest", "Playwright", "Cypress", "Vitest",
  "TensorFlow", "PyTorch", "LangChain", "OpenAI API", "Anthropic API",
  "Hardhat", "Foundry", "Move CLI", "Aptos SDK",
];

type Props = {
  draft: PersonaDraft;
  onChange: (patch: Partial<PersonaDraft>) => void;
};

export function StepExpertise({ draft, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground">Expertise & Skills</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          What does this persona know deeply? What tools and methods define their approach?
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Primary Domain</label>
          <Combobox
            value={draft.primaryDomain}
            onChange={(v) => onChange({ primaryDomain: v })}
            suggestions={FOCUS_SUGGESTIONS}
            placeholder="Search domains or type custom..."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Secondary Skills</label>
          <ComboboxTags
            value={draft.secondarySkills}
            onChange={(secondarySkills) => onChange({ secondarySkills })}
            suggestions={SKILL_SUGGESTIONS}
            placeholder="Search skills or type and press Enter"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Signature Methodology</label>
          <Input
            value={draft.signatureMethodology}
            onChange={(e) => onChange({ signatureMethodology: e.target.value })}
            placeholder="e.g. Data-driven experimentation with rapid A/B testing"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">Tools & Frameworks</label>
          <ComboboxTags
            value={draft.toolsAndFrameworks}
            onChange={(toolsAndFrameworks) => onChange({ toolsAndFrameworks })}
            suggestions={TOOL_SUGGESTIONS}
            placeholder="Search tools or type and press Enter"
          />
        </div>
      </div>
    </div>
  );
}
