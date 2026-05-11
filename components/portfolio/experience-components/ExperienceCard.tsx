import { motion } from "framer-motion";
import { CompanyLogo } from "./CompanyLogo";
import { ExperienceBadge } from "./ExperienceBadge";
import { fadeInLeft, fadeInRight } from "./animations";
import { PreviewPane } from "@/components/ui/markdown/PreviewPane";

interface Experience {
    id: string;
    company: string;
    role: string;
    description?: string | null;
    location?: string | null;
    companyUrl?: string | null;
    companyLogo?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    current: boolean;
    order: number;
}

interface ExperienceCardProps {
    experience: Experience;
    index: number;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en", {
        month: "short",
        year: "numeric"
    });
}

function getDateRange(startDate: Date | string, endDate?: Date | string | null, current?: boolean): string {
    const start = formatDate(startDate);
    if (current) return `${start} – Present`;
    if (endDate) return `${start} – ${formatDate(endDate)}`;
    return start;
}

export function ExperienceCard({ experience, index }: ExperienceCardProps) {
    const isEven = index % 2 === 0;
    const dateRange = getDateRange(experience.startDate, experience.endDate, experience.current);

    // Determine badges
    const badges: Array<"current" | "remote" | "fulltime" | "contract"> = [];
    if (experience.current) badges.push("current");
    if (experience.location?.toLowerCase().includes("remote")) badges.push("remote");
    if (experience.location?.toLowerCase().includes("contract")) badges.push("contract");
    if (experience.location?.toLowerCase().includes("fulltime")) badges.push("fulltime");

    return (
        <motion.div
            className="relative pl-8 md:pl-10 group"
            variants={isEven ? fadeInLeft : fadeInRight}
        >
            {/* Timeline dot */}
            <motion.div
                className="absolute left-0 md:left-0 top-1 w-3 h-3 rounded-full border-2 z-10"
                style={{
                    background: experience.current ? "var(--success-500)" : "var(--bg-secondary)",
                    borderColor: experience.current ? "var(--success-500)" : "var(--border-color)",
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
                {experience.current && (
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
                className="rounded-xl p-5 md:p-6 mb-8 last:mb-0 transition-shadow"
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
                    {/* Company logo */}
                    <CompanyLogo
                        logo={experience.companyLogo}
                        company={experience.company}
                    />

                    <div className="flex-1 min-w-0">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                            <div>
                                <h3
                                    className="text-base font-medium mb-0.5"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {experience.role}
                                </h3>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {experience.companyUrl ? (
                                        <a
                                            href={experience.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium hover:underline"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {experience.company}
                                            <i
                                                className="ti ti-external-link text-xs ml-1"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    ) : (
                                        <p
                                            className="text-sm font-medium"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            {experience.company}
                                        </p>
                                    )}
                                    {experience.location && (
                                        <span
                                            className="text-xs flex items-center gap-1"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            <i className="ti ti-map-pin text-xs" aria-hidden="true" />
                                            {experience.location?.split("/").at(-1)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 flex-wrap">
                                {badges.map((badge) => (
                                    <ExperienceBadge key={badge} type={badge} />
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <p
                            className="text-xs mb-3"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <i className="ti ti-calendar text-xs mr-1" aria-hidden="true" />
                            {dateRange}
                        </p>

                        {/* Description */}
                        {experience.description && (
                            <motion.div
                                className="prose-experience text-sm leading-relaxed"
                                style={{ color: "var(--text-secondary)" }}
                                initial={{ opacity: 0, height: 0 }}
                                whileInView={{ opacity: 1, height: "auto" }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.3, delay: 0.2 }}
                            >
                                <PreviewPane markdown={experience.description} />
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}