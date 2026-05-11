"use client";

import { useProfileStore } from "@/lib/stores";
import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { ContactForm, ContactInfo } from "@/components/portfolio/contact-components";

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

export default function ContactPage() {
    const { fetchProfile, profile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    if (!profile) return null;

    const {  city, country, timezone, socialLinks } = profile;
    const location = [city, country].filter(Boolean).join(", ");

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Header */}
            <section className="w-full py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div variants={headerVariants} className="text-center mb-12">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-sm mb-6 group"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <motion.i
                                className="ti ti-arrow-left"
                                aria-hidden="true"
                                whileHover={{ x: -3 }}
                                transition={{ duration: 0.2 }}
                            />
                            Back to home
                        </Link>

                        <motion.p
                            className="text-[10px] tracking-widest uppercase font-medium mb-3"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Contact
                        </motion.p>
                        <motion.h1
                            className="font-Montserrat font-medium mb-4"
                            style={{
                                fontSize: "clamp(1.875rem, 5vw, 3rem)",
                                color: "var(--text-primary)",
                            }}
                        >
                            Get In Touch
                        </motion.h1>
                        <motion.p
                            className="text-sm max-w-lg mx-auto"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Have a project in mind or want to discuss an opportunity?
                            I&apos;d love to hear from you.
                        </motion.p>
                    </motion.div>
                </div>
            </section>

            {/* Contact content */}
            <section className="w-full pb-16 md:pb-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                        <ContactForm />
                        <ContactInfo
                            location={location || undefined}
                            timezone={timezone ?? undefined}
                            socialLinks={socialLinks}
                        />
                    </div>
                </div>
            </section>
        </motion.div>
    );
}