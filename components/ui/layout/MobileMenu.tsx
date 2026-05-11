"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import type { Variants } from "framer-motion";


interface NavLink {
    label: string;
    href: string;
}

interface MobileMenuProps {
    links: NavLink[];
    activeSection: string;
    onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
    onClose: () => void;
}

const menuVariants: Variants = {
    closed: {
        opacity: 0,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
        },
    },
    open: {
        opacity: 1,
        transition: {
            duration: 0.3,
            ease: "easeInOut",
            staggerChildren: 0.05,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    closed: {
        opacity: 0,
        x: -20,
    },
    open: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
        },
    },
};

export default function MobileMenu({ links, activeSection, onNavClick, onClose }: MobileMenuProps) {
    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    return (
        <motion.div
            className="fixed inset-0 z-40 lg:hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
        >
            {/* Backdrop */}
            <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
            />

            {/* Menu panel */}
            <motion.div
                className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] p-6 overflow-y-auto"
                style={{
                    background: "var(--bg-primary)",
                    borderLeft: "0.5px solid var(--border-light)",
                }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
                {/* Close button */}
                <div className="flex justify-end mb-8">
                    <button
                        onClick={onClose}
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{
                            background: "var(--bg-secondary)",
                            border: "0.5px solid var(--border-light)",
                        }}
                        aria-label="Close menu"
                    >
                        <i
                            className="ti ti-x text-lg"
                            style={{ color: "var(--text-primary)" }}
                            aria-hidden="true"
                        />
                    </button>
                </div>

                {/* Navigation links */}
                <nav className="space-y-1">
                    {links.map((link) => {
                        const sectionId = link.href.substring(1);
                        const isActive = activeSection === sectionId;

                        return (
                            <motion.a
                                key={link.href}
                                href={link.href}
                                onClick={(e) => onNavClick(e, link.href)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isActive
                                        ? "text-[var(--primary-600)]"
                                        : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                    }`}
                                style={{
                                    background: isActive
                                        ? "var(--primary-50)"
                                        : "transparent",
                                }}
                                variants={itemVariants}
                                whileHover={{ x: 4 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {isActive && (
                                    <motion.div
                                        className="w-1 h-5 rounded-full"
                                        style={{ background: "var(--primary-500)" }}
                                        layoutId="mobileActiveIndicator"
                                    />
                                )}
                                <span className={isActive ? "ml-2" : "ml-3"}>
                                    {link.label}
                                </span>
                            </motion.a>
                        );
                    })}
                </nav>

                {/* Resume button */}
                <motion.div
                    className="mt-8 px-4"
                    variants={itemVariants}
                >
                    <a
                        href="/resume.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200"
                        style={{
                            background: "var(--primary-500)",
                            color: "white",
                        }}
                        onClick={onClose}
                    >
                        <i className="ti ti-download text-sm" aria-hidden="true" />
                        Download Resume
                    </a>
                </motion.div>

                {/* Social links or additional info */}
                <motion.div
                    className="mt-8 px-4"
                    variants={itemVariants}
                >
                    <p
                        className="text-xs mb-3"
                        style={{ color: "var(--text-muted)" }}
                    >
                        GET IN TOUCH
                    </p>
                    <a
                        href="mailto:hello@example.com"
                        className="flex items-center gap-3 text-sm hover:underline"
                        style={{ color: "var(--text-secondary)" }}
                        onClick={onClose}
                    >
                        <i className="ti ti-mail" aria-hidden="true" />
                        hello@example.com
                    </a>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}