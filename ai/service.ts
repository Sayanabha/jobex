import { ZodSchema } from "zod";

import { groqConfig, model } from "@/ai/client";
import {
  fallbackCareerSwitch,
  fallbackInterviewEvaluation,
  fallbackInterviewPrompt,
  fallbackProjects,
  fallbackResumeReview,
  fallbackRoadmap,
  fallbackSkillGap,
} from "@/ai/fallbacks";
import {
  buildCareerSwitchPrompt,
  buildInterviewEvaluationPrompt,
  buildInterviewQuestionPrompt,
  buildProjectsPrompt,
  buildResumeReviewPrompt,
  buildRoadmapPrompt,
  buildSkillGapPrompt,
} from "@/ai/prompts";
import {
  careerSwitchSchema,
  interviewEvaluationSchema,
  interviewPromptSchema,
  projectsSchema,
  resumeReviewSchema,
  roadmapSchema,
  skillGapSchema,
} from "@/ai/schemas";
import { extractJsonPayload } from "@/lib/utils";
import type {
  CareerSwitchResult,
  InterviewEvaluationResult,
  InterviewPromptResult,
  InterviewTurn,
  ProjectsResult,
  ResumeReviewResult,
  RoadmapResult,
  SkillGapResult,
  UserProfile,
} from "@/types";

type ProviderName = "gemini" | "groq" | "local";

function buildInitialInterviewQuestion(profile: UserProfile): InterviewPromptResult {
  return {
    current_question: `Why do you want to switch from ${profile.currentRole} to ${profile.targetRole}, and why now?`,
    stage: "opening",
    focus_area: "career-switch-motivation",
    encouragement: "Use real moments from your work. Sudden destiny is less convincing than evidence.",
  };
}

async function generateWithGemini<T>(prompt: string, schema: ZodSchema<T>): Promise<T> {
  if (!model) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const payload = extractJsonPayload(text);
  return schema.parse(JSON.parse(payload));
}

async function generateWithGroq<T>(prompt: string, schema: ZodSchema<T>): Promise<T> {
  if (!groqConfig) {
    throw new Error("Missing GROQ_API_KEY");
  }

  const response = await fetch(groqConfig.baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${groqConfig.apiKey}`,
    },
    body: JSON.stringify({
      model: groqConfig.model,
      temperature: 0.4,
      response_format: {
        type: "json_object",
      },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error("Groq request failed");
  }

  const json = (await response.json()) as {
    choices?: Array<{
      message?: {
        content?: string;
      };
    }>;
  };

  const text = json.choices?.[0]?.message?.content;
  if (!text) {
    throw new Error("Groq returned an empty response");
  }

  const payload = extractJsonPayload(text);
  return schema.parse(JSON.parse(payload));
}

async function generateStrictJson<T>(
  prompt: string,
  schema: ZodSchema<T>,
): Promise<{ data: T; provider: Exclude<ProviderName, "local"> }> {
  try {
    return {
      data: await generateWithGemini(prompt, schema),
      provider: "gemini",
    };
  } catch {
    return {
      data: await generateWithGroq(prompt, schema),
      provider: "groq",
    };
  }
}

export async function generateSkillGap(profile: UserProfile) {
  try {
    const result = await generateStrictJson(buildSkillGapPrompt(profile), skillGapSchema);
    return {
      data: result.data,
      fallback: result.provider !== "gemini",
      provider: result.provider,
    };
  } catch {
    return {
      data: fallbackSkillGap(profile),
      fallback: true,
      provider: "local" as const,
    };
  }
}

export async function generateRoadmap(profile: UserProfile) {
  try {
    const result = await generateStrictJson(buildRoadmapPrompt(profile), roadmapSchema);
    return {
      data: result.data,
      fallback: result.provider !== "gemini",
      provider: result.provider,
    };
  } catch {
    return {
      data: fallbackRoadmap(profile),
      fallback: true,
      provider: "local" as const,
    };
  }
}

export async function generateProjects(profile: UserProfile) {
  try {
    const result = await generateStrictJson(buildProjectsPrompt(profile), projectsSchema);
    return {
      data: result.data,
      fallback: result.provider !== "gemini",
      provider: result.provider,
    };
  } catch {
    return {
      data: fallbackProjects(profile),
      fallback: true,
      provider: "local" as const,
    };
  }
}

export async function generateResumeReview(profile: UserProfile, resumeText: string) {
  try {
    const result = await generateStrictJson(
      buildResumeReviewPrompt(profile, resumeText),
      resumeReviewSchema,
    );
    return {
      data: result.data,
      fallback: result.provider !== "gemini",
      provider: result.provider,
    };
  } catch {
    return {
      data: fallbackResumeReview(profile),
      fallback: true,
      provider: "local" as const,
    };
  }
}

export async function simulateInterview(
  profile: UserProfile,
  chatHistory: InterviewTurn[],
  latestAnswer?: string,
  currentQuestion?: string,
): Promise<{
  question: InterviewPromptResult;
  evaluation?: InterviewEvaluationResult;
  fallback?: boolean;
  provider?: ProviderName;
}> {
  if (chatHistory.length === 0 && !latestAnswer) {
    return {
      question: buildInitialInterviewQuestion(profile),
      fallback: false,
      provider: "local",
    };
  }

  try {
    const questionResult = await generateStrictJson(
      buildInterviewQuestionPrompt(profile, chatHistory),
      interviewPromptSchema,
    );

    let evaluation: InterviewEvaluationResult | undefined;
    let provider: ProviderName = questionResult.provider;

    if (latestAnswer && currentQuestion) {
      const evaluationResult = await generateStrictJson(
        buildInterviewEvaluationPrompt(profile, latestAnswer, currentQuestion),
        interviewEvaluationSchema,
      );
      evaluation = evaluationResult.data;
      provider = evaluationResult.provider;
    }

    return {
      question: questionResult.data,
      evaluation,
      fallback: provider !== "gemini",
      provider,
    };
  } catch {
    return {
      question: fallbackInterviewPrompt(profile),
      evaluation: latestAnswer ? fallbackInterviewEvaluation() : undefined,
      fallback: true,
      provider: "local",
    };
  }
}

export async function simulateCareerSwitch(currentRole: string, targetRole: string) {
  try {
    const result = await generateStrictJson(
      buildCareerSwitchPrompt(currentRole, targetRole),
      careerSwitchSchema,
    );
    return {
      data: result.data,
      fallback: result.provider !== "gemini",
      provider: result.provider,
    };
  } catch {
    return {
      data: fallbackCareerSwitch(currentRole, targetRole),
      fallback: true,
      provider: "local" as const,
    };
  }
}

export type {
  CareerSwitchResult,
  InterviewEvaluationResult,
  InterviewPromptResult,
  ProjectsResult,
  ResumeReviewResult,
  RoadmapResult,
  SkillGapResult,
};
