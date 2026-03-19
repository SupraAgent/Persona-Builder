import { NextRequest, NextResponse } from "next/server";
import { callLLM, getAvailableBackends, type LLMBackend } from "@/lib/llm-client";
import {
  buildScorecardPrompt,
  buildGapAnalysisPrompt,
  buildConsensusSimPrompt,
  parseScorecardResponse,
  parseGapResponse,
  parseConsensusResponse,
  type AutoResearchRequest,
  type AutoResearchResult,
  type PersonaScorecard,
} from "@/lib/auto-research";

export async function GET() {
  const backends = getAvailableBackends();
  return NextResponse.json({ backends });
}

export async function POST(req: NextRequest) {
  try {
    const body: AutoResearchRequest = await req.json();
    const { backend, model, projectContext, personas, sampleDecision } = body;

    if (!projectContext || !personas || personas.length === 0) {
      return NextResponse.json(
        { error: "projectContext and personas are required" },
        { status: 400 }
      );
    }

    const allNames = personas.map((p) => p.name);

    // 1. Score each persona (can be parallelized)
    const scorecardPromises = personas.map(async (persona) => {
      const prompt = buildScorecardPrompt(projectContext, persona, allNames);
      try {
        const res = await callLLM({
          backend,
          model,
          systemPrompt: "You are a persona quality evaluator. Respond only in valid JSON.",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 1024,
          temperature: 0.3,
        });
        return parseScorecardResponse(res.content, persona.name);
      } catch (err) {
        return {
          personaName: persona.name,
          scores: { relevance: 0, specificity: 0, coverage: 0, differentiation: 0, actionability: 0 },
          overall: 0,
          strengths: [],
          weaknesses: [`Error: ${err instanceof Error ? err.message : "LLM call failed"}`],
          improvements: [],
        } as PersonaScorecard;
      }
    });

    // 2. Gap analysis
    const gapPromise = (async () => {
      const prompt = buildGapAnalysisPrompt(projectContext, personas);
      try {
        const res = await callLLM({
          backend,
          model,
          systemPrompt: "You are a team composition analyst. Respond only in valid JSON.",
          messages: [{ role: "user", content: prompt }],
          maxTokens: 1024,
          temperature: 0.3,
        });
        return parseGapResponse(res.content);
      } catch {
        return [];
      }
    })();

    // 3. Consensus simulation (optional)
    const consensusPromise = sampleDecision
      ? (async () => {
          const prompt = buildConsensusSimPrompt(projectContext, personas, sampleDecision);
          try {
            const res = await callLLM({
              backend,
              model,
              systemPrompt: "You are simulating a team discussion. Respond only in valid JSON.",
              messages: [{ role: "user", content: prompt }],
              maxTokens: 2048,
              temperature: 0.7,
            });
            return parseConsensusResponse(res.content);
          } catch {
            return null;
          }
        })()
      : Promise.resolve(null);

    // Run all in parallel
    const [scorecards, gaps, consensusSimulation] = await Promise.all([
      Promise.all(scorecardPromises),
      gapPromise,
      consensusPromise,
    ]);

    const teamScore = scorecards.length > 0
      ? Math.round(scorecards.reduce((sum, s) => sum + s.overall, 0) / scorecards.length)
      : 0;

    const result: AutoResearchResult = {
      scorecards,
      teamScore,
      gaps,
      consensusSimulation,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    );
  }
}
