"use client";

import { useMemo, useState, useTransition } from "react";
import { FileText, Wand2 } from "lucide-react";

import { LoadingScene } from "@/components/loading-scene";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ResumeReviewResult, UserProfile } from "@/types";

export function ResumeReviewer({ profile }: { profile: UserProfile }) {
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [review, setReview] = useState<ResumeReviewResult | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const sourceLabel = useMemo(() => {
    if (file) {
      return file.name;
    }
    if (resumeText.trim()) {
      return "Pasted resume text";
    }
    return "No resume loaded yet";
  }, [file, resumeText]);

  const reviewResume = () => {
    setError(null);
    setNote(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("profile", JSON.stringify(profile));
        if (file) {
          formData.append("file", file);
        }
        if (resumeText.trim()) {
          formData.append("resumeText", resumeText.trim());
        }

        const response = await fetch("/api/resume-review", {
          method: "POST",
          body: formData,
        });

        const raw = await response.text();
        let result: {
          data?: ResumeReviewResult;
          fallback?: boolean;
          provider?: "gemini" | "groq" | "local";
          error?: string;
        } | null = null;

        try {
          result = JSON.parse(raw) as {
            data?: ResumeReviewResult;
            fallback?: boolean;
            provider?: "gemini" | "groq" | "local";
            error?: string;
          };
        } catch {
          throw new Error(
            response.ok
              ? "Resume review returned an unexpected response instead of JSON."
              : "Resume review route returned HTML instead of JSON. If you just added this feature, restart the dev server once and try again.",
          );
        }

        if (!response.ok || !result?.data) {
          throw new Error(result?.error ?? "Resume review failed");
        }

        setReview(result.data);

        if (result.provider === "groq") {
          setNote("Gemini tapped out, so Groq's Llama handled the resume roast with admirable professionalism.");
        } else if (result.provider === "local") {
          setNote("AI took the scenic route, so jobex used a local fallback review instead of making things up confidently.");
        }
      } catch (caughtError) {
        setError(caughtError instanceof Error ? caughtError.message : "Resume review failed in a mysterious and unhelpful way.");
      }
    });
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" />
        </div>
        <CardTitle>Resume Parser</CardTitle>
        <CardDescription>
          Upload a PDF, DOCX, TXT, or paste the text. jobex will tell you where your resume is helping and where it is quietly sabotaging you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <label className="space-y-2 text-sm">
            <span className="text-muted-foreground">Resume file</span>
            <div className="rounded-3xl border border-dashed border-white/15 bg-white/5 p-4">
              <Input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
              <p className="mt-3 text-xs text-muted-foreground">
                Current source: {sourceLabel}. PDFs and DOCX files are welcome. Crumpled napkins remain unsupported.
              </p>
            </div>
          </label>
          <label className="space-y-2 text-sm">
            <span className="text-muted-foreground">Or paste resume text</span>
            <Textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your resume here if your file is being dramatic."
              className="min-h-40"
            />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button onClick={reviewResume} disabled={isPending || (!file && !resumeText.trim())}>
            <Wand2 className="mr-2 h-4 w-4" />
            Review resume
          </Button>
          <Badge>{profile.targetRole}</Badge>
          <Badge>{profile.experienceLevel}</Badge>
        </div>

        {isPending ? (
          <LoadingScene
            title="Reading your resume with a raised eyebrow"
            subtitle="jobex is extracting the text, matching it to your target role, and preparing feedback that is useful enough to sting a little."
            steps={[
              "Pulling text out of the resume without losing the plot",
              "Comparing your current wording against the target role",
              "Writing fixes that recruiters can actually notice",
            ]}
          />
        ) : null}

        {note ? <p className="text-sm text-accent">{note}</p> : null}
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}

        {review ? (
          <div className="space-y-5">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Resume score</p>
                  <p className="mt-2 font-display text-4xl text-white">{review.overall_score}/100</p>
                </div>
                <Badge className="bg-primary/10 text-primary">{sourceLabel}</Badge>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{review.summary}</p>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h4 className="font-display text-xl">What's working</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.strengths.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <h4 className="font-display text-xl">Needs improvement</h4>
                <div className="mt-4 flex flex-wrap gap-2">
                  {review.weak_spots.map((item) => (
                    <Badge key={item}>{item}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-display text-xl">Missing for the target role</h4>
              <div className="mt-4 flex flex-wrap gap-2">
                {review.missing_for_target_role.map((item) => (
                  <Badge key={item}>{item}</Badge>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
              <h4 className="font-display text-xl">Rewrite suggestions</h4>
              <div className="mt-4 space-y-3">
                {review.rewrite_suggestions.map((item) => (
                  <div key={`${item.section}-${item.issue}`} className="rounded-2xl border border-white/10 bg-background/40 p-4">
                    <p className="font-medium text-white">{item.section}</p>
                    <p className="mt-2 text-sm text-muted-foreground">Issue: {item.issue}</p>
                    <p className="mt-2 text-sm text-primary">Fix: {item.fix}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
