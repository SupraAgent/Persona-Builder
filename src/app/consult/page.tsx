import { ResearchPanel } from "@/components/consult/research-panel";

export default function ConsultPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Auto-Research</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Score, evaluate, and improve your personas using AI. Runs on Claude API or your local GPU via Ollama.
        </p>
      </div>
      <ResearchPanel />
    </div>
  );
}
