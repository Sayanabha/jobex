const requiredPublicKeys = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function getMissingEnvKeys() {
  return requiredPublicKeys.filter((key) => !process.env[key]);
}

export function hasGeminiKey() {
  return Boolean(process.env.GEMINI_API_KEY);
}

export function hasGroqKey() {
  return Boolean(process.env.GROQ_API_KEY);
}
