import { NextResponse } from "next/server";

import { simulateCareerSwitch } from "@/ai/service";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      currentRole: string;
      targetRole: string;
    };
    const result = await simulateCareerSwitch(body.currentRole, body.targetRole);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Career switch simulator is currently recalculating your life choices." }, { status: 500 });
  }
}
