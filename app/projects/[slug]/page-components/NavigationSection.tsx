import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

interface NavigationSectionProps {
    liveUrl?: string;
    repoUrl?: string;
}

export function NavigationSection({ liveUrl, repoUrl }: NavigationSectionProps) {
    return (
        <section className="w-full pb-16 md:pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: "0.5px solid var(--border-light)" }}
                    variants={fadeInUp}
                >
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm group"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <motion.i
                            className="ti ti-arrow-left"
                            aria-hidden="true"
                            whileHover={{ x: -3 }}
                            transition={{ duration: 0.2 }}
                        />
                        Back to all projects
                    </Link>

                    <div className="flex items-center gap-3">
                        {liveUrl && (
                            <a
                                href={liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm"
                            >
                                <i className="ti ti-external-link text-sm" aria-hidden="true" />
                                Live Site
                            </a>
                        )}
                        {repoUrl && (
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-outline btn-sm"
                            >
                                <i className="ti ti-brand-github text-sm" aria-hidden="true" />
                                Source Code
                            </a>
                        )}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}