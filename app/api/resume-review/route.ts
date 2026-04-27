import { NextResponse } from "next/server";

import { generateResumeReview } from "@/ai/service";
import type { UserProfile } from "@/types";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const profileRaw = formData.get("profile");
    if (!profileRaw || typeof profileRaw !== "string") {
      return NextResponse.json({ error: "Missing profile" }, { status: 400 });
    }

    const profile = JSON.parse(profileRaw) as UserProfile;

    // Try pasted text first
    let resumeText = (formData.get("resumeText") as string | null)?.trim() ?? "";

    // If no pasted text, extract from file
    if (!resumeText) {
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No resume content provided" }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();

      if (fileName.endsWith(".txt")) {
        resumeText = await file.text();
      } else if (fileName.endsWith(".pdf")) {
        // PDF: extract raw text (basic, works for most text-based PDFs)
        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        const raw = new TextDecoder("latin1").decode(uint8);
        // Pull readable ASCII strings from the binary blob
        const matches = raw.match(/[\x20-\x7E\r\n]{4,}/g) ?? [];
        resumeText = matches.join(" ").replace(/\s+/g, " ").trim();
        if (resumeText.length < 100) {
          return NextResponse.json(
            { error: "Could not extract text from this PDF. Try pasting the text directly instead." },
            { status: 422 },
          );
        }
      } else if (fileName.endsWith(".docx")) {
        // DOCX: pull raw XML text (no extra deps needed)
        const buffer = await file.arrayBuffer();
        const uint8 = new Uint8Array(buffer);
        const raw = new TextDecoder("utf-8").decode(uint8);
        const matches = raw.match(/<w:t[^>]*>([^<]+)<\/w:t>/g) ?? [];
        resumeText = matches
          .map((m) => m.replace(/<[^>]+>/g, ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (resumeText.length < 100) {
          return NextResponse.json(
            { error: "Could not extract text from this DOCX. Try pasting the text directly instead." },
            { status: 422 },
          );
        }
      } else {
        return NextResponse.json({ error: "Unsupported file type. Use PDF, DOCX, or TXT." }, { status: 415 });
      }
    }

    const result = await generateResumeReview(profile, resumeText);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "Resume review exploded internally. Try pasting the text directly." },
      { status: 500 },
    );
  }
}