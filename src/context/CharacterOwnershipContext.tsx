import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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
  const [disabledCharacterIds, setDisabledCharacterIds] = useState<Set<string>>(
    () => new Set()
  );

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
    []
  );

  const resetOwnership = useCallback(() => {
    setDisabledCharacterIds(new Set());
  }, []);

  const isCharacterOwned = useCallback(
    (characterId: string) => !disabledCharacterIds.has(characterId),
    [disabledCharacterIds]
  );

  const isCharacterDisabled = useCallback(
    (characterId: string) => disabledCharacterIds.has(characterId),
    [disabledCharacterIds]
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
    ]
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
