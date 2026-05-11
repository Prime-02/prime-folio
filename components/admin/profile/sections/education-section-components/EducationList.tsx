// components/admin/profile/sections/education-section/EducationList.tsx
"use client";

import { Pencil, Trash2, GraduationCap } from "lucide-react";
import type { Education } from "@/lib/types";

interface EducationListProps {
    educations: Education[];
    onEdit: (education: Education) => void;
    onDelete: (education: Education) => void;
}

function EducationIcon() {
    return (
        <div className="w-10 h-10 rounded-xl bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0 text-[var(--text-muted)]">
            <GraduationCap size={20} strokeWidth={1.75} />
        </div>
    );
}

export default function EducationList({ educations, onEdit, onDelete }: EducationListProps) {
    if (educations.length === 0) return null;

    return (
        <div className="flex flex-col gap-3">
            {educations.map((edu) => (
                <div
                    key={edu.id}
                    className="flex items-start gap-4 px-4 py-4 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] group"
                >
                    <EducationIcon />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <p className="text-sm font-semibold text-[var(--text-primary)]">
                                    {edu.degree}{edu.field ? ` in ${edu.field}` : ""}
                                </p>
                                <p className="text-sm text-[var(--text-secondary)]">{edu.institution}</p>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {edu.startYear}
                                    {edu.current ? " – Present" : edu.endYear ? ` – ${edu.endYear}` : ""}
                                </p>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                <button
                                    onClick={() => onEdit(edu)}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                >
                                    <Pencil size={14} />
                                </button>
                                <button
                                    onClick={() => onDelete(edu)}
                                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error-500)] hover:bg-[var(--error-50)] transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        {edu.description && (
                            <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">
                                {edu.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}