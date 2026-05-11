"use client";

import { useProfileStore } from "@/lib/stores";
import { motion, type Variants } from "framer-motion";
import { ContactForm, ContactInfo } from "./contact-components";

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

export default function ContactSection() {
    const { profile } = useProfileStore();

    if (!profile) return null;

    const { city, country, timezone, socialLinks } = profile;
    const location = [city, country].filter(Boolean).join(", ");

    return (
        <motion.section
            id="contact"
            aria-label="Contact"
            className="w-full py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <motion.div variants={headerVariants} className="text-center mb-12">
                    <p
                        className="text-[10px] tracking-widest uppercase font-medium mb-2"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Contact
                    </p>
                    <h2
                        className="font-Montserrat font-medium"
                        style={{
                            fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                            color: "var(--text-primary)",
                        }}
                    >
                        Get In Touch
                    </h2>
                    <div
                        className="w-10 h-0.5 rounded-full mx-auto mt-4"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
                    {/* Form */}
                    <ContactForm />

                    {/* Info sidebar */}
                    <div className="space-y-4">
                        <ContactInfo
                            location={location || undefined}
                            timezone={timezone ?? undefined}
                            socialLinks={socialLinks}
                        />
                    </div>
                </div>
            </div>
        </motion.section>
    );
}