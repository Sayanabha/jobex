"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ArrowRight, BrainCircuit, Sparkles, Wand2 } from "lucide-react";

import { LoadingScene } from "@/components/loading-scene";
import { ProfileForm } from "@/components/profile-form";
import { ResumeReviewer } from "@/components/resume-reviewer";
import { ResultShell } from "@/components/result-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  CareerSwitchResult,
  ProjectsResult,
  RoadmapResult,
  SkillGapResult,
  UserProfile,
} from "@/types";

const initialProfile: UserProfile = {
  currentRole: "Support Engineer",
  targetRole: "Frontend Developer",
  experienceLevel: "Intermediate",
  skills: ["JavaScript", "CSS", "Customer empathy"],
  yearsOfExperience: 2,
  bio: "I solve user problems, untangle bugs, and want to move closer to product-building work.",
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json() as Promise<T>;
}

export function DashboardClient() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [skillGap, setSkillGap] = useState<SkillGapResult | null>(null);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);
  const [projects, setProjects] = useState<ProjectsResult | null>(null);
  const [careerSwitch, setCareerSwitch] = useState<CareerSwitchResult | null>(null);
  const [fallbackNote, setFallbackNote] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const generateAll = () => {
    setFallbackNote(null);

    startTransition(async () => {
      try {
        const [gapRes, roadmapRes, projectRes, switchRes] = await Promise.all([
          postJson<{ data: SkillGapResult; fallback?: boolean; provider?: string }>("/api/skill-gap", profile),
          postJson<{ data: RoadmapResult; fallback?: boolean; provider?: string }>("/api/roadmap", profile),
          postJson<{ data: ProjectsResult; fallback?: boolean; provider?: string }>("/api/projects", profile),
          postJson<{ data: CareerSwitchResult; fallback?: boolean; provider?: string }>("/api/career-switch", {
            currentRole: profile.currentRole,
            targetRole: profile.targetRole,
          }),
        ]);

        setSkillGap(gapRes.data);
        setRoadmap(roadmapRes.data);
        setProjects(projectRes.data);
        setCareerSwitch(switchRes.data);

        const providers = [gapRes.provider, roadmapRes.provider, projectRes.provider, switchRes.provider];
        if (providers.includes("groq")) {
          setFallbackNote("Gemini blinked, so Groq's Llama stepped in and kept the career advice flowing.");
        } else if (providers.includes("local")) {
          setFallbackNote("Both AI providers took a little nap, so jobex used local fallback logic instead of bluffing.");
        }
      } catch {
        setFallbackNote("Something broke mid-simulation. The ambition remains intact.");
      }
    });
  };

  const totalMissingSkills =
    (skillGap?.missing_skills.beginner.length ?? 0) +
    (skillGap?.missing_skills.intermediate.length ?? 0) +
    (skillGap?.missing_skills.advanced.length ?? 0);
  const readinessScore = Math.max(18, 100 - totalMissingSkills * 8);

  return (
    <div className="space-y-8">
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[32px] border border-white/10 bg-background/70 p-8 shadow-glow">
          <Badge className="mb-4 bg-primary/10 text-primary">Career simulator</Badge>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-white md:text-5xl">
            Turn "maybe someday" into a plan with receipts.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            jobex maps your gap, your roadmap, your portfolio projects, your resume weak spots, and the emotional cost of a dramatic career pivot.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button onClick={generateAll} disabled={isPending}>
              <Wand2 className="mr-2 h-4 w-4" />
              Run full simulation
            </Button>
            <Button asChild variant="outline">
              <Link href="/interview">
                Practice interview
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="mb-2 flex items-center justify-between text-sm text-muted-foreground">
              <span>Role readiness pulse</span>
              <span>{readinessScore}% believable</span>
            </div>
            <Progress value={readinessScore} />
            <p className="mt-3 text-sm text-muted-foreground">
              Not a scientific metric. More of a "how much chaos is still between you and the job title" indicator.
            </p>
          </div>
        </div>
        <ProfileForm value={profile} onChange={setProfile} />
      </section>

      <ResumeReviewer profile={profile} />

      {isPending ? (
        <LoadingScene
          title="Consulting the career gremlins"
          subtitle="jobex is lining up your profile, your target role, and several opinions that are hopefully useful."
          steps={[
            "Reading your current signal without being dramatic about it",
            "Drafting a roadmap that respects time and reality",
            "Picking portfolio ideas with actual hiring value",
          ]}
        />
      ) : null}

      {fallbackNote ? (
        <div className="rounded-2xl border border-accent/20 bg-accent/10 px-4 py-3 text-sm text-accent">
          {fallbackNote}
        </div>
      ) : null}

      <Tabs defaultValue="gap">
        <TabsList>
          <TabsTrigger value="gap">Skill gap</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="switch">Career switch</TabsTrigger>
        </TabsList>

        <TabsContent value="gap">
          <ResultShell
            title="Skill Gap Analysis"
            description="The brutally helpful version of 'what should I learn next?'"
            loading={isPending && !skillGap}
            loadingSteps={[
              "Matching your current skills against the target role",
              "Sorting the missing pieces by depth, not panic",
              "Writing a summary with less fluff and more usefulness",
            ]}
          >
            {skillGap ? (
              <div className="space-y-5">
                <p className="text-sm text-muted-foreground">{skillGap.summary}</p>
                {Object.entries(skillGap.missing_skills).map(([level, items]) => (
                  <div key={level} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <BrainCircuit className="h-4 w-4 text-primary" />
                      <h4 className="font-display text-lg capitalize">{level}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {items.length ? items.map((item) => <Badge key={item}>{item}</Badge>) : <Badge>No panic required here.</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Run the simulation and jobex will politely expose your gaps.</p>
            )}
          </ResultShell>
        </TabsContent>

        <TabsContent value="roadmap">
          <ResultShell
            title="Roadmap Timeline"
            description="Weekly focus, because vague ambition is a terrible project manager."
            loading={isPending && !roadmap}
            loadingSteps={[
              "Sequencing your learning so week one is not week chaos",
              "Balancing study, shipping, and interview prep",
              "Turning the plan into something a busy human could actually follow",
            ]}
          >
            {roadmap ? (
              <div className="space-y-4">
                {roadmap.timeline.map((item) => (
                  <div key={`${item.week}-${item.focus}`} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 lg:grid-cols-[72px_1fr]">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 font-display text-xl text-primary">
                      {item.week}
                    </div>
                    <div>
                      <h4 className="font-display text-xl">{item.focus}</h4>
                      <p className="mt-2 text-sm text-muted-foreground">{item.tasks.join(" • ")}</p>
                      <Separator className="my-4" />
                      <p className="text-sm text-muted-foreground">
                        Resource shortlist: {item.resources.join(", ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No timeline yet. Your future self is staring at us.</p>
            )}
          </ResultShell>
        </TabsContent>

        <TabsContent value="projects">
          <ResultShell
            title="Project Suggestions"
            description="Portfolio ideas that feel employable, not adorable."
            loading={isPending && !projects}
            loadingSteps={[
              "Filtering out tutorial graveyard ideas",
              "Matching projects to your target role and current level",
              "Adding just enough difficulty to look credible, not cursed",
            ]}
          >
            {projects ? (
              <div className="grid gap-4 lg:grid-cols-3">
                {projects.projects.map((project) => (
                  <div key={project.title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                    <h4 className="font-display text-xl">{project.title}</h4>
                    <p className="mt-3 text-sm text-muted-foreground">{project.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {project.tech_stack.map((tech) => (
                        <Badge key={tech}>{tech}</Badge>
                      ))}
                    </div>
                    <p className="mt-4 text-sm text-primary">{project.difficulty}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{project.why_it_matters}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No project suggestions yet. The portfolio cannot assemble itself, tragically.</p>
            )}
          </ResultShell>
        </TabsContent>

        <TabsContent value="switch">
          <ResultShell
            title="Career Switch Simulator"
            description="A strategic preview of the leap before you narrate it as destiny."
            loading={isPending && !careerSwitch}
            loadingSteps={[
              "Checking how much of your old role still counts",
              "Estimating the effort without becoming melodramatic",
              "Writing the switch plan like someone actually has bills",
            ]}
          >
            {careerSwitch ? (
              <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <h4 className="font-display text-xl">Switch snapshot</h4>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">Difficulty: {careerSwitch.difficulty}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Time estimate: {careerSwitch.time_estimate}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Risk level: {careerSwitch.risk_level}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {careerSwitch.transferable_skills.map((skill) => (
                      <Badge key={skill}>{skill}</Badge>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
                  <h4 className="font-display text-xl">Recommended plan</h4>
                  <div className="mt-4 space-y-3">
                    {careerSwitch.plan.map((step, index) => (
                      <div key={step} className="flex gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm text-primary">
                          {index + 1}
                        </div>
                        <p className="pt-1 text-sm text-muted-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No switch simulation yet. The plot twist is still loading.</p>
            )}
          </ResultShell>
        </TabsContent>
      </Tabs>
    </div>
  );
}
