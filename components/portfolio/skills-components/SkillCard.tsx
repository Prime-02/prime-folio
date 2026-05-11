import { motion } from "framer-motion";
import { SkillIcon } from "./SkillIcon";
import { ProficiencyBadge } from "./ProficiencyBadge";
import { scaleIn } from "./animations";

interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    icon?: string | null;
    order: number;
    createdAt: Date;
}

interface SkillCardProps {
    skill: Skill;
    index: number;
}

export function SkillCard({ skill, index }: SkillCardProps) {
    return (
        <motion.div
            className="rounded-xl p-4 flex items-start gap-3 group"
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
            variants={scaleIn}
            whileHover={{
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
            transition={{
                duration: 0.2,
                delay: index * 0.05,
            }}
        >
            <SkillIcon icon={skill.icon} name={skill.name} size="md" />

            <div className="flex-1 min-w-0">
                <p
                    className="text-sm font-medium mb-2 truncate"
                    style={{ color: "var(--text-primary)" }}
                >
                    {skill.name}
                </p>
                <ProficiencyBadge level={skill.proficiency} />
            </div>
        </motion.div>
    );
}