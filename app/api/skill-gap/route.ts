import { NextResponse } from "next/server";

import { generateSkillGap } from "@/ai/service";
import type { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = (await request.json()) as UserProfile;
    const result = await generateSkillGap(profile);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Skill gap engine tripped over its own shoelaces." }, { status: 500 });
  }
}
