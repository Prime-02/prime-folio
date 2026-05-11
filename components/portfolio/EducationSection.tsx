"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import {
    EducationSkeleton,
    EducationTimeline,
} from "./education-components";

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

export default function EducationSection() {
    const { fetchProfile, profile, isLoading } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Sort education: most recent first (by startYear), current first
    const sortedEducation = useMemo(() => {
        if (!profile?.educations) return [];

        return [...profile.educations].sort((a, b) => {
            // Current education first
            if (a.current && !b.current) return -1;
            if (!a.current && b.current) return 1;

            // Then by start year (most recent first)
            if (a.startYear !== b.startYear) return b.startYear - a.startYear;

            // Finally by order
            return (a.order ?? 0) - (b.order ?? 0);
        });
    }, [profile?.educations]);

    if (isLoading || !profile) return <EducationSkeleton />;

    return (
        <motion.section
            id="education"
            aria-label="Education"
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
                        Background
                    </p>
                    <h2
                        className="font-Montserrat font-medium mb-2"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                            color: "var(--text-primary)"
                        }}
                    >
                        Education
                    </h2>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Timeline */}
                <EducationTimeline educations={sortedEducation} />
            </div>
        </motion.section>
    );
}