// components/CVGenerator/cvHtmlBuilder/types.ts
export interface BuildCVHtmlParams {
  profile: any;
  projects: any[];
  testimonials: any[];
  config: string;
  tone: string;
  sections: string[];
}

export interface ThemeColors {
  accent: string;
  accent2: string;
  headingFont: string;
  bodyFont: string;
}

export interface CVMode {
  id: string;
  label: string;
  projectStrategy: string;
  maxExperience: number | null;
  maxEducation: number | null;
  maxSkillsPerCategory: number | null;
  maxTestimonials: number;
  showBio: string;
}
