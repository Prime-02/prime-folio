// components/CVGenerator/docxGenerator.ts (Fixed)
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  convertInchesToTwip,
} from "docx";

/**
 * Generates a properly formatted .docx file from CV HTML
 */
export async function generateDocx(
  cvHtml: string,
  fileName: string,
): Promise<void> {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(cvHtml, "text/html");

    const name = doc.querySelector(".cv-name")?.textContent || "";
    const headline = doc.querySelector(".cv-headline")?.textContent || "";
    const metaElements = doc.querySelectorAll(".cv-meta span");
    const availabilityBadge =
      doc.querySelector(".avail-badge")?.textContent || "";

    const children: (Paragraph | Table)[] = [];

    // Header Section
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: name, bold: true, size: 48, font: "Montserrat" }),
        ],
        heading: HeadingLevel.TITLE,
        spacing: { after: 100 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: headline,
            size: 26,
            color: "2e6da4",
            font: "Poppins",
          }),
        ],
        spacing: { after: 200 },
      }),
    );

    // Meta information
    const metaTexts: string[] = [];
    metaElements.forEach((meta) => {
      metaTexts.push(meta.textContent || "");
    });

    if (metaTexts.length > 0) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: metaTexts.join(" | "),
              size: 20,
              color: "555555",
            }),
          ],
          spacing: { after: 60 },
        }),
      );
    }

    if (availabilityBadge) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `✓ ${availabilityBadge}`,
              size: 20,
              color: "166534",
              bold: true,
            }),
          ],
          spacing: { after: 300 },
        }),
      );
    }

    // Add a horizontal rule
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: "1e3a5f",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
        spacing: { after: 300 },
      }),
    );

    // Process each CV section
    const sections = doc.querySelectorAll(".cv-section");
    sections.forEach((section) => {
      const title =
        section.querySelector(".cv-section-title")?.textContent || "";

      // Add section title
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: title.toUpperCase(),
              bold: true,
              size: 22,
              color: "1e3a5f",
              font: "Montserrat",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 150 },
          border: {
            bottom: {
              color: "1e3a5f",
              space: 1,
              style: BorderStyle.SINGLE,
              size: 6,
            },
          },
        }),
      );

      // Process section content based on type
      if (title.toLowerCase().includes("experience")) {
        processExperienceSection(section, children);
      } else if (title.toLowerCase().includes("education")) {
        processEducationSection(section, children);
      } else if (title.toLowerCase().includes("skills")) {
        processSkillsSection(section, children);
      } else if (title.toLowerCase().includes("projects")) {
        processProjectsSection(section, children);
      } else if (title.toLowerCase().includes("recommendations")) {
        processTestimonialsSection(section, children);
      } else if (title.toLowerCase().includes("links")) {
        processSocialSection(section, children);
      } else if (title.toLowerCase().includes("profile")) {
        processBioSection(section, children);
      }
    });

    // Create the document
    const docxDocument = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Poppins",
              size: 22,
            },
          },
        },
      },
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: convertInchesToTwip(0.7),
                right: convertInchesToTwip(0.8),
                bottom: convertInchesToTwip(0.7),
                left: convertInchesToTwip(0.8),
              },
            },
          },
          children: children,
        },
      ],
    });

    // Generate and save
    const blob = await Packer.toBlob(docxDocument);
    saveAs(blob, `${fileName.replace(/\s+/g, "_")}_CV.docx`);
  } catch (error) {
    console.error("Error generating DOCX:", error);
    throw error;
  }
}

function processBioSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const paragraphs = section.querySelectorAll(".cv-bio p, .cv-bio li");

  if (paragraphs.length > 0) {
    paragraphs.forEach((p) => {
      const text = p.textContent?.trim() || "";
      if (text) {
        const isListItem = p.tagName.toLowerCase() === "li";
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: isListItem ? `• ${text}` : text,
                size: 21,
              }),
            ],
            spacing: { after: 60 },
            indent: isListItem ? { left: 300 } : undefined,
          }),
        );
      }
    });
  } else {
    // Fallback: get all text content
    const bioDiv = section.querySelector(".cv-bio");
    if (bioDiv) {
      const text = bioDiv.textContent?.trim() || "";
      text
        .split("\n")
        .filter(Boolean)
        .forEach((line) => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: line.trim(), size: 21 })],
              spacing: { after: 60 },
            }),
          );
        });
    }
  }
}

function processExperienceSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const items = section.querySelectorAll(".cv-exp-item");

  items.forEach((item) => {
    const roleEl = item.querySelector(".cv-exp-role");
    const role = roleEl?.textContent?.replace("Current", "").trim() || "";
    const company = item.querySelector(".cv-exp-company")?.textContent || "";
    const location = item.querySelector(".cv-exp-location")?.textContent || "";
    const dates = item.querySelector(".cv-exp-dates")?.textContent || "";
    const isCurrent = item.querySelector(".cv-current-badge") !== null;
    const descriptionEl = item.querySelector(".cv-exp-desc");

    // Role and company
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: role, bold: true, size: 24 }),
          ...(isCurrent
            ? [
                new TextRun({
                  text: "  (Current)",
                  bold: true,
                  color: "1e3a5f",
                  size: 20,
                }),
              ]
            : []),
        ],
        spacing: { before: 200, after: 40 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: company,
            italics: true,
            size: 22,
            color: "2e6da4",
          }),
        ],
        spacing: { after: 20 },
      }),
    );

    // Dates and location
    const metaParts = [dates];
    if (location) metaParts.push(location);
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: metaParts.join(" | "),
            size: 18,
            color: "888888",
          }),
        ],
        spacing: { after: 60 },
      }),
    );

    // Description
    if (descriptionEl) {
      const listItems = descriptionEl.querySelectorAll("li");
      if (listItems.length > 0) {
        listItems.forEach((li) => {
          const text = li.textContent?.trim() || "";
          if (text) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: `• ${text}`, size: 21 })],
                spacing: { after: 30 },
                indent: { left: 300 },
              }),
            );
          }
        });
      } else {
        const text = descriptionEl.textContent?.trim() || "";
        text
          .split("\n")
          .filter(Boolean)
          .forEach((line) => {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: line.trim(), size: 21 })],
                spacing: { after: 40 },
                indent: { left: 200 },
              }),
            );
          });
      }
    }
  });
}

function processEducationSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const items = section.querySelectorAll(".cv-edu-item");

  items.forEach((item) => {
    const degree = item.querySelector(".cv-edu-degree")?.textContent || "";
    const institution = item.querySelector(".cv-edu-inst")?.textContent || "";
    const years = item.querySelector(".cv-edu-years")?.textContent || "";
    const descriptionEl = item.querySelector(".cv-edu-desc");

    children.push(
      new Paragraph({
        children: [new TextRun({ text: degree, bold: true, size: 23 })],
        spacing: { before: 150, after: 30 },
      }),
      new Paragraph({
        children: [
          new TextRun({
            text: institution,
            italics: true,
            size: 21,
            color: "2e6da4",
          }),
          new TextRun({ text: `  |  ${years}`, size: 18, color: "888888" }),
        ],
        spacing: { after: 40 },
      }),
    );

    if (descriptionEl) {
      const text = descriptionEl.textContent?.trim() || "";
      if (text) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text, size: 20 })],
            spacing: { after: 80 },
          }),
        );
      }
    }
  });
}

// components/CVGenerator/docxGenerator.ts - Fix processSkillsSection

function processSkillsSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const categories = section.querySelectorAll(".cv-skill-cat");

  categories.forEach((cat) => {
    const catName = cat.querySelector(".cv-skill-cat-name")?.textContent || "";
    const skills = cat.querySelectorAll(".cv-skill-item");

    // Category name
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: catName, bold: true, size: 20, color: "666666" }),
        ],
        spacing: { before: 150, after: 80 },
      }),
    );

    const rows: TableRow[] = [];
    skills.forEach((skill) => {
      // Get the skill name from the span with class cv-skill-name
      const nameSpan = skill.querySelector(".cv-skill-name");
      // Get just the skill name text, not the proficiency level
      const nameText =
        nameSpan?.childNodes[0]?.textContent?.trim() ||
        nameSpan?.querySelector("span:first-child")?.textContent?.trim() ||
        "";

      // Get proficiency level from the span with class cv-skill-level
      const levelSpan = skill.querySelector(".cv-skill-level");
      const proficiencyLevel = levelSpan?.textContent?.trim() || "";

      // Get the percentage from the progress bar
      const barFill = skill.querySelector(".cv-skill-bar-fill");
      const styleAttr = barFill?.getAttribute("style") || "";
      const widthMatch = styleAttr.match(/width:\s*(\d+)%/);
      const percentage = widthMatch ? parseInt(widthMatch[1]) : 50;

      // Create visual representation using Unicode blocks
      const filledBars = Math.round(percentage / 10);
      const emptyBars = 10 - filledBars;
      const barText = "█".repeat(filledBars) + "░".repeat(emptyBars);

      // Display name with proficiency level
      const displayName = proficiencyLevel
        ? `${nameText} (${proficiencyLevel})`
        : nameText;

      rows.push(
        new TableRow({
          children: [
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: displayName, size: 20 })],
                  spacing: { after: 0 },
                }),
              ],
              width: { size: 35, type: WidthType.PERCENTAGE },
              margins: { top: 30, bottom: 30, left: 40, right: 40 },
            }),
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({ text: barText, size: 16, color: "2e6da4" }),
                    new TextRun({
                      text: `  ${percentage}%`,
                      size: 16,
                      color: "888888",
                    }),
                  ],
                  spacing: { after: 0 },
                }),
              ],
              width: { size: 65, type: WidthType.PERCENTAGE },
              margins: { top: 30, bottom: 30, left: 40, right: 40 },
            }),
          ],
        }),
      );
    });

    if (rows.length > 0) {
      children.push(
        new Table({
          rows: rows,
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.NONE },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
            insideHorizontal: { style: BorderStyle.NONE },
            insideVertical: { style: BorderStyle.NONE },
          },
        }),
      );
    }

    // Add some spacing after each category
    children.push(
      new Paragraph({
        spacing: { after: 120 },
      }),
    );
  });
}

function processProjectsSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const items = section.querySelectorAll(".cv-project-item");

  items.forEach((item) => {
    const title = item.querySelector(".cv-project-title")?.textContent || "";
    const links = item.querySelectorAll(".cv-project-links a");
    const tags = item.querySelectorAll(".cv-tag");
    const description =
      item.querySelector(".cv-project-desc")?.textContent || "";

    const linkTexts = Array.from(links)
      .map((l) => l.textContent)
      .join("  |  ");
    const tagTexts = Array.from(tags)
      .map((t) => t.textContent)
      .join(", ");

    children.push(
      new Paragraph({
        children: [new TextRun({ text: title, bold: true, size: 23 })],
        spacing: { before: 150, after: 30 },
      }),
    );

    if (linkTexts) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: linkTexts, size: 18, color: "2e6da4" }),
          ],
          spacing: { after: 30 },
        }),
      );
    }

    if (tagTexts) {
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `Tags: ${tagTexts}`,
              size: 18,
              color: "888888",
            }),
          ],
          spacing: { after: 40 },
        }),
      );
    }

    if (description) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: description, size: 21 })],
          spacing: { after: 100 },
        }),
      );
    }

    // Add separator between projects
    children.push(
      new Paragraph({
        border: {
          bottom: {
            color: "e5e5e5",
            space: 1,
            style: BorderStyle.SINGLE,
            size: 2,
          },
        },
        spacing: { after: 100 },
      }),
    );
  });
}

function processTestimonialsSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const items = section.querySelectorAll(".cv-testimonial-item");

  items.forEach((item) => {
    const stars = item.querySelector(".cv-stars")?.textContent || "";
    const quote =
      item.querySelector(".cv-testimonial-quote")?.textContent || "";
    const author =
      item.querySelector(".cv-testimonial-author")?.textContent || "";
    const role = item.querySelector(".cv-testimonial-role")?.textContent || "";

    if (stars) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: stars, size: 22, color: "f59e0b" })],
          spacing: { before: 120 },
          indent: { left: 300 },
        }),
      );
    }

    children.push(
      new Paragraph({
        children: [new TextRun({ text: quote, italics: true, size: 21 })],
        spacing: { before: 40, after: 60 },
        indent: { left: 300 },
        border: {
          left: {
            color: "2e6da4",
            space: 8,
            style: BorderStyle.SINGLE,
            size: 12,
          },
        },
      }),
      new Paragraph({
        children: [new TextRun({ text: `— ${author}`, bold: true, size: 20 })],
        spacing: { after: 20 },
        indent: { left: 300 },
      }),
    );

    if (role) {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: role, size: 18, color: "888888" })],
          spacing: { after: 120 },
          indent: { left: 300 },
        }),
      );
    }
  });
}

function processSocialSection(
  section: Element,
  children: (Paragraph | Table)[],
): void {
  const links = section.querySelectorAll(".cv-social-item");

  const socialTexts: string[] = [];
  links.forEach((link) => {
    socialTexts.push(link.textContent || "");
  });

  if (socialTexts.length > 0) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: socialTexts.join("  |  "),
            size: 21,
            color: "2e6da4",
          }),
        ],
        spacing: { after: 200 },
      }),
    );
  }
}
