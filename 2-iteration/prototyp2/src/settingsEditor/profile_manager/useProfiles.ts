import type {AllergenProfile} from "@/settingsEditor/profile_manager/AllergenProfile.ts";
import {useCallback, useEffect, useState} from "react";

interface useProfileReturn {
  profiles: AllergenProfile[];
  save: (profile: AllergenProfile) => void;
  remove: (name: string) => void;
}

export default function useProfiles() : useProfileReturn {
  const LS_PROFILES_KEY = "aa_profiles"; // Array<Profile>
  const [profiles, setProfiles] = useState<AllergenProfile[]>([])

  // Load from localStorage
  const loadProfiles = useCallback(() => {
    try {
      const raw = localStorage.getItem(LS_PROFILES_KEY);
      if (raw) {
        setProfiles(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Error loading allergenProfiles: ", e);
    }
  }, [LS_PROFILES_KEY, setProfiles]);

  useEffect(() => {
    loadProfiles();
  }, [loadProfiles])

  // Save to localStorage
  const save = useCallback((toSave: AllergenProfile) => {
    const newProfiles = profiles.push(toSave);
    setProfiles(profiles);
    localStorage.setItem(LS_PROFILES_KEY, JSON.stringify(newProfiles));
  }, [profiles]);

  const remove = useCallback((name: string) => {
    const newProfiles = profiles.filter((profile) => profile.name !== name);
    setProfiles(profiles);
    localStorage.setItem(LS_PROFILES_KEY, JSON.stringify(newProfiles));
  }, [profiles])

  return {profiles, save, remove}
}
