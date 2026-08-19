import type { EffectivenessScore } from "../data/bosses";

/**
 * Shared color lookups used across screens (element/path/role/meta chips,
 * boss effectiveness badges). Previously each screen defined its own copy of
 * these maps, which let them drift out of sync — e.g. the same effectiveness
 * score rendered a different color on the boss list vs. a boss's detail
 * screen. Keep this the single source of truth and import from here instead
 * of redefining locally.
 */

export const hexToRgba = (hex: string, alpha: number): string => {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) return hex;
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const ELEMENT_COLORS: Record<string, string> = {
  Physical: "#ec4899",
  Fire: "#f97316",
  Ice: "#38bdf8",
  Lightning: "#a855f7",
  Wind: "#22d3ee",
  Quantum: "#8b5cf6",
  Imaginary: "#facc15",
  All: "#94a3b8",
};

export const PATH_COLORS: Record<string, string> = {
  Destruction: "#ef4444",
  Hunt: "#22c55e",
  Erudition: "#3b82f6",
  Harmony: "#f59e0b",
  Nihility: "#8b5cf6",
  Preservation: "#0ea5e9",
  Abundance: "#10b981",
  Elation: "#14b8a6",
  Remembrance: "#6366f1",
};

export const ROLE_COLORS: Record<string, string> = {
  "Sub-DPS": "#f97316",
  DPS: "#ef4444",
  Support: "#22c55e",
  Sustain: "#14b8a6",
};

export const META_COLORS: Record<string, string> = {
  DOT: "#f97316",
  Crit: "#38bdf8",
  Break: "#a855f7",
  "Follow-Up": "#22d3ee",
  Summon: "#8b5cf6",
  General: "#facc15",
  Kevin: "#f87171",
  Raiden: "#60a5fa",
  Ultimate: "#fb7185",
  Elation: "#14b8a6",
  Express: "#eab308",
};

// Canonicalized on the red -> orange -> gray -> green -> deeper-green scale
// (previously BossDetailScreen's mapping) since it reads as an intuitive
// bad-to-good gradient. BossListScreen used to map 1/2 to green/purple
// instead, which is what caused the same score to show two different colors
// depending on which screen you were looking at.
export const EFFECTIVENESS_COLORS: Record<EffectivenessScore, string> = {
  [-2]: "#ef4444",
  [-1]: "#f97316",
  [0]: "#9ca3af",
  [1]: "#22c55e",
  [2]: "#10b981",
};

export const EFFECTIVENESS_LABELS: Record<EffectivenessScore, string> = {
  [-2]: "Terrible",
  [-1]: "Bad",
  [0]: "Neutral",
  [1]: "Good",
  [2]: "Great",
};
