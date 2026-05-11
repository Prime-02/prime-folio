// components/CVGenerator/cvHtmlBuilder/utils.ts
// ── Markdown-to-HTML (lightweight) ──────────────────────────────────────────
export function mdToHtml(md = ""): string {
  if (!md) return "";
  return md
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/^#{3}\s+(.+)$/gm, "<h3>$1</h3>")
    .replace(/^#{2}\s+(.+)$/gm, "<h2>$1</h2>")
    .replace(/^#{1}\s+(.+)$/gm, "<h1>$1</h1>")
    .replace(/^[-*]\s+(.+)$/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)/g, "<ul>$1</ul>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/^(?!<[hul])(.+)$/gm, (m) =>
      m.startsWith("<") ? m : `<p>${m}</p>`,
    )
    .replace(/<p><\/p>/g, "");
}

export function stripMd(md = "", maxChars = 300): string {
  const plain = md
    .replace(/[#*`[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  return plain.length > maxChars ? plain.slice(0, maxChars) + "…" : plain;
}

export function fmtDate(d: string | null | undefined): string {
  if (!d) return "Present";
  const date = new Date(d);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export const PROFICIENCY_MAP: Record<string, number> = {
  BEGINNER: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100,
};

export function getThemeColors(tone: string): {
  accent: string;
  accent2: string;
} {
  switch (tone) {
    case "creative":
      return { accent: "#1a1a2e", accent2: "#e94560" };
    case "minimal":
      return { accent: "#111111", accent2: "#555555" };
    default: // professional
      return { accent: "#1e3a5f", accent2: "#2e6da4" };
  }
}
