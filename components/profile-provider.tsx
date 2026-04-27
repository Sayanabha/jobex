"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { createSupabaseBrowserClient } from "@/supabase/client";
import type { ExperienceLevel, UserProfile } from "@/types";

const fallbackProfile: UserProfile = {
  currentRole: "Dotnet Engineer",
  targetRole: "Frontend Developer",
  experienceLevel: "Intermediate",
  skills: ["JavaScript", "CSS", "Customer empathy"],
  yearsOfExperience: 2,
  bio: "I solve user problems, untangle bugs, and want to move closer to product-building work.",
};

type ProfileContextValue = {
  profile: UserProfile;
  setProfile: (p: UserProfile) => void;
  profileReady: boolean;
  profileNote: string | null;
};

const ProfileContext = createContext<ProfileContextValue>({
  profile: fallbackProfile,
  setProfile: () => {},
  profileReady: false,
  profileNote: null,
});

export function useProfile() {
  return useContext(ProfileContext);
}

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createSupabaseBrowserClient());
  const [profile, setProfileState] = useState<UserProfile>(fallbackProfile);
  const [profileReady, setProfileReady] = useState(false);
  const [profileNote, setProfileNote] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!supabase) {
        setProfileNote("Supabase not configured — using demo profile.");
        setProfileReady(true);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setProfileNote("Not signed in — using a demo profile.");
        setProfileReady(true);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("current_role,target_role,experience_level,skills,years_of_experience,bio")
        .eq("id", user.id)
        .single();

      if (data) {
        setProfileState({
          currentRole: data.current_role,
          targetRole: data.target_role,
          experienceLevel: data.experience_level as ExperienceLevel,
          skills: data.skills ?? [],
          yearsOfExperience: data.years_of_experience ?? 0,
          bio: data.bio ?? "",
        });
        setProfileNote(`Loaded profile: ${data.current_role} → ${data.target_role}`);
      } else {
        setProfileNote("No saved profile found — using demo profile. Save your profile on the dashboard first.");
      }

      setProfileReady(true);
    };

    void loadProfile();
  }, [supabase]);

  const setProfile = useCallback((p: UserProfile) => {
    setProfileState(p);
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, profileReady, profileNote }}>
      {children}
    </ProfileContext.Provider>
  );
}