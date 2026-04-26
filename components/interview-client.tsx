"use client";

import { useState, useTransition } from "react";
import { ArrowUpRight, MessageSquareText, Send, Trophy } from "lucide-react";

import { LoadingScene } from "@/components/loading-scene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { InterviewEvaluationResult, InterviewPromptResult, InterviewTurn, UserProfile } from "@/types";

const profile: UserProfile = {
  currentRole: "Support Engineer",
  targetRole: "Frontend Developer",
  experienceLevel: "Intermediate",
  skills: ["JavaScript", "CSS", "Customer empathy"],
  yearsOfExperience: 2,
  bio: "I solve user problems, untangle bugs, and want to move closer to product-building work.",
};

export function InterviewClient() {
  const [chatHistory, setChatHistory] = useState<InterviewTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<InterviewPromptResult | null>(null);
  const [evaluation, setEvaluation] = useState<InterviewEvaluationResult | null>(null);
  const [answer, setAnswer] = useState("");
  const [providerNote, setProviderNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const requestNextQuestion = (latestAnswer?: string, nextHistory?: InterviewTurn[]) => {
    startTransition(async () => {
      const response = await fetch("/api/interview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile,
          chatHistory: nextHistory ?? chatHistory,
          latestAnswer,
          currentQuestion: currentQuestion?.current_question,
        }),
      });

      const result = (await response.json()) as {
        question: InterviewPromptResult;
        evaluation?: InterviewEvaluationResult;
        fallback?: boolean;
        provider?: "gemini" | "groq" | "local";
      };

      setCurrentQuestion(result.question);
      setEvaluation(result.evaluation ?? null);

      if (result.provider === "groq") {
        setProviderNote("Gemini stepped out, so Groq's Llama took the mic and kept the interview moving.");
      } else if (result.provider === "local" && result.fallback) {
        setProviderNote("This round used local fallback logic, which is still more honest than some hiring managers.");
      } else {
        setProviderNote(null);
      }
    });
  };

  const submitAnswer = () => {
    const trimmed = answer.trim();
    if (!trimmed || !currentQuestion) {
      return;
    }

    const nextHistory: InterviewTurn[] = [
      ...chatHistory,
      { role: "assistant", content: currentQuestion.current_question },
      { role: "user", content: trimmed },
    ];

    setChatHistory(nextHistory);
    setAnswer("");
    requestNextQuestion(trimmed, nextHistory);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <Card className="border-white/10">
        <CardHeader>
          <Badge className="mb-3 w-fit bg-primary/10 text-primary">Mock interview</Badge>
          <CardTitle>Practice like the job is real, because eventually it will be.</CardTitle>
          <CardDescription>
            Gemini asks one question at a time, scores your answer, and gently points out where you sounded vague, dramatic, or both.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => requestNextQuestion()} disabled={isPending}>
            <MessageSquareText className="mr-2 h-4 w-4" />
            {currentQuestion ? "Ask next question" : "Start interview"}
          </Button>
          {providerNote ? <p className="text-sm text-accent">{providerNote}</p> : null}
          {isPending ? (
            <LoadingScene
              title="Interview brain warming up"
              subtitle="jobex is lining up the next question, scoring your answer, and resisting the urge to ask anything boring."
              steps={[
                "Reviewing your last answer for signal, not just noise",
                "Picking the next question with a tiny bit of menace",
                "Formatting everything into strict JSON like a responsible adult",
              ]}
            />
          ) : null}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Current question</p>
            <p className="mt-3 font-display text-2xl">
              {currentQuestion?.current_question ?? "Press start and jobex will politely begin judging your career storytelling."}
            </p>
            {currentQuestion ? (
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge>{currentQuestion.stage}</Badge>
                <Badge>{currentQuestion.focus_area}</Badge>
              </div>
            ) : null}
          </div>
          <Textarea
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Answer like a thoughtful professional, not a hostage negotiating with buzzwords."
          />
          <Button onClick={submitAnswer} disabled={isPending || !answer.trim() || !currentQuestion}>
            <Send className="mr-2 h-4 w-4" />
            Submit answer
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card className="border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              <CardTitle>Last answer review</CardTitle>
            </div>
            <CardDescription>
              The simulator scores substance, clarity, and whether you actually answered the question. A revolutionary concept.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {evaluation ? (
              <div className="space-y-4">
                <div className="inline-flex rounded-full bg-primary/10 px-4 py-2 font-display text-2xl text-primary">
                  {evaluation.score}/100
                </div>
                <p className="text-sm text-muted-foreground">{evaluation.feedback}</p>
                <div className="space-y-3">
                  {evaluation.improvements.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                      <ArrowUpRight className="mt-0.5 h-4 w-4 text-primary" />
                      <p className="text-sm text-muted-foreground">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No feedback yet. Say something impressive, specific, and preferably true.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-white/10">
          <CardHeader>
            <CardTitle>Conversation trail</CardTitle>
            <CardDescription>Because your best answer rarely arrives on the first dramatic attempt.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chatHistory.length ? (
              chatHistory.map((turn, index) => (
                <div key={`${turn.role}-${index}`} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{turn.role}</p>
                  <p className="mt-2 text-sm text-foreground">{turn.content}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No history yet. The silence is still professional.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
