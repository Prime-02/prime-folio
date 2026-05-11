// components/admin/profile/sections/skills-section-components/SkillCategorySection.tsx
import type { Skill } from "@/lib/types";
import SkillItem from "./SkillItem";

interface SkillCategorySectionProps {
    category: string;
    skills: Skill[];
    onEdit: (skill: Skill) => void;
    onDelete: (skill: Skill) => void;
}

export default function SkillCategorySection({
    category,
    skills,
    onEdit,
    onDelete,
}: SkillCategorySectionProps) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-muted)] mb-3">
                {category}
            </p>
            <div className="flex flex-col gap-2">
                {skills.map((skill) => (
                    <SkillItem
                        key={skill.id}
                        skill={skill}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
}