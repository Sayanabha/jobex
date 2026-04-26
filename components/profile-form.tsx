"use client";

import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { targetRoles } from "@/lib/constants";
import {
  canUseSupabaseBrowserClient,
  createSupabaseBrowserClient,
} from "@/supabase/client";
import type { ExperienceLevel, UserProfile } from "@/types";

const defaultProfile: UserProfile = {
  currentRole: "Support Engineer",
  targetRole: "Frontend Developer",
  experienceLevel: "Intermediate",
  skills: ["JavaScript", "CSS", "Customer empathy"],
  yearsOfExperience: 2,
  bio: "I solve user problems, untangle bugs, and want to move closer to product-building work.",
};

function parseSkills(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileForm({
  value,
  onChange,
}: {
  value: UserProfile;
  onChange: (profile: UserProfile) => void;
}) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [profile, setProfile] = useState<UserProfile>(value);
  const [skillsDraft, setSkillsDraft] = useState(value.skills.join(", "));
  const [status, setStatus] = useState(
    canUseSupabaseBrowserClient()
      ? "Using your local draft. Very indie."
      : "Supabase env vars are missing, so profile persistence is currently running on vibes.",
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setProfile(value);
    setSkillsDraft(value.skills.join(", "));
  }, [value]);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase) {
        setProfile(defaultProfile);
        setSkillsDraft(defaultProfile.skills.join(", "));
        onChange(defaultProfile);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setStatus("Not signed in yet, so your profile is living its best temporary life in the browser.");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("current_role,target_role,experience_level,skills,years_of_experience,bio")
        .eq("id", user.id)
        .single();

      if (data) {
        const nextProfile: UserProfile = {
          currentRole: data.current_role,
          targetRole: data.target_role,
          experienceLevel: data.experience_level as ExperienceLevel,
          skills: data.skills ?? [],
          yearsOfExperience: data.years_of_experience ?? 0,
          bio: data.bio ?? "",
        };
        setProfile(nextProfile);
        setSkillsDraft(nextProfile.skills.join(", "));
        onChange(nextProfile);
        setStatus("Loaded from Supabase. Very grown-up.");
      } else {
        setProfile(defaultProfile);
        setSkillsDraft(defaultProfile.skills.join(", "));
        onChange(defaultProfile);
      }
    };

    void loadProfile();
  }, [onChange, supabase]);

  const updateProfile = <K extends keyof UserProfile>(key: K, nextValue: UserProfile[K]) => {
    const nextProfile = { ...profile, [key]: nextValue };
    setProfile(nextProfile);
    onChange(nextProfile);
  };

  const commitSkillsDraft = () => {
    updateProfile("skills", parseSkills(skillsDraft));
  };

  const saveProfile = async () => {
    if (!supabase) {
      setStatus("Add Supabase env vars first, then we can store this brilliance somewhere permanent.");
      return;
    }

    commitSkillsDraft();
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setStatus("Sign in first and then we can store this brilliance somewhere permanent.");
      setSaving(false);
      return;
    }

    const skills = parseSkills(skillsDraft);

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      current_role: profile.currentRole,
      target_role: profile.targetRole,
      experience_level: profile.experienceLevel,
      skills,
      years_of_experience: profile.yearsOfExperience ?? 0,
      bio: profile.bio ?? "",
      updated_at: new Date().toISOString(),
    });

    setStatus(error ? "Supabase said no. Rude, but informative." : "Saved to Supabase. Your future self appreciates the admin.");
    setSaving(false);
  };

  return (
    <Card className="border-white/10">
      <CardHeader>
        <CardTitle>Your Career Snapshot</CardTitle>
        <CardDescription>{status}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Current role</span>
          <Input
            value={profile.currentRole}
            onChange={(event) => updateProfile("currentRole", event.target.value)}
          />
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Target role</span>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm"
            value={profile.targetRole}
            onChange={(event) => updateProfile("targetRole", event.target.value)}
          >
            {targetRoles.map((role) => (
              <option key={role} value={role} className="bg-slate-950">
                {role}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Experience level</span>
          <select
            className="flex h-11 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm"
            value={profile.experienceLevel}
            onChange={(event) => updateProfile("experienceLevel", event.target.value as ExperienceLevel)}
          >
            {["Beginner", "Intermediate", "Advanced"].map((level) => (
              <option key={level} value={level} className="bg-slate-950">
                {level}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2 text-sm">
          <span className="text-muted-foreground">Years of experience</span>
          <Input
            type="number"
            value={profile.yearsOfExperience ?? 0}
            onChange={(event) => updateProfile("yearsOfExperience", Number(event.target.value))}
          />
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Skills (comma-separated)</span>
          <Input
            value={skillsDraft}
            onChange={(event) => setSkillsDraft(event.target.value)}
            onBlur={commitSkillsDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                commitSkillsDraft();
              }
            }}
          />
          <p className="text-xs text-muted-foreground">
            Type naturally here. Spaces and commas are welcome guests now.
          </p>
        </label>
        <label className="space-y-2 text-sm md:col-span-2">
          <span className="text-muted-foreground">Mini bio</span>
          <Textarea
            value={profile.bio ?? ""}
            onChange={(event) => updateProfile("bio", event.target.value)}
            placeholder="Tell jobex who you are without sounding like a LinkedIn carousel."
          />
        </label>
        <div className="md:col-span-2">
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
