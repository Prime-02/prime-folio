// components/admin/profile/sections/social-links-section/constants.ts

export const PLATFORMS = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
  { value: "whatsapp", label: "WhatsApp" },
  { value: "gmail", label: "Gmail" },
  { value: "website", label: "Personal Website" },
  { value: "other", label: "Other" },
];

export const PLATFORM_COLORS: Record<string, string> = {
  github: "bg-[var(--primary-800)] text-white",
  linkedin: "bg-[var(--info-600)] text-white",
  twitter: "bg-[var(--info-400)] text-white",
  instagram: "bg-[var(--warning-500)] text-white",
  youtube: "bg-[var(--error-500)] text-white",
  dribbble: "bg-[var(--error-400)] text-white",
  behance: "bg-[var(--info-700)] text-white",
  whatsapp: "bg-[#25D366] text-white",
  gmail: "bg-[#EA4335] text-white",
  website: "bg-[var(--success-600)] text-white",
  other: "bg-[var(--bg-tertiary)] text-[var(--text-secondary)]",
};
