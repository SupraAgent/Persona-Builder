"use client";

type Props = {
  prompt: string;
};

export function PromptPreview({ prompt }: Props) {
  if (!prompt) return null;

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">
        Generated System Prompt
      </label>
      <div className="max-h-[300px] overflow-y-auto rounded-xl border border-white/10 bg-white/[0.02] p-4">
        <pre className="whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground font-mono">
          {prompt}
        </pre>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        {prompt.length}/2000 characters
      </p>
    </div>
  );
}
