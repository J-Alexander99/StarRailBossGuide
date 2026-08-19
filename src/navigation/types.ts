// Param lists for each navigator, shared between App.tsx (where the
// navigators are created) and the screens that read route params or call
// navigation.navigate(...) within their own stack. Centralizing these means
// a screen's route/navigation props are checked against the same shape the
// navigator actually declares, instead of each screen typing them as `any`.
export type HomeStackParamList = {
  HomeMain: undefined;
  LiveEvents: undefined;
};

export type CharactersStackParamList = {
  CharactersList: undefined;
  CharacterDetail: { characterId: string };
  Teams: undefined;
};

export type BossesStackParamList = {
  BossList: undefined;
  BossDetail: { bossId: string };
};

export type RootTabParamList = {
  Home: undefined;
  Characters: undefined;
  Bosses: undefined;
  Settings: undefined;
};
