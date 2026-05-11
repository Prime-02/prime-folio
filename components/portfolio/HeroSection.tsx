"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import {
    HeroSkeleton,
    HeroContent,
    HeroPhoto,
    AvailabilityBadge,
    AvailabilityNote,
} from "./hero-components";

// Animation variants
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

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

export default function HeroSection() {
    const { fetchProfile, profile, isLoading } = useProfileStore();
    const [timezoneLabel, setTimezoneLabel] = useState<string | null>(null);

    useEffect(() => {
        fetchProfile();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (!profile?.timezone) {
            setTimezoneLabel(null);
            return;
        }
        try {
            const label =
                new Intl.DateTimeFormat("en", {
                    timeZone: profile.timezone,
                    timeZoneName: "short",
                })
                    .formatToParts(new Date())
                    .find((p) => p.type === "timeZoneName")?.value ?? profile.timezone;
            setTimezoneLabel(label);
        } catch {
            setTimezoneLabel(profile.timezone);
        }
    }, [profile?.timezone]);

    const sortedLinks = useMemo(() => {
        if (!profile?.socialLinks) return [];
        return [...profile.socialLinks].sort((a, b) => {
            const orderDiff = (a.order ?? 0) - (b.order ?? 0);
            if (orderDiff !== 0) return orderDiff;
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
    }, [profile?.socialLinks]);

    if (isLoading || !profile) return <HeroSkeleton />;

    const {
        name,
        headline,
        tagline,
        profilePhoto,
        resumeUrl,
        resumeLabel,
        availableForWork,
        availabilityNote,
        city,
        country,
    } = profile;

    const location = [city, country].filter(Boolean).join(", ") || undefined;

    return (
        <motion.section
            aria-label="Hero"
            id="hero"
            className="w-full py-16 md:py-28"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col-reverse md:grid md:grid-cols-[1fr_1fr] gap-10 md:gap-20 items-center">
                    {/* Left / Bottom: Content */}
                    <motion.div variants={sectionVariants}>
                        <HeroContent
                            name={name}
                            headline={headline ?? undefined}
                            tagline={tagline ?? undefined}
                            resumeUrl={resumeUrl ?? undefined}
                            resumeLabel={resumeLabel ?? undefined}
                            location={location}
                            timezoneLabel={timezoneLabel}
                            socialLinks={sortedLinks}
                        />
                    </motion.div>

                    {/* Right / Top: Photo + badges */}
                    <motion.div
                        className="flex flex-col items-center gap-4"
                        variants={sectionVariants}
                    >
                        <HeroPhoto
                            profilePhoto={profilePhoto ?? undefined}
                            name={name}
                        />
                        {availableForWork && <AvailabilityBadge />}
                        {availableForWork && availabilityNote && (
                            <AvailabilityNote note={availabilityNote} />
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    );
}