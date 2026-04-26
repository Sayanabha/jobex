import { z } from "zod";

export const skillGapSchema = z.object({
  missing_skills: z.object({
    beginner: z.array(z.string()),
    intermediate: z.array(z.string()),
    advanced: z.array(z.string()),
  }),
  summary: z.string(),
});

export const roadmapSchema = z.object({
  timeline: z.array(
    z.object({
      week: z.number(),
      focus: z.string(),
      tasks: z.array(z.string()),
      resources: z.array(z.string()),
    }),
  ),
});

export const projectsSchema = z.object({
  projects: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      tech_stack: z.array(z.string()),
      difficulty: z.string(),
      why_it_matters: z.string(),
    }),
  ),
});

export const interviewPromptSchema = z.object({
  current_question: z.string(),
  stage: z.string(),
  focus_area: z.string(),
  encouragement: z.string(),
});

export const interviewEvaluationSchema = z.object({
  score: z.number().min(0).max(100),
  feedback: z.string(),
  improvements: z.array(z.string()),
});

export const careerSwitchSchema = z.object({
  difficulty: z.string(),
  transferable_skills: z.array(z.string()),
  time_estimate: z.string(),
  risk_level: z.string(),
  plan: z.array(z.string()),
});

export const resumeReviewSchema = z.object({
  overall_score: z.number().min(0).max(100),
  summary: z.string(),
  strengths: z.array(z.string()),
  weak_spots: z.array(z.string()),
  rewrite_suggestions: z.array(
    z.object({
      section: z.string(),
      issue: z.string(),
      fix: z.string(),
    }),
  ),
  missing_for_target_role: z.array(z.string()),
});
