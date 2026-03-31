import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_APP_PREFERENCES,
  getAppPreferences,
  setAppPreferences,
  type AppPreferences,
} from "../services/appPreferences";

type AppPreferencesContextValue = {
  preferences: AppPreferences;
  updatePreferences: (updates: Partial<AppPreferences>) => Promise<void>;
  isHydrated: boolean;
};

const AppPreferencesContext = createContext<AppPreferencesContextValue | undefined>(
  undefined,
);

export function AppPreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<AppPreferences>(
    DEFAULT_APP_PREFERENCES,
  );
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      const saved = await getAppPreferences();
      setPreferences(saved);
      setIsHydrated(true);
    };

    hydrate();
  }, []);

  const updatePreferences = useCallback(
    async (updates: Partial<AppPreferences>) => {
      const next = {
        ...preferences,
        ...updates,
      };

      setPreferences(next);
      await setAppPreferences(next);
    },
    [preferences],
  );

  const value = useMemo(
    () => ({
      preferences,
      updatePreferences,
      isHydrated,
    }),
    [preferences, updatePreferences, isHydrated],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}

export function useAppPreferences() {
  const context = useContext(AppPreferencesContext);
  if (!context) {
    throw new Error("useAppPreferences must be used within AppPreferencesProvider");
  }

  return context;
}
