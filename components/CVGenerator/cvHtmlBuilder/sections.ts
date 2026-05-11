// components/CVGenerator/cvHtmlBuilder/sections.ts
import { mdToHtml, stripMd, fmtDate, PROFICIENCY_MAP } from "./utils";

export function buildBioSection(
  profile: any,
  sections: string[],
  showBio: string,
): string {
  if (!sections.includes("bio") || !profile.bio) return "";

  const bioContent =
    showBio === "short"
      ? `<p>${stripMd(profile.bio, 400)}</p>`
      : `<div>${mdToHtml(profile.bio)}</div>`;

  return `<div class="cv-section"><div class="cv-section-title">Profile</div><div class="cv-bio">${bioContent}</div></div>`;
}

export function buildExperienceSection(
  profile: any,
  sections: string[],
  maxExperience: number | null,
): string {
  if (!sections.includes("experience") || !profile.experiences?.length)
    return "";

  const exps = maxExperience
    ? profile.experiences.slice(0, maxExperience)
    : profile.experiences;

  const items = exps
    .map(
      (e: any) => `
    <div class="cv-exp-item">
      <div class="cv-exp-header">
        <div>
          <div class="cv-exp-role">${e.role}${e.current ? '<span class="cv-current-badge">Current</span>' : ""}</div>
          <div class="cv-exp-company">${e.company}</div>
          ${e.location ? `<div class="cv-exp-location">${e.location}</div>` : ""}
        </div>
        <div class="cv-exp-dates">${fmtDate(e.startDate)} — ${e.current ? "Present" : fmtDate(e.endDate)}</div>
      </div>
      ${e.description ? `<div class="cv-exp-desc">${mdToHtml(e.description)}</div>` : ""}
    </div>
  `,
    )
    .join("");

  return `<div class="cv-section"><div class="cv-section-title">Experience</div>${items}</div>`;
}

export function buildEducationSection(
  profile: any,
  sections: string[],
  maxEducation: number | null,
): string {
  if (!sections.includes("education") || !profile.educations?.length) return "";

  const edus = maxEducation
    ? profile.educations.slice(0, maxEducation)
    : profile.educations;

  const items = edus
    .map(
      (ed: any) => `
    <div class="cv-edu-item">
      <div class="cv-edu-header">
        <div>
          <div class="cv-edu-degree">${ed.degree}${ed.field ? ` — ${ed.field}` : ""}</div>
          <div class="cv-edu-inst">${ed.institution}</div>
        </div>
        <div class="cv-edu-years">${ed.startYear} — ${ed.current ? "Present" : ed.endYear || ""}</div>
      </div>
      ${ed.description ? `<div class="cv-edu-desc" style="margin-top:6px;font-size:12.5px;color:#333;">${mdToHtml(ed.description)}</div>` : ""}
    </div>
  `,
    )
    .join("");

  return `<div class="cv-section"><div class="cv-section-title">Education</div>${items}</div>`;
}

// components/CVGenerator/cvHtmlBuilder/sections.ts - Fix buildSkillsSection

export function buildSkillsSection(profile: any, sections: string[], maxSkillsPerCategory: number | null): string {
  if (!sections.includes("skills") || !profile.skills?.length) return "";
  
  const byCategory = profile.skills.reduce((acc: any, sk: any) => {
    if (!acc[sk.category]) acc[sk.category] = [];
    acc[sk.category].push(sk);
    return acc;
  }, {});
  
  const categories = Object.entries(byCategory).map(([cat, skills]: [string, any]) => {
    const shown = maxSkillsPerCategory ? skills.slice(0, maxSkillsPerCategory) : skills;
    
    const skillItems = shown.map((sk: any) => {
      const width = PROFICIENCY_MAP[sk.proficiency] || 50;
      return `
        <div class="cv-skill-item">
          <div class="cv-skill-name">
            <span class="cv-skill-label">${sk.name}</span>
            <span class="cv-skill-level">${sk.proficiency}</span>
          </div>
          <div class="cv-skill-bar-bg">
            <div class="cv-skill-bar-fill" style="width: ${width}%;"></div>
          </div>
        </div>
      `;
    }).join("");
    
    return `<div class="cv-skill-cat"><div class="cv-skill-cat-name">${cat}</div>${skillItems}</div>`;
  }).join("");
  
  return `<div class="cv-section"><div class="cv-section-title">Skills</div><div class="cv-skills-grid">${categories}</div></div>`;
}

export function buildProjectsSection(
  projects: any[],
  sections: string[],
  modeId: string,
): string {
  if (!sections.includes("projects") || !projects?.length) return "";

  const items = projects
    .map(
      (p: any) => `
    <div class="cv-project-item">
      <div class="cv-project-header">
        <div class="cv-project-title">${p.title}</div>
        <div class="cv-project-links">
          ${p.liveUrl ? `<a href="${p.liveUrl}" target="_blank">Live ↗</a>` : ""}
          ${p.repoUrl ? `<a href="${p.repoUrl}" target="_blank">Repo ↗</a>` : ""}
        </div>
      </div>
      ${p.tags?.length ? `<div class="cv-project-tags">${p.tags.map((t: string) => `<span class="cv-tag">${t}</span>`).join("")}</div>` : ""}
      <div class="cv-project-desc">${modeId === "one-pager" ? `<p>${stripMd(p.description || p.summary, 200)}</p>` : mdToHtml(p.description || p.summary)}</div>
    </div>
  `,
    )
    .join("");

  return `<div class="cv-section"><div class="cv-section-title">Projects</div>${items}</div>`;
}

export function buildTestimonialsSection(
  testimonials: any[],
  sections: string[],
  maxTestimonials: number,
): string {
  if (
    !sections.includes("testimonials") ||
    !testimonials?.length ||
    maxTestimonials <= 0
  )
    return "";

  const shown = testimonials.slice(0, maxTestimonials);

  const items = shown
    .map(
      (t: any) => `
    <div class="cv-testimonial-item">
      <div class="cv-stars">${"★".repeat(t.rating || 5)}${"☆".repeat(5 - (t.rating || 5))}</div>
      <div class="cv-testimonial-quote">"${t.content}"</div>
      <div class="cv-testimonial-author">${t.name}</div>
      <div class="cv-testimonial-role">${[t.role, t.company].filter(Boolean).join(", ")}</div>
    </div>
  `,
    )
    .join("");

  return `<div class="cv-section"><div class="cv-section-title">Recommendations</div>${items}</div>`;
}

export function buildSocialSection(profile: any, sections: string[]): string {
  if (!sections.includes("social") || !profile.socialLinks?.length) return "";

  const links = profile.socialLinks
    .map(
      (sl: any) =>
        `<a class="cv-social-item" href="${sl.url}" target="_blank">${sl.platform} ↗</a>`,
    )
    .join("");

  return `<div class="cv-section"><div class="cv-section-title">Links</div><div class="cv-social-grid">${links}</div></div>`;
}
