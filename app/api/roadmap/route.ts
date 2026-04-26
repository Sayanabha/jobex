import { NextResponse } from "next/server";

import { generateRoadmap } from "@/ai/service";
import type { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const profile = (await request.json()) as UserProfile;
    const result = await generateRoadmap(profile);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Roadmap generator had a dramatic little moment." }, { status: 500 });
  }
}
