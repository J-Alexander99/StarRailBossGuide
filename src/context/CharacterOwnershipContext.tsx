import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DISABLED_CHARACTER_STORAGE_KEY = "bossguide:disabledCharacterIds";

export type CharacterOwnershipContextValue = {
  disabledCharacterIds: Set<string>;
  disabledCharacterList: string[];
  isCharacterOwned: (characterId: string) => boolean;
  isCharacterDisabled: (characterId: string) => boolean;
  toggleCharacterOwnership: (characterId: string) => void;
  setCharacterOwned: (characterId: string, owned: boolean) => void;
  resetOwnership: () => void;
};

const CharacterOwnershipContext = createContext<
  CharacterOwnershipContextValue | undefined
>(undefined);

export const CharacterOwnershipProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const hasHydratedFromStorage = useRef(false);
  const [disabledCharacterIds, setDisabledCharacterIds] = useState<Set<string>>(
    () => new Set(),
  );

  useEffect(() => {
    const hydrateOwnership = async () => {
      try {
        const raw = await AsyncStorage.getItem(DISABLED_CHARACTER_STORAGE_KEY);
        if (!raw) {
          return;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setDisabledCharacterIds(
            new Set(parsed.filter((id) => typeof id === "string")),
          );
        }
      } catch {
        // Keep defaults if persisted settings cannot be read.
      } finally {
        hasHydratedFromStorage.current = true;
      }
    };

    hydrateOwnership();
  }, []);

  useEffect(() => {
    if (!hasHydratedFromStorage.current) {
      return;
    }

    const persistOwnership = async () => {
      try {
        await AsyncStorage.setItem(
          DISABLED_CHARACTER_STORAGE_KEY,
          JSON.stringify(Array.from(disabledCharacterIds)),
        );
      } catch {
        // Ignore write failures so the app remains usable.
      }
    };

    persistOwnership();
  }, [disabledCharacterIds]);

  const toggleCharacterOwnership = useCallback((characterId: string) => {
    setDisabledCharacterIds((previous) => {
      const next = new Set(previous);
      if (next.has(characterId)) {
        next.delete(characterId);
      } else {
        next.add(characterId);
      }
      return next;
    });
  }, []);

  const setCharacterOwned = useCallback(
    (characterId: string, owned: boolean) => {
      setDisabledCharacterIds((previous) => {
        const next = new Set(previous);
        if (owned) {
          next.delete(characterId);
        } else {
          next.add(characterId);
        }
        return next;
      });
    },
    [],
  );

  const resetOwnership = useCallback(() => {
    setDisabledCharacterIds(new Set());
  }, []);

  const isCharacterOwned = useCallback(
    (characterId: string) => !disabledCharacterIds.has(characterId),
    [disabledCharacterIds],
  );

  const isCharacterDisabled = useCallback(
    (characterId: string) => disabledCharacterIds.has(characterId),
    [disabledCharacterIds],
  );

  const contextValue = useMemo<CharacterOwnershipContextValue>(
    () => ({
      disabledCharacterIds,
      disabledCharacterList: Array.from(disabledCharacterIds),
      isCharacterOwned,
      isCharacterDisabled,
      toggleCharacterOwnership,
      setCharacterOwned,
      resetOwnership,
    }),
    [
      disabledCharacterIds,
      isCharacterOwned,
      isCharacterDisabled,
      toggleCharacterOwnership,
      setCharacterOwned,
      resetOwnership,
    ],
  );

  return (
    <CharacterOwnershipContext.Provider value={contextValue}>
      {children}
    </CharacterOwnershipContext.Provider>
  );
};

export const useCharacterOwnership = () => {
  const context = useContext(CharacterOwnershipContext);
  if (!context) {
    throw new Error(
      "useCharacterOwnership must be used within a CharacterOwnershipProvider"
    );
  }
  return context;
};
