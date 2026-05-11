// components/CVGenerator/constants.ts
export const COMPLEXITY_MODES = [
  {
    id: "one-pager",
    label: "One-Pager",
    icon: "ti-file",
    description:
      "Concise single page — headline skills, top projects, key experience",
    projectStrategy: "featured",
    maxExperience: 2,
    maxEducation: 1,
    maxSkillsPerCategory: 4,
    maxTestimonials: 0,
    showBio: "short",
  },
  {
    id: "standard",
    label: "Standard",
    icon: "ti-files",
    description: "Well-rounded 2-page CV — balanced depth across all sections",
    projectStrategy: "page",
    maxExperience: 4,
    maxEducation: 2,
    maxSkillsPerCategory: 6,
    maxTestimonials: 2,
    showBio: "full",
  },
  {
    id: "detailed",
    label: "Detailed",
    icon: "ti-file-text",
    description: "Full document — every project, role, and achievement",
    projectStrategy: "all",
    maxExperience: null,
    maxEducation: null,
    maxSkillsPerCategory: null,
    maxTestimonials: 3,
    showBio: "full",
  },
  {
    id: "custom",
    label: "Custom",
    icon: "ti-adjustments",
    description: "You choose what goes in and how much detail to show",
    projectStrategy: "featured",
    maxExperience: null,
    maxEducation: null,
    maxSkillsPerCategory: null,
    maxTestimonials: 2,
    showBio: "full",
  },
] as const;

export const TONES = [
  {
    id: "professional",
    label: "Professional",
    description: "Formal, polished, corporate-ready",
  },
  {
    id: "creative",
    label: "Creative",
    description: "Expressive layout, bold headings",
  },
  {
    id: "minimal",
    label: "Minimal",
    description: "Clean lines, maximum whitespace",
  },
] as const;

export const ALL_SECTIONS = [
  { id: "bio", label: "Bio / Summary", icon: "ti-user" },
  { id: "experience", label: "Experience", icon: "ti-briefcase" },
  { id: "education", label: "Education", icon: "ti-school" },
  { id: "skills", label: "Skills", icon: "ti-tools" },
  { id: "projects", label: "Projects", icon: "ti-layout-grid" },
  { id: "testimonials", label: "Testimonials", icon: "ti-message-circle" },
  { id: "social", label: "Social Links", icon: "ti-link" },
] as const;
