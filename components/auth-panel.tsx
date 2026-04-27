"use client";

import { useState } from "react";
import { Loader2, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { canUseSupabaseBrowserClient, createSupabaseBrowserClient } from "@/supabase/client";

export function AuthPanel() {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [email, setEmail] = useState("test-user@dev.com");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(
    canUseSupabaseBrowserClient()
      ? "Sign in with the shared demo account."
      : "Add your Supabase env keys and this panel will stop being a gorgeous placeholder.",
  );
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    if (!supabase) {
      setMessage("Supabase env vars are missing, so auth is currently all outfit and no engine.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Signed in. Welcome to the chaos, strategically managed.");
      window.location.reload();
    }

    setLoading(false);
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle>Sign in without suffering</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Input
          placeholder="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <Input
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void signIn();
          }}
        />
        <Button onClick={signIn} disabled={loading || !email || !password || !supabase} className="w-full">
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
          Sign in
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Use <span className="text-primary">test-user@dev.com</span> with the shared password.
        </p>
      </CardContent>
    </Card>
  );
}