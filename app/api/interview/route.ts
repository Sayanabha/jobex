import { NextResponse } from "next/server";

import { simulateInterview } from "@/ai/service";
import type { InterviewTurn, UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      profile: UserProfile;
      chatHistory: InterviewTurn[];
      latestAnswer?: string;
      currentQuestion?: string;
    };

    const result = await simulateInterview(
      body.profile,
      body.chatHistory,
      body.latestAnswer,
      body.currentQuestion,
    );

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Interview simulator lost the plot for a second." }, { status: 500 });
  }
}
