import { NextResponse } from "next/server";

import { generateProjects } from "@/ai/service";
import type { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = (await request.json()) as UserProfile;
    const result = await generateProjects(profile);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Project recommendations are temporarily off making a mood board." }, { status: 500 });
  }
}
