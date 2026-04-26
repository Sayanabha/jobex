import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

import { generateResumeReview } from "@/ai/service";
import type { UserProfile } from "@/types";

export const runtime = "nodejs";

async function extractResumeText(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());

  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    try {
      const parsed = await parser.getText();
      return parsed.text;
    } finally {
      await parser.destroy();
    }
  }

  if (
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    file.name.toLowerCase().endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return parsed.value;
  }

  return buffer.toString("utf-8");
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const profileRaw = formData.get("profile");
    const resumeTextRaw = formData.get("resumeText");
    const file = formData.get("file");

    if (!profileRaw || typeof profileRaw !== "string") {
      return NextResponse.json({ error: "Profile data is missing, which makes the critique a bit psychic." }, { status: 400 });
    }

    const profile = JSON.parse(profileRaw) as UserProfile;
    let resumeText = typeof resumeTextRaw === "string" ? resumeTextRaw.trim() : "";

    if (!resumeText && file instanceof File) {
      resumeText = (await extractResumeText(file)).trim();
    }

    if (!resumeText) {
      return NextResponse.json({ error: "Please upload a resume or paste the text. Mind reading is still in beta." }, { status: 400 });
    }

    const result = await generateResumeReview(profile, resumeText);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resume review stumbled over a paperclip and fell down the stairs.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
