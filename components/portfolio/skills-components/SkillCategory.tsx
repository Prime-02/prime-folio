import { motion } from "framer-motion";
import { SkillCard } from "./SkillCard";
import { staggerContainer, slideInLeft } from "./animations";

interface Skill {
    id: string;
    name: string;
    category: string;
    proficiency: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | "EXPERT";
    icon?: string | null;
    order: number;
    createdAt: Date;
}

interface SkillCategoryProps {
    category: string;
    skills: Skill[];
}

// Category icon mapping
const categoryIcons: Record<string, string> = {
    Frontend: "ti-layout",
    Backend: "ti-server",
    DevOps: "ti-cloud",
    Design: "ti-brush",
    Mobile: "ti-device-mobile",
    Database: "ti-database",
    Languages: "ti-code",
    Tools: "ti-tool",
    Other: "ti-category",
};

function getCategoryIcon(category: string): string {
    return categoryIcons[category] ?? "ti-category";
}

export function SkillCategory({ category, skills }: SkillCategoryProps) {
    const categoryIcon = getCategoryIcon(category);

    // Sort skills by order then by proficiency level
    const sortedSkills = [...skills].sort((a, b) => {
        const orderDiff = a.order - b.order;
        if (orderDiff !== 0) return orderDiff;

        const proficiencyWeight = {
            EXPERT: 4,
            ADVANCED: 3,
            INTERMEDIATE: 2,
            BEGINNER: 1,
        };
        return proficiencyWeight[b.proficiency] - proficiencyWeight[a.proficiency];
    });

    return (
        <motion.div
            className="mb-8 last:mb-0"
            variants={slideInLeft}
        >
            {/* Category header */}
            <div className="flex items-center gap-2 mb-4">
                <i
                    className={`ti ${categoryIcon} text-lg`}
                    style={{ color: "var(--text-secondary)" }}
                    aria-hidden="true"
                />
                <h3
                    className="text-sm font-medium"
                    style={{ color: "var(--text-primary)" }}
                >
                    {category}
                </h3>
                <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                        background: "var(--bg-tertiary)",
                        color: "var(--text-muted)",
                    }}
                >
                    {skills.length}
                </span>
            </div>

            {/* Skills grid */}
            <motion.div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {sortedSkills.map((skill, index) => (
                    <SkillCard
                        key={skill.id}
                        skill={skill}
                        index={index}
                    />
                ))}
            </motion.div>
        </motion.div>
    );
}