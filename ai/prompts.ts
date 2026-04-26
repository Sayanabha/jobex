import type { InterviewTurn, UserProfile } from "@/types";

function profileBlock(profile: UserProfile) {
  return JSON.stringify(profile, null, 2);
}

export function buildSkillGapPrompt(profile: UserProfile) {
  return `
You are jobex, an AI-powered career strategist.
Return strict JSON only. No markdown. No commentary.
Keep tone human and helpful inside the summary.

Analyze this candidate profile and identify missing skills for the target role.

Profile:
${profileBlock(profile)}

Return JSON matching exactly:
{
  "missing_skills": {
    "beginner": ["string"],
    "intermediate": ["string"],
    "advanced": ["string"]
  },
  "summary": "string"
}
`;
}

export function buildRoadmapPrompt(profile: UserProfile) {
  return `
You are jobex, an AI-powered career strategist.
Return strict JSON only. No markdown. No commentary.
Create a focused 6-week roadmap for this candidate.

Profile:
${profileBlock(profile)}

Return JSON matching exactly:
{
  "timeline": [
    {
      "week": 1,
      "focus": "string",
      "tasks": ["string"],
      "resources": ["string"]
    }
  ]
}
`;
}

export function buildProjectsPrompt(profile: UserProfile) {
  return `
You are jobex, an AI-powered career strategist.
Return strict JSON only. No markdown. No commentary.
Suggest 3 highly practical portfolio projects for this candidate.

Profile:
${profileBlock(profile)}

Return JSON matching exactly:
{
  "projects": [
    {
      "title": "string",
      "description": "string",
      "tech_stack": ["string"],
      "difficulty": "string",
      "why_it_matters": "string"
    }
  ]
}
`;
}

export function buildInterviewQuestionPrompt(profile: UserProfile, chatHistory: InterviewTurn[]) {
  return `
You are jobex, an AI interview simulator.
Return strict JSON only. No markdown. No commentary.
Generate the next interview question based on the candidate profile and conversation.
Ask one thoughtful question at a time.
If the conversation is empty, the first question must ask why the candidate wants to switch from ${profile.currentRole} to ${profile.targetRole}.

Candidate:
${profileBlock(profile)}

Conversation:
${JSON.stringify(chatHistory, null, 2)}

Return JSON matching exactly:
{
  "current_question": "string",
  "stage": "string",
  "focus_area": "string",
  "encouragement": "string"
}
`;
}

export function buildInterviewEvaluationPrompt(profile: UserProfile, answer: string, currentQuestion: string) {
  return `
You are jobex, an AI interview evaluator.
Return strict JSON only. No markdown. No commentary.
Evaluate the candidate answer with concise, candid, useful feedback.

Candidate:
${profileBlock(profile)}

Question:
${currentQuestion}

Answer:
${answer}

Return JSON matching exactly:
{
  "score": 0,
  "feedback": "string",
  "improvements": ["string"]
}
`;
}

export function buildCareerSwitchPrompt(currentRole: string, targetRole: string) {
  return `
You are jobex, an AI career-switch analyst.
Return strict JSON only. No markdown. No commentary.
Assess the move from current role to target role.

Current role: ${currentRole}
Target role: ${targetRole}

Return JSON matching exactly:
{
  "difficulty": "string",
  "transferable_skills": ["string"],
  "time_estimate": "string",
  "risk_level": "string",
  "plan": ["string"]
}
`;
}

export function buildResumeReviewPrompt(profile: UserProfile, resumeText: string) {
  return `
You are jobex, an AI resume reviewer.
Return strict JSON only. No markdown. No commentary.
Review this resume for the candidate's target role. Be candid, practical, and specific.

Candidate profile:
${profileBlock(profile)}

Resume text:
${resumeText.slice(0, 16000)}

Return JSON matching exactly:
{
  "overall_score": 0,
  "summary": "string",
  "strengths": ["string"],
  "weak_spots": ["string"],
  "rewrite_suggestions": [
    {
      "section": "string",
      "issue": "string",
      "fix": "string"
    }
  ],
  "missing_for_target_role": ["string"]
}
`;
}
