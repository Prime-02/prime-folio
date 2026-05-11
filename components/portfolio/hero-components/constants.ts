// ── Icon map: platform value → Tabler icon class ──────────────────────────────
export const PLATFORM_ICONS: Record<string, string> = {
  github: "ti-brand-github",
  linkedin: "ti-brand-linkedin",
  twitter: "ti-brand-x",
  instagram: "ti-brand-instagram",
  youtube: "ti-brand-youtube",
  dribbble: "ti-brand-dribbble",
  behance: "ti-brand-behance",
  whatsapp: "ti-brand-whatsapp",
  gmail: "ti-mail",
  website: "ti-world",
  other: "ti-link",
};

// ── Helper: Get icon class for a platform ─────────────────────────────────────
export function getPlatformIcon(platform: string): string {
  return PLATFORM_ICONS[platform.toLowerCase()] ?? "ti-link";
}
