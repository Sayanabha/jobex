import type {
  CareerSwitchResult,
  InterviewEvaluationResult,
  InterviewPromptResult,
  ProjectsResult,
  ResumeReviewResult,
  RoadmapResult,
  SkillGapResult,
  UserProfile,
} from "@/types";

export function fallbackSkillGap(profile: UserProfile): SkillGapResult {
  return {
    missing_skills: {
      beginner: ["Role-specific terminology", "Core workflow habits"],
      intermediate: ["Production tooling", "Portfolio-ready delivery"],
      advanced: ["System thinking", "Business communication"],
    },
    summary: `${profile.targetRole} is absolutely doable; the real trick is packaging your current strengths into proof that hiring managers can feel in their spreadsheet-loving souls.`,
  };
}

export function fallbackRoadmap(profile: UserProfile): RoadmapResult {
  return {
    timeline: [
      {
        week: 1,
        focus: `Decode the real shape of a ${profile.targetRole} role`,
        tasks: ["Audit what you already know", "Pick one focused learning track", "Set a weekly practice window"],
        resources: ["Official docs", "One sharp YouTube crash course", "A role-specific newsletter"],
      },
      {
        week: 2,
        focus: "Build a small but useful proof-of-work project",
        tasks: ["Recreate one realistic workflow", "Document tradeoffs", "Share progress with screenshots"],
        resources: ["GitHub examples", "Kaggle or Frontend Mentor", "A community Discord"],
      },
      {
        week: 3,
        focus: "Upgrade quality so your work stops looking like a tutorial aftermath",
        tasks: ["Refactor one messy area", "Add tests or validation", "Write a polished case study"],
        resources: ["Testing docs", "Case-study templates", "One peer review buddy"],
      },
      {
        week: 4,
        focus: "Prepare for interviews and applications like a civilized person",
        tasks: ["Practice common questions", "Tailor your resume", "Apply to five aligned roles"],
        resources: ["Mock interview notes", "Resume checklist", "Target company list"],
      },
    ],
  };
}

export function fallbackProjects(profile: UserProfile): ProjectsResult {
  return {
    projects: [
      {
        title: `${profile.targetRole} signal booster`,
        description: "Build one compact, polished product that mirrors the workflow teams actually pay for.",
        tech_stack: [profile.targetRole.split(" ")[0], "TypeScript", "API integration"],
        difficulty: "Intermediate",
        why_it_matters: "It proves you can turn knowledge into output, which is the professional version of magic.",
      },
      {
        title: "Messy input, elegant outcome",
        description: "Take a chaotic brief or raw dataset and produce something decision-ready and oddly satisfying.",
        tech_stack: ["Data modeling", "UI or reporting layer", "Documentation"],
        difficulty: "Intermediate",
        why_it_matters: "Real work is rarely clean. Showing taste under chaos makes you instantly more believable.",
      },
    ],
  };
}

export function fallbackInterviewPrompt(profile: UserProfile): InterviewPromptResult {
  return {
    current_question: `Why do you want to switch from ${profile.currentRole} to ${profile.targetRole}, and why does this move make sense for you right now?`,
    stage: "opening",
    focus_area: "career-switch-motivation",
    encouragement: "Keep it concrete. Ambition is lovely, but reasons still pay rent.",
  };
}

export function fallbackInterviewEvaluation(): InterviewEvaluationResult {
  return {
    score: 72,
    feedback: "Promising answer. You sound thoughtful, but you need one sharper example and a cleaner outcome statement.",
    improvements: [
      "Lead with a specific achievement",
      "Mention measurable impact",
      "Tie your answer back to the role's day-to-day work",
    ],
  };
}

export function fallbackCareerSwitch(currentRole: string, targetRole: string): CareerSwitchResult {
  return {
    difficulty: "Moderate",
    transferable_skills: ["Problem solving", "Stakeholder communication", "Domain understanding"],
    time_estimate: "3 to 6 months with focused weekly effort",
    risk_level: "Manageable if you build visible proof before making a leap worthy of cinema",
    plan: [
      `Map the overlap between ${currentRole} and ${targetRole}`,
      "Close the top three role-specific gaps",
      "Ship two portfolio pieces that feel unreasonably credible",
      "Practice interviews with outcome-focused stories",
    ],
  };
}

export function fallbackResumeReview(profile: UserProfile): ResumeReviewResult {
  return {
    overall_score: 68,
    summary: `Your resume has promising raw material, but it still needs sharper evidence for ${profile.targetRole} instead of politely hoping the recruiter fills in the blanks.`,
    strengths: [
      "Clear career direction",
      "Relevant baseline skills are visible",
      "Experience can be reframed into stronger impact statements",
    ],
    weak_spots: [
      "Too few quantified outcomes",
      "Target-role keywords are underrepresented",
      "Project and achievement bullets need more specificity",
    ],
    rewrite_suggestions: [
      {
        section: "Experience",
        issue: "Bullets describe duties more than impact.",
        fix: "Rewrite bullets to show what changed, improved, or shipped because of your work.",
      },
      {
        section: "Projects",
        issue: "Projects may not map tightly enough to the target role.",
        fix: "Add two role-relevant projects with stack, scope, and measurable outcomes.",
      },
      {
        section: "Skills",
        issue: "The stack looks broad but not prioritized.",
        fix: "Move the most relevant tools for the target role to the front and trim filler.",
      },
    ],
    missing_for_target_role: [
      "Target-role keywords",
      "Metrics and business impact",
      "Role-aligned project proof",
    ],
  };
}
