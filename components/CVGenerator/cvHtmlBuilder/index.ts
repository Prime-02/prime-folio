// components/CVGenerator/cvHtmlBuilder/index.ts
import { COMPLEXITY_MODES } from "../constants";
import { generateBaseStyles } from "./styles";
import {
  buildBioSection,
  buildExperienceSection,
  buildEducationSection,
  buildSkillsSection,
  buildProjectsSection,
  buildTestimonialsSection,
  buildSocialSection,
} from "./sections";
import type { BuildCVHtmlParams } from "./types";

export { mdToHtml, stripMd, fmtDate, PROFICIENCY_MAP } from "./utils";

export function buildCVHtml({
  profile,
  projects,
  testimonials,
  config,
  tone,
  sections,
}: BuildCVHtmlParams): string {
  const mode =
    COMPLEXITY_MODES.find((m: any) => m.id === config) || COMPLEXITY_MODES[1];
  const loc = [profile.city, profile.state, profile.country]
    .filter(Boolean)
    .join(", ");

  const baseStyle = generateBaseStyles(tone);

  // Build all sections
  const bioHtml = buildBioSection(profile, sections, mode.showBio);
  const expHtml = buildExperienceSection(profile, sections, mode.maxExperience);
  const eduHtml = buildEducationSection(profile, sections, mode.maxEducation);
  const skillsHtml = buildSkillsSection(
    profile,
    sections,
    mode.maxSkillsPerCategory,
  );
  const projectsHtml = buildProjectsSection(projects, sections, mode.id);
  const testimonialsHtml = buildTestimonialsSection(
    testimonials,
    sections,
    mode.maxTestimonials,
  );
  const socialHtml = buildSocialSection(profile, sections);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${profile.name} — CV</title>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&family=Poppins:wght@400;500;600&display=swap" rel="stylesheet"/>
<style>${baseStyle}</style>
</head>
<body>
<div class="cv-wrap">
  <div class="cv-header">
    <div class="cv-name">${profile.name}</div>
    <div class="cv-headline">${profile.headline || ""}</div>
    <div class="cv-meta">
      ${profile.email ? `<span>✉ ${profile.email}</span>` : ""}
      ${loc ? `<span>📍 ${loc}</span>` : ""}
      ${profile.timezone ? `<span>🕐 ${profile.timezone}</span>` : ""}
    </div>
    ${profile.availableForWork ? `<div class="avail-badge">✓ ${profile.availabilityNote || "Open to opportunities"}</div>` : ""}
  </div>
  ${bioHtml}
  ${expHtml}
  ${eduHtml}
  ${skillsHtml}
  ${projectsHtml}
  ${testimonialsHtml}
  ${socialHtml}
</div>
</body>
</html>`;
}
