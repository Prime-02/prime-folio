// components/admin/profile/sections/skills-section-components/constants.ts
export const PROFICIENCY_LEVELS = [
  { value: "BEGINNER", label: "Beginner" },
  { value: "INTERMEDIATE", label: "Intermediate" },
  { value: "ADVANCED", label: "Advanced" },
  { value: "EXPERT", label: "Expert" },
] as const;

export const proficiencyVariant: Record<
  string,
  "default" | "info" | "warning" | "success"
> = {
  BEGINNER: "default",
  INTERMEDIATE: "info",
  ADVANCED: "warning",
  EXPERT: "success",
};
