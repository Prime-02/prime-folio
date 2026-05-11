"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import {
    AboutSkeleton,
    BioContent,
    DetailsCard,
    CurrentRoleCard,
    AvailabilityCard,
} from "./about-components";

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

const sidebarVariants: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
            staggerChildren: 0.1,
        },
    },
};

export default function AboutSection() {
    const { fetchProfile, profile, isLoading } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (isLoading || !profile) return <AboutSkeleton />;

    const {
        bio,
        city,
        state,
        country,
        timezone,
        availableForWork,
        availabilityNote,
        experiences,
    } = profile;

    // Build location string
    const location = [city, state, country].filter(Boolean).join(", ") || undefined;

    // Safely format timezone
    const timezoneLabel = timezone
        ? (() => {
            try {
                return (
                    new Intl.DateTimeFormat("en", {
                        timeZone: timezone,
                        timeZoneName: "short",
                    })
                        .formatToParts(new Date())
                        .find((p) => p.type === "timeZoneName")?.value ?? timezone
                );
            } catch {
                return timezone;
            }
        })()
        : null;

    // Current job
    const currentJob = experiences?.find((e) => e.current) ?? null;

    return (
        <motion.section
            id="about"
            aria-label="About"
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
                        About me
                    </p>
                    <h2
                        className="font-Montserrat font-medium mb-2"
                        style={{ fontSize: "clamp(1.5rem, 3vw, 1.875rem)", color: "var(--text-primary)" }}
                    >
                        Who I am
                    </h2>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Content grid */}
                <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-10 md:gap-16 items-start">
                    {/* Bio */}
                    <BioContent bio={bio} />

                    {/* Sidebar */}
                    <motion.div
                        className="flex flex-col gap-4"
                        variants={sidebarVariants}
                    >
                        {(location || timezoneLabel || (availableForWork && availabilityNote)) && (
                            <DetailsCard
                                location={location}
                                timezoneLabel={timezoneLabel}
                                availabilityNote={availabilityNote ?? undefined}
                                availableForWork={availableForWork}
                            />
                        )}

                        {currentJob && <CurrentRoleCard currentJob={currentJob} />}

                        {availableForWork && (
                            <AvailabilityCard availabilityNote={availabilityNote ?? undefined} />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}