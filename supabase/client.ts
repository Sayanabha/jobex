"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export function canUseSupabaseBrowserClient() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function createSupabaseBrowserClient() {
  if (!canUseSupabaseBrowserClient()) {
    return null;
  }

  return createClientComponentClient();
}
