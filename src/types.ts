export type PriorityLevel = "low" | "medium" | "high";

export interface Bin {
  id: string;
  name: string;
  lat: number;
  lng: number;
  fillPercent: number;
  capacityLiters: number;
  lastUpdated: string;
}

export interface PriorityThreshold {
  level: PriorityLevel;
  label: string;
  min: number;
  max: number;
  color: string;
  hex: string;
  ringClass: string;
  glowClass: string;
}

export const PRIORITIES: Record<PriorityLevel, PriorityThreshold> = {
  low: {
    level: "low",
    label: "Normal",
    min: 0,
    max: 49,
    color: "#10b981",
    hex: "#10b981",
    ringClass: "ring-emerald-500/40",
    glowClass: "shadow-emerald-500/30",
  },
  medium: {
    level: "medium",
    label: "Watch",
    min: 50,
    max: 80,
    color: "#f59e0b",
    hex: "#f59e0b",
    ringClass: "ring-amber-500/40",
    glowClass: "shadow-amber-500/30",
  },
  high: {
    level: "high",
    label: "Priority 1",
    min: 81,
    max: 100,
    color: "#ef4444",
    hex: "#ef4444",
    ringClass: "ring-red-500/50",
    glowClass: "shadow-red-500/40",
  },
};

export function getPriority(fillPercent: number): PriorityLevel {
  if (fillPercent >= 81) return "high";
  if (fillPercent >= 50) return "medium";
  return "low";
}
