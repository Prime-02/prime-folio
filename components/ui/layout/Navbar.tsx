"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import MobileMenu from "./MobileMenu";

const navLinks = [
    { label: "Home", href: "#hero" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Education", href: "#education" },
    { label: "Projects", href: "#projects" },
    { label: "Blog", href: "#blog" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("hero");

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);

            // Update active section based on scroll position
            const sections = navLinks.map(link => link.href.substring(1));

            for (const section of sections.reverse()) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 100) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMobileMenuOpen]);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);

        if (element) {
            const offset = 80; // Adjust for navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth",
            });
        }

        // Close mobile menu if open
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <>
            <motion.nav
                className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{
                    background: isScrolled
                        ? "var(--bg-primary)"
                        : "transparent",
                    borderBottom: isScrolled
                        ? "0.5px solid var(--border-light)"
                        : "0.5px solid transparent",
                    backdropFilter: isScrolled ? "blur(12px)" : "none",
                }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link
                            href="#hero"
                            onClick={(e) => handleNavClick(e, "#hero")}
                            className="text-lg font-Montserrat font-bold shrink-0"
                            style={{ color: "var(--text-primary)" }}
                        >
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                CD<span style={{ color: "var(--primary-500)" }}>.</span>
                            </motion.span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navLinks.map((link, index) => {
                                const sectionId = link.href.substring(1);
                                const isActive = activeSection === sectionId;

                                return (
                                    <motion.a
                                        key={link.href}
                                        href={link.href}
                                        onClick={(e) => handleNavClick(e, link.href)}
                                        className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${isActive
                                            ? "text-[var(--primary-600)]"
                                            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                                            }`}
                                        initial={{ opacity: 0, y: -20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.1 * index, duration: 0.5 }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {link.label}
                                        {isActive && (
                                            <motion.div
                                                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                                                style={{ background: "var(--primary-500)" }}
                                                layoutId="activeSection"
                                                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </motion.a>
                                );
                            })}
                        </div>

                        {/* Resume button & Mobile menu toggle */}
                        <div className="flex items-center gap-3">
                            {/* Resume Download */}
                            <motion.a
                                href="/cv"
                                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                                style={{
                                    background: "var(--primary-500)",
                                    color: "white",
                                }}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5, duration: 0.3 }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <i className="ti ti-download text-sm" aria-hidden="true" />
                                Generate CV
                            </motion.a>

                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                                aria-label="Toggle menu"
                            >
                                <motion.div
                                    animate={isMobileMenuOpen ? "open" : "closed"}
                                    className="relative w-5 h-5"
                                >
                                    <motion.span
                                        className="absolute left-0 top-0 w-5 h-0.5 rounded-full"
                                        style={{ background: "var(--text-primary)" }}
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: 45, y: 9 },
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        className="absolute left-0 top-2 w-5 h-0.5 rounded-full"
                                        style={{ background: "var(--text-primary)" }}
                                        variants={{
                                            closed: { opacity: 1 },
                                            open: { opacity: 0 },
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                    <motion.span
                                        className="absolute left-0 top-4 w-5 h-0.5 rounded-full"
                                        style={{ background: "var(--text-primary)" }}
                                        variants={{
                                            closed: { rotate: 0, y: 0 },
                                            open: { rotate: -45, y: -9 },
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </motion.div>
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <MobileMenu
                        links={navLinks}
                        activeSection={activeSection}
                        onNavClick={handleNavClick}
                        onClose={() => setIsMobileMenuOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}