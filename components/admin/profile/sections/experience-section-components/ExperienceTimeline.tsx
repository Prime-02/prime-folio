// components/admin/profile/sections/experience-section/ExperienceTimeline.tsx
"use client";

import { ExternalLink, Pencil, Trash2 } from "lucide-react";
import type { Experience } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface ExperienceTimelineProps {
    experiences: Experience[];
    onEdit: (experience: Experience) => void;
    onDelete: (experience: Experience) => void;
}

// Helper to format dates for display
const formatMonth = (date?: Date | string | null) => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export default function ExperienceTimeline({ experiences, onEdit, onDelete }: ExperienceTimelineProps) {
    if (experiences.length === 0) return null;

    return (
        <div className="relative flex flex-col gap-0">
            {/* Timeline line */}
            <div className="absolute left-[11px] top-3 bottom-3 w-px bg-[var(--border-light)]" />

            {experiences.map((exp) => (
                <div key={exp.id} className="relative flex gap-5 pb-6 last:pb-0 group">
                    {/* Dot */}
                    <div className="relative z-10 mt-1 shrink-0">
                        <div
                            className={[
                                "w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center",
                                exp.current
                                    ? "border-[var(--success-500)] bg-[var(--success-100)]"
                                    : "border-[var(--border-color)] bg-[var(--bg-primary)]",
                            ].join(" ")}
                        >
                            {exp.current && (
                                <div className="w-2 h-2 rounded-full bg-[var(--success-500)]" />
                            )}
                        </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 min-w-0 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                                        {exp.role}
                                    </span>
                                    {exp.current && (
                                        <Badge variant="success" size="sm" dot>
                                            Current
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm text-[var(--text-secondary)]">
                                        {exp.company}
                                    </p>
                                    {exp.companyUrl && (
                                        <a
                                            href={exp.companyUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[var(--text-muted)] hover:text-[var(--primary-600)] transition-colors"
                                        >
                                            <ExternalLink size={12} />
                                        </a>
                                    )}
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {exp.location && <span>{exp.location} · </span>}
                                    {formatMonth(exp.startDate)} —{" "}
                                    {exp.current ? "Present" : formatMonth(exp.endDate)}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                    onClick={() => onEdit(exp)}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => onDelete(exp)}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error-500)] hover:bg-[var(--error-50)] transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        {exp.description && (
                            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed line-clamp-3">
                                {exp.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}