"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
    SkillsSkeleton,
    SkillCategory,
} from "./skills-components";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

const headerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: "easeOut" as const,
        },
    },
};

// Define a logical order for categories
const categoryOrder: Record<string, number> = {
    Frontend: 1,
    Backend: 2,
    Database: 3,
    DevOps: 4,
    Mobile: 5,
    Languages: 6,
    Tools: 7,
    Design: 8,
    Other: 9,
};

export default function SkillsSection() {
    const { fetchProfile, profile, isLoading } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Group skills by category
    const skillsByCategory = useMemo(() => {
        if (!profile?.skills) return {};

        return profile.skills.reduce<Record<string, typeof profile.skills>>((acc, skill) => {
            const category = skill.category || "Other";
            if (!acc[category]) acc[category] = [];
            acc[category].push(skill);
            return acc;
        }, {});
    }, [profile?.skills]);

    // Sort categories by predefined order
    const sortedCategories = useMemo(() => {
        return Object.entries(skillsByCategory).sort(([a], [b]) => {
            return (categoryOrder[a] ?? 99) - (categoryOrder[b] ?? 99);
        });
    }, [skillsByCategory]);

    if (isLoading || !profile) return <SkillsSkeleton />;

    const hasSkills = profile.skills && profile.skills.length > 0;

    return (
        <motion.section
            id="skills"
            aria-label="Skills"
            className="w-full py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <motion.div variants={headerVariants}>
                    <p
                        className="text-[10px] tracking-widest uppercase font-medium mb-2"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Expertise
                    </p>
                    <h2
                        className="font-Montserrat font-medium mb-2"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                            color: "var(--text-primary)"
                        }}
                    >
                        Skills & Technologies
                    </h2>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Skills by category */}
                {hasSkills ? (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {sortedCategories.map(([category, skills]) => (
                            <SkillCategory
                                key={category}
                                category={category}
                                skills={skills}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        className="text-center py-12"
                        variants={headerVariants}
                    >
                        <i
                            className="ti ti-code text-4xl mb-4 block"
                            style={{ color: "var(--text-muted)" }}
                            aria-hidden="true"
                        />
                        <p
                            className="text-sm"
                            style={{ color: "var(--text-muted)" }}
                        >
                            No skills added yet.
                        </p>
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}