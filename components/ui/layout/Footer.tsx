"use client";

import { useProfileStore } from "@/lib/stores";
import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";

interface SocialLink {
    id?: string;
    platform: string;
    url: string;
    order?: number;
    createdAt?: Date;
}

interface FooterProps {
    socialLinks?: SocialLink[];
}

const footerLinks = [
    {
        title: "Navigation",
        links: [
            { label: "About", href: "#about" },
            { label: "Skills", href: "#skills" },
            { label: "Experience", href: "#experience" },
            { label: "Projects", href: "#projects" },
            { label: "Blog", href: "#blog" },
        ],
    },
    {
        title: "More",
        links: [
            { label: "Testimonials", href: "#testimonials" },
            { label: "Contact", href: "#contact" },
            { label: "Generate CV", href: "/cv", external: true },
            { label: "Blog", href: "/blog" },
        ],
    },
];

export default function Footer( ) {
    const currentYear = new Date().getFullYear();
        const {  profile } = useProfileStore();
    


    const socialLinks = useMemo(() => {
            if (!profile?.socialLinks) return [];
            return [...profile.socialLinks].sort((a, b) => {
                const orderDiff = (a.order ?? 0) - (b.order ?? 0);
                if (orderDiff !== 0) return orderDiff;
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });
        }, [profile?.socialLinks]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            const targetId = href.substring(1);
            const element = document.getElementById(targetId);

            if (element) {
                const offset = 80;
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                });
            }
        }
    };

    return (
        <motion.footer
            className="w-full py-16 md:py-20"
            style={{
                background: "var(--bg-secondary)",
                borderTop: "0.5px solid var(--border-light)",
            }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand column */}
                    <div className="col-span-2 md:col-span-1">
                        <Link
                            href="#hero"
                            onClick={(e) => handleNavClick(e, "#hero")}
                            className="text-xl font-Montserrat font-bold mb-4 block"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {`PR1M3-FOLIO`}<span style={{ color: "var(--primary-500)" }}>.</span>
                        </Link>
                        <p
                            className="text-sm leading-relaxed mb-6"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Full-stack software engineer passionate about building
                            beautiful, performant web applications.
                        </p>
                        {/* Back to top */}
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="inline-flex items-center gap-2 text-sm group transition-colors"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <motion.i
                                className="ti ti-arrow-up"
                                aria-hidden="true"
                                whileHover={{ y: -3 }}
                                transition={{ duration: 0.2 }}
                            />
                            Back to top
                        </button>
                    </div>

                    {/* Navigation & More columns */}
                    {footerLinks.map((section) => (
                        <div key={section.title}>
                            <h4
                                className="text-xs font-semibold tracking-widest uppercase mb-4"
                                style={{ color: "var(--text-primary)" }}
                            >
                                {section.title}
                            </h4>
                            <ul className="space-y-3">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <a
                                            href={link.href}
                                            target={link.external ? "_blank" : undefined}
                                            rel={link.external ? "noopener noreferrer" : undefined}
                                            onClick={(e) => handleNavClick(e, link.href)}
                                            className="text-sm transition-colors hover:underline inline-flex items-center gap-1.5 group"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {link.label}
                                            {link.external && (
                                                <motion.i
                                                    className="ti ti-external-link text-xs"
                                                    aria-hidden="true"
                                                    whileHover={{ x: 2, y: -2 }}
                                                    transition={{ duration: 0.2 }}
                                                />
                                            )}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Connect column - Dynamic from props */}
                    <div>
                        <h4
                            className="text-xs font-semibold tracking-widest uppercase mb-4"
                            style={{ color: "var(--text-primary)" }}
                        >
                            Connect
                        </h4>
                        {socialLinks.length > 0 ? (
                            <ul className="space-y-3">
                                {socialLinks.map((link, index) => (
                                    <li key={link.id ?? `social-${index}`}>
                                        <a
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm transition-colors hover:underline inline-flex items-center gap-1.5 group capitalize"
                                            style={{ color: "var(--text-muted)" }}
                                        >
                                            {link.platform}
                                            <motion.i
                                                className="ti ti-external-link text-xs"
                                                aria-hidden="true"
                                                whileHover={{ x: 2, y: -2 }}
                                                transition={{ duration: 0.2 }}
                                            />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p
                                className="text-sm"
                                style={{ color: "var(--text-muted)" }}
                            >
                                No social links added yet.
                            </p>
                        )}
                    </div>
                </div>

                {/* Bottom bar */}
                <div
                    className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
                    style={{ borderTop: "0.5px solid var(--border-light)" }}
                >
                    <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                    >
                        &copy; {currentYear} Chidera Utojiuba. All rights reserved.
                    </p>
                    <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Built with{" "}
                        <motion.span
                            style={{ color: "var(--error-500)" }}
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        >
                            ❤
                        </motion.span>{" "}
                        using Next.js & Framer Motion
                    </p>
                </div>
            </div>
        </motion.footer>
    );
}