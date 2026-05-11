import { motion } from "framer-motion";
import { InstitutionLogo } from "./InstitutionLogo";
import { EducationBadge } from "./EducationBadge";
import { fadeInLeft, fadeInRight } from "./animations";
import { PreviewPane } from "@/components/ui/markdown/PreviewPane";

interface Education {
    id: string;
    institution: string;
    degree: string;
    field?: string | null;
    description?: string | null;
    logo?: string | null;
    startYear: number;
    endYear?: number | null;
    current: boolean;
    order: number;
}

interface EducationCardProps {
    education: Education;
    index: number;
}

function getYearRange(startYear: number, endYear?: number | null, current?: boolean): string {
    if (current) return `${startYear} – Present`;
    if (endYear) return `${startYear} – ${endYear}`;
    return `${startYear}`;
}

function getDuration(startYear: number, endYear?: number | null, current?: boolean): string {
    const end = current ? new Date().getFullYear() : (endYear ?? startYear);
    const years = end - startYear;

    if (years === 0) return "Less than a year";
    if (years === 1) return "1 year";
    return `${years} years`;
}

export function EducationCard({ education, index }: EducationCardProps) {
    const isEven = index % 2 === 0;
    const yearRange = getYearRange(education.startYear, education.endYear, education.current);
    const duration = getDuration(education.startYear, education.endYear, education.current);

    // Determine badges
    const badges: Array<{ type: "current" | "honors" | "thesis" | "gpa"; value?: string }> = [];
    if (education.current) badges.push({ type: "current" });

    return (
        <motion.div
            className="relative pl-8 md:pl-10 group"
            variants={isEven ? fadeInLeft : fadeInRight}
        >
            {/* Timeline dot */}
            <motion.div
                className="absolute left-0 md:left-0 top-1 w-3 h-3 rounded-full border-2 z-10"
                style={{
                    background: education.current ? "var(--success-500)" : "var(--bg-secondary)",
                    borderColor: education.current ? "var(--success-500)" : "var(--border-color)",
                }}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{
                    type: "spring",
                    stiffness: 300,
                    delay: index * 0.1
                }}
                whileHover={{ scale: 1.5 }}
            >
                {education.current && (
                    <motion.span
                        className="absolute inset-0 rounded-full"
                        style={{ background: "var(--success-500)" }}
                        animate={{ opacity: [0.5, 0, 0.5] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    />
                )}
            </motion.div>

            {/* Card */}
            <motion.div
                className="rounded-xl p-5 md:p-6 mb-8 last:mb-0"
                style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border-light)",
                }}
                whileHover={{
                    scale: 1.01,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
                transition={{ duration: 0.2 }}
            >
                <div className="flex items-start gap-4">
                    {/* Institution logo */}
                    <InstitutionLogo
                        logo={education.logo}
                        institution={education.institution}
                    />

                    <div className="flex-1 min-w-0">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                                <h3
                                    className="text-base font-medium mb-0.5"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {education.degree}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    <p
                                        className="text-sm font-medium"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {education.institution}
                                    </p>
                                    {education.field && (
                                        <>
                                            <span style={{ color: "var(--text-muted)" }}>·</span>
                                            <span
                                                className="text-xs"
                                                style={{ color: "var(--text-muted)" }}
                                            >
                                                {education.field}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-2 flex-wrap">
                                {badges.map((badge, i) => (
                                    <EducationBadge
                                        key={i}
                                        type={badge.type}
                                        value={badge.value}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Year range and duration */}
                        <div className="flex items-center gap-2 mb-3">
                            <p
                                className="text-xs flex items-center gap-1"
                                style={{ color: "var(--text-muted)" }}
                            >
                                <i className="ti ti-calendar text-xs" aria-hidden="true" />
                                {yearRange}
                            </p>
                            <span style={{ color: "var(--border-color)" }}>·</span>
                            <motion.p
                                className="text-xs"
                                style={{ color: "var(--text-muted)" }}
                                initial={{ opacity: 0 }}
                                whileInView={{ opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                            >
                                <i className="ti ti-clock text-xs mr-1" aria-hidden="true" />
                                {duration}
                            </motion.p>
                        </div>

                        {/* Description */}
                        {education.description && (
                            <motion.div
                                className="prose-education text-sm leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                                initial={{ opacity: 0, height: 0 }}
                                whileInView={{ opacity: 1, height: "auto" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <PreviewPane markdown={education.description} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}