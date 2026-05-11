"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
    ExperienceSkeleton,
    ExperienceTimeline,
} from "./experience-components";

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

export default function ExperienceSection() {
    const { fetchProfile, profile, isLoading } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Sort experiences: current first, then by start date (most recent first)
    const sortedExperiences = useMemo(() => {
        if (!profile?.experiences) return [];

        return [...profile.experiences].sort((a, b) => {
            // Current jobs first
            if (a.current && !b.current) return -1;
            if (!a.current && b.current) return 1;

            // Then by start date (most recent first)
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            if (dateA !== dateB) return dateB - dateA;

            // Finally by order
            return (a.order ?? 0) - (b.order ?? 0);
        });
    }, [profile?.experiences]);

    if (isLoading || !profile) return <ExperienceSkeleton />;

    return (
        <motion.section
            id="experience"
            aria-label="Experience"
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
                        Career
                    </p>
                    <h2
                        className="font-Montserrat font-medium mb-2"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                            color: "var(--text-primary)"
                        }}
                    >
                        Work Experience
                    </h2>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Timeline */}
                <ExperienceTimeline experiences={sortedExperiences} />
            </div>
        </motion.section>
    );
}