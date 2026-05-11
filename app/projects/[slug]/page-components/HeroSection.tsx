"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import CloudinaryImage from "@/components/ui/CloudinaryImage";
import { Project } from "@prisma/client";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

interface HeroSectionProps {
    project: Project;
}

// Utility to truncate text with ellipsis
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
}

export function HeroSection({ project }: HeroSectionProps) {
    // Content length constraints
    const MAX_TITLE_LENGTH = 120;
    const MAX_SUMMARY_LENGTH = 200;
    const MAX_TAGS = 6;
    const MAX_TAG_LENGTH = 20;

    const displayTitle = truncateText(project.title, MAX_TITLE_LENGTH);
    const displaySummary = truncateText(project.summary, MAX_SUMMARY_LENGTH);
    const displayTags = project.tags.slice(0, MAX_TAGS).map(tag =>
        truncateText(tag, MAX_TAG_LENGTH)
    );

    return (
        <section className="relative w-full min-h-[60vh] flex items-end pb-16">
            {/* Background image with overlay */}
            {project.coverImage ? (
                <div className="absolute inset-0">
                    <CloudinaryImage
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover"
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: "linear-gradient(to top, var(--bg-primary) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.6) 100%)",
                        }}
                    />
                </div>
            ) : (
                <div
                    className="absolute inset-0"
                    style={{
                        background: "linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)",
                    }}
                />
            )}

            {/* Content */}
            <div className="relative z-10 w-full pt-24 sm:pt-32 md:pt-40">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div variants={fadeInUp} className="max-w-3xl">
                        {/* Back button */}
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-sm mb-6 group"
                            style={{ color: project.coverImage ? "rgba(255,255,255,0.8)" : "var(--text-muted)" }}
                        >
                            <motion.i
                                className="ti ti-arrow-left"
                                aria-hidden="true"
                                whileHover={{ x: -3 }}
                                transition={{ duration: 0.2 }}
                            />
                            Back to projects
                        </Link>

                        {/* Featured badge */}
                        {project.featured && (
                            <motion.span
                                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full mb-4"
                                style={{
                                    background: "var(--warning-500)",
                                    color: "white",
                                }}
                                variants={fadeInUp}
                            >
                                <i className="ti ti-star text-xs" aria-hidden="true" />
                                Featured Project
                            </motion.span>
                        )}

                        {/* Title - controlled length with line clamping */}
                        <motion.h1
                            className="font-Montserrat font-medium mb-6"
                            style={{
                                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                                lineHeight: 1.2,
                                maxHeight: "clamp(4.8rem, 12vw, 8.4rem)", // 2 lines max
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                color: project.coverImage ? "white" : "var(--text-primary)",
                                textShadow: project.coverImage ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
                                wordBreak: "break-word",
                            }}
                            variants={fadeInUp}
                            title={project.title.length > MAX_TITLE_LENGTH ? project.title : undefined}
                        >
                            {displayTitle}
                        </motion.h1>

                        {/* Summary - controlled length with line clamping */}
                        <motion.p
                            className="text-base sm:text-lg leading-relaxed mb-8"
                            style={{
                                color: project.coverImage ? "rgba(255,255,255,0.9)" : "var(--text-secondary)",
                                maxHeight: "7em", // ~4 lines
                                overflow: "hidden",
                                display: "-webkit-box",
                                WebkitLineClamp: 4,
                                WebkitBoxOrient: "vertical",
                                wordBreak: "break-word",
                            }}
                            variants={fadeInUp}
                            title={project.summary.length > MAX_SUMMARY_LENGTH ? project.summary : undefined}
                        >
                            {displaySummary}
                        </motion.p>

                        {/* Tags - controlled count and individual length */}
                        <motion.div
                            className="flex flex-wrap gap-2 mb-8"
                            variants={fadeInUp}
                        >
                            {displayTags.map((tag, index) => (
                                <span
                                    key={`${tag}-${index}`}
                                    className="text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap"
                                    style={{
                                        maxWidth: "150px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        background: project.coverImage
                                            ? "rgba(255,255,255,0.15)"
                                            : "var(--bg-primary)",
                                        color: project.coverImage
                                            ? "rgba(255,255,255,0.9)"
                                            : "var(--text-secondary)",
                                        border: `0.5px solid ${project.coverImage
                                            ? "rgba(255,255,255,0.2)"
                                            : "var(--border-light)"
                                            }`,
                                        backdropFilter: project.coverImage ? "blur(10px)" : "none",
                                    }}
                                    title={project.tags[index].length > MAX_TAG_LENGTH ? project.tags[index] : undefined}
                                >
                                    {tag}
                                </span>
                            ))}
                            {/* Show remaining tags count if truncated */}
                            {project.tags.length > MAX_TAGS && (
                                <span
                                    className="text-xs font-medium px-3 py-1 rounded-full"
                                    style={{
                                        background: project.coverImage
                                            ? "rgba(255,255,255,0.15)"
                                            : "var(--bg-primary)",
                                        color: project.coverImage
                                            ? "rgba(255,255,255,0.9)"
                                            : "var(--text-secondary)",
                                        border: `0.5px solid ${project.coverImage
                                            ? "rgba(255,255,255,0.2)"
                                            : "var(--border-light)"
                                            }`,
                                        backdropFilter: project.coverImage ? "blur(10px)" : "none",
                                    }}
                                >
                                    +{project.tags.length - MAX_TAGS}
                                </span>
                            )}
                        </motion.div>

                        {/* Action buttons */}
                        <motion.div
                            className="flex flex-wrap gap-3"
                            variants={fadeInUp}
                        >
                            {project.liveUrl && (
                                <motion.a
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary btn-md whitespace-nowrap"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <i className="ti ti-external-link" aria-hidden="true" />
                                    Visit Live Site
                                </motion.a>
                            )}
                            {project.repoUrl && (
                                <motion.a
                                    href={project.repoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-secondary btn-md whitespace-nowrap"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{
                                        background: project.coverImage
                                            ? "rgba(255,255,255,0.15)"
                                            : "var(--bg-secondary)",
                                        border: `0.5px solid ${project.coverImage
                                            ? "rgba(255,255,255,0.2)"
                                            : "var(--border-light)"
                                            }`,
                                        color: project.coverImage ? "white" : "var(--text-primary)",
                                        backdropFilter: project.coverImage ? "blur(10px)" : "none",
                                    }}
                                >
                                    <i className="ti ti-brand-github" aria-hidden="true" />
                                    View Source Code
                                </motion.a>
                            )}
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}