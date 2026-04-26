import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractJsonPayload(text: string) {
  const sanitized = text.replace(/```json|```/g, "").trim();
  const match = sanitized.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match?.[0] ?? sanitized;
}
