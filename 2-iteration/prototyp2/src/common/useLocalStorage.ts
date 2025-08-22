import {useCallback, useEffect, useState} from "react";

export interface LocalStorageReturn<T> {
  value: T,
  set: (value: T) => void,
}

export function useLocalStorage<T>(id: string, initialValue: T): LocalStorageReturn<T> {
  const [value, setValue] = useState<T>(initialValue)

  const loadProfiles = useCallback(() => {
    try {
      const raw = localStorage.getItem(id);
      if (raw) {
        setValue(JSON.parse(raw));
      }
    } catch (e) {
      console.error("Error loading allergenProfiles: ", e);
    }
  }, [id, setValue]);

  useEffect(() => loadProfiles(), [loadProfiles, id]);

  const save = useCallback((value: T) => {
    localStorage.setItem(id, JSON.stringify(value));
    loadProfiles();
  }, [id, loadProfiles]);

  return {value: value, set: save };
}
