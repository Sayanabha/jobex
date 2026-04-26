"use client";

import { useState } from "react";
import { Github, Loader2, Mail } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "@/supabase/client";

export function AuthPanel() {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(
    canUseSupabaseBrowserClient()
      ? "Email magic link or OAuth. Low drama, high utility."
      : "Add your Supabase env keys and this panel will stop being a gorgeous placeholder.",
  );
  const [loading, setLoading] = useState(false);

  const origin =
    typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;

  const signInWithMagicLink = async () => {
    if (!supabase) {
      setMessage("Supabase env vars are missing, so auth is currently all outfit and no engine.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: origin,
      },
    });
    setMessage(error ? error.message : "Magic link sent. Check your inbox and maybe your spam dungeon too.");
    setLoading(false);
  };

  const signInWithProvider = async (provider: "google" | "github") => {
    if (!supabase) {
      setMessage("Supabase env vars are missing, so OAuth is taking a respectful day off.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: origin,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle>Sign in without suffering</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-3">
          <Input
            placeholder="you@future-legend.dev"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button onClick={signInWithMagicLink} disabled={loading || !email || !supabase}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={() => signInWithProvider("google")} disabled={loading || !supabase}>
            Continue with Google
          </Button>
          <Button variant="outline" onClick={() => signInWithProvider("github")} disabled={loading || !supabase}>
            <Github className="mr-2 h-4 w-4" />
            Continue with GitHub
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
