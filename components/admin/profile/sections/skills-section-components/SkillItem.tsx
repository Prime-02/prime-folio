// components/admin/profile/sections/skills-section-components/SkillItem.tsx
import { Pencil, Trash2 } from "lucide-react";
import type { Skill } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import { PROFICIENCY_LEVELS, proficiencyVariant } from "./constants";
import { Avatar } from "@/components/ui";

interface SkillItemProps {
    skill: Skill;
    onEdit: (skill: Skill) => void;
    onDelete: (skill: Skill) => void;
}

export default function SkillItem({ skill, onEdit, onDelete }: SkillItemProps) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border-light)] group">
            <div className="flex items-center gap-3 min-w-0">
                {skill.icon && (
                    <Avatar
                        src={skill.icon}
                        name={skill.name}
                        size="xs"
                        className="w-8 h-8 rounded-lg object-cover shrink-0"
                    />
                )}
                <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                        {skill.name}
                    </span>
                </div>
                <Badge
                    variant={proficiencyVariant[skill.proficiency] ?? "default"}
                    size="sm"
                >
                    {PROFICIENCY_LEVELS.find(l => l.value === skill.proficiency)?.label ?? skill.proficiency}
                </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <button
                    onClick={() => onEdit(skill)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                    <Pencil size={14} />
                </button>
                <button
                    onClick={() => onDelete(skill)}
                    className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error-500)] hover:bg-[var(--error-50)] transition-colors"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}