"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  type PersonaTeamDraft,
  type TeamMember,
  type GrillQuestion,
} from "@/lib/persona-builder-v2";

function getQuestionsForRole(role: string): string[] {
  if (role.includes("product"))
    return [
      "What's the one metric that proves this product works?",
      "If this product disappeared tomorrow, who would notice and why?",
      "What's the riskiest assumption we're making?",
    ];
  if (role.includes("design") || role.includes("ux") || role.includes("ui"))
    return [
      "What does the user see in their first 30 seconds?",
      "Where will users get confused or stuck?",
      "What's the one interaction that must feel effortless?",
    ];
  if (
    role.includes("engineer") ||
    role.includes("tech") ||
    role.includes("cto") ||
    role.includes("architect")
  )
    return [
      "What's the data model look like?",
      "What happens when this needs to scale 10x?",
      "What's the biggest technical risk?",
    ];
  if (role.includes("growth") || role.includes("marketing"))
    return [
      "What's the primary acquisition channel?",
      "What makes someone share this with a friend?",
      "What's the cost to acquire one user?",
    ];
  if (role.includes("retention"))
    return [
      "What reason does a user have to come back tomorrow?",
      "What does the user lose if they're absent for a week?",
      "When does the product become harder to leave than to stay?",
    ];
  if (role.includes("ceo") || role.includes("chief"))
    return [
      "What's the 3-month vision vs 12-month vision?",
      "Where do we say no?",
      "What's the unfair advantage?",
    ];
  if (role.includes("revenue") || role.includes("sales"))
    return [
      "When does the user first see the value?",
      "What would make someone pay 2x the price?",
      "What's the simplest monetization that works day one?",
    ];
  return [
    "What's your biggest concern about this project?",
    "What would you prioritize in the first sprint?",
    "What's the one thing we must not get wrong?",
  ];
}

export function generateGrillQuestions(members: TeamMember[]): GrillQuestion[] {
  const questions: GrillQuestion[] = [];
  for (const m of members) {
    const role = (
      m.agentRole?.title ||
      m.draft.title ||
      "advisor"
    ).toLowerCase();
    const roleQs = getQuestionsForRole(role);
    for (const q of roleQs.slice(0, 2)) {
      questions.push({
        memberId: m.id,
        question: q,
        response: "",
        status: "unanswered",
      });
    }
  }
  return questions;
}

type Props = {
  draft: PersonaTeamDraft;
  onChange: (d: Partial<PersonaTeamDraft>) => void;
  onSkip: () => void;
};

export function StepGrill({ draft, onChange, onSkip }: Props) {
  // Initialize grill questions if empty
  React.useEffect(() => {
    if (draft.grillQuestions.length === 0 && draft.members.length > 0) {
      onChange({ grillQuestions: generateGrillQuestions(draft.members) });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function updateQuestion(
    index: number,
    patch: Partial<GrillQuestion>
  ) {
    const updated = draft.grillQuestions.map((q, i) =>
      i === index ? { ...q, ...patch } : q
    );
    onChange({ grillQuestions: updated });
  }

  function handleAnswer(index: number) {
    const q = draft.grillQuestions[index];
    if (q.response.trim()) {
      updateQuestion(index, { status: "answered" });
    }
  }

  function handleAcknowledge(index: number) {
    updateQuestion(index, { status: "acknowledged" });
  }

  // Group questions by member
  const memberMap = new Map(draft.members.map((m) => [m.id, m]));
  const grouped = new Map<string, { member: TeamMember; questions: { q: GrillQuestion; index: number }[] }>();

  draft.grillQuestions.forEach((q, i) => {
    const member = memberMap.get(q.memberId);
    if (!member) return;
    if (!grouped.has(q.memberId)) {
      grouped.set(q.memberId, { member, questions: [] });
    }
    grouped.get(q.memberId)!.questions.push({ q, index: i });
  });

  const total = draft.grillQuestions.length;
  const resolved = draft.grillQuestions.filter(
    (q) => q.status !== "unanswered"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Grill Your Team
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Challenge each persona with tough questions. Answer them or
            acknowledge them — this step is optional.
          </p>
        </div>
        <Button variant="secondary" onClick={onSkip}>
          Skip — export directly
        </Button>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {resolved}/{total} questions resolved
            </span>
            <span>
              {total - resolved === 0
                ? "All done — you can proceed"
                : `${total - resolved} remaining`}
            </span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-primary/60 transition-all"
              style={{ width: `${total > 0 ? (resolved / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}

      {/* Questions grouped by member */}
      {Array.from(grouped.values()).map(({ member, questions }) => {
        const displayName =
          member.draft.name || member.agentRole?.title || "Team Member";
        return (
          <div
            key={member.id}
            className="rounded-xl border border-white/10 bg-white/[0.02] overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-white/10">
              <h3 className="text-sm font-medium text-foreground">
                {displayName}
                {member.agentRole?.title && member.draft.name && (
                  <span className="text-muted-foreground ml-2 text-xs">
                    ({member.agentRole.title})
                  </span>
                )}
              </h3>
            </div>
            <div className="p-4 space-y-4">
              {questions.map(({ q, index }) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 space-y-2 transition ${
                    q.status === "answered"
                      ? "border-green-500/30 bg-green-500/5"
                      : q.status === "acknowledged"
                        ? "border-yellow-500/30 bg-yellow-500/5"
                        : "border-white/10 bg-white/[0.02]"
                  }`}
                >
                  <p className="text-sm text-foreground">{q.question}</p>
                  {q.status === "unanswered" && (
                    <>
                      <Textarea
                        value={q.response}
                        onChange={(e) =>
                          updateQuestion(index, { response: e.target.value })
                        }
                        placeholder="Type your answer..."
                        className="min-h-[60px] text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleAnswer(index)}
                          disabled={!q.response.trim()}
                        >
                          Answer
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAcknowledge(index)}
                        >
                          Acknowledge
                        </Button>
                      </div>
                    </>
                  )}
                  {q.status === "answered" && (
                    <p className="text-xs text-muted-foreground">
                      {q.response}
                    </p>
                  )}
                  {q.status === "acknowledged" && (
                    <p className="text-xs text-yellow-400/80">Acknowledged</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {draft.grillQuestions.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 text-center">
          <p className="text-sm text-muted-foreground">
            No team members to grill. Go back and add some members first.
          </p>
        </div>
      )}
    </div>
  );
}
