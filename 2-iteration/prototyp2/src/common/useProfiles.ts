import type {AllergenProfile} from "@/common/AllergenProfile.ts";
import {useCallback} from "react";
import {useLocalStorage} from "@/common/useLocalStorage.ts";

interface useProfileReturn {
  profiles: AllergenProfile[];
  save: (profile: AllergenProfile) => void;
  remove: (name: string) => void;
}

export default function useProfiles() : useProfileReturn {
  const LS_PROFILES_KEY = "allergenProfiles";
  const {value, set} = useLocalStorage<AllergenProfile[]>(LS_PROFILES_KEY, []);

  const save = useCallback((toSave: AllergenProfile) => {
    set([...value, toSave]);
  }, [value, set]);

  const remove = useCallback((name: string) => {
    set(value.filter((profile) => profile.name !== name));
  }, [value, set]);

  return { profiles: value, save, remove }
}
