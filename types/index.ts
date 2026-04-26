export type ExperienceLevel = "Beginner" | "Intermediate" | "Advanced";

export interface UserProfile {
  name?: string;
  currentRole: string;
  targetRole: string;
  experienceLevel: ExperienceLevel;
  skills: string[];
  yearsOfExperience?: number;
  bio?: string;
}

export interface SkillGapResult {
  missing_skills: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
  summary: string;
}

export interface RoadmapResult {
  timeline: Array<{
    week: number;
    focus: string;
    tasks: string[];
    resources: string[];
  }>;
}

export interface ProjectsResult {
  projects: Array<{
    title: string;
    description: string;
    tech_stack: string[];
    difficulty: string;
    why_it_matters: string;
  }>;
}

export interface InterviewTurn {
  role: "assistant" | "user";
  content: string;
}

export interface InterviewPromptResult {
  current_question: string;
  stage: string;
  focus_area: string;
  encouragement: string;
}

export interface InterviewEvaluationResult {
  score: number;
  feedback: string;
  improvements: string[];
}

export interface CareerSwitchResult {
  difficulty: string;
  transferable_skills: string[];
  time_estimate: string;
  risk_level: string;
  plan: string[];
}

export interface ResumeReviewResult {
  overall_score: number;
  summary: string;
  strengths: string[];
  weak_spots: string[];
  rewrite_suggestions: Array<{
    section: string;
    issue: string;
    fix: string;
  }>;
  missing_for_target_role: string[];
}

export interface ApiSuccess<T> {
  data: T;
  fallback?: boolean;
  provider?: "gemini" | "groq" | "local";
}

export interface ApiError {
  error: string;
}
