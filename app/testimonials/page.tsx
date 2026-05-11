"use client";

import { useTestimonialStore } from "@/lib/stores";
import { useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Pagination } from "@/components/ui/Pagination";
import { TestimonialGrid, TestimonialsSkeleton } from "@/components/portfolio/testimonials-components";

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

export default function TestimonialsPage() {
    const {
        fetchTestimonials,
        testimonials,
        isLoading,
        pagination,
        nextPage,
        previousPage,
        goToPage,
    } = useTestimonialStore();

    useEffect(() => {
        fetchTestimonials({ page: 1, limit: 10 });
    }, [fetchTestimonials]);

    const getPageNumbers = () => {
        if (!pagination) return [];
        const { page, totalPages } = pagination;
        const pages: (number | string)[] = [];

        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i);
            }
            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    if (isLoading) return <TestimonialsSkeleton />;

    const hasTestimonials = testimonials && testimonials.length > 0;

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <motion.div variants={headerVariants} className="text-center mb-12">
                        <motion.p
                            className="text-[10px] tracking-widest uppercase font-medium mb-3"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Testimonials
                        </motion.p>
                        <motion.h1
                            className="font-Montserrat font-medium mb-4"
                            style={{
                                fontSize: "clamp(1.875rem, 5vw, 3rem)",
                                color: "var(--text-primary)",
                            }}
                        >
                            What People Say
                        </motion.h1>
                        <motion.p
                            className="text-sm max-w-lg mx-auto mb-8"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Kind words from clients, colleagues, and collaborators I&apos;ve had the pleasure of working with.
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                        >
                            <Link
                                href="/testimonials/new"
                                className="btn btn-primary btn-md group inline-flex items-center gap-2"
                            >
                                <i className="ti ti-pencil" aria-hidden="true" />
                                Share Your Experience
                                <motion.i
                                    className="ti ti-arrow-right text-sm"
                                    aria-hidden="true"
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="w-full pb-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <TestimonialGrid testimonials={testimonials} showAll={true} />
                </div>
            </section>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <Pagination
                    pagination={{
                        page: pagination.page,
                        totalPages: pagination.totalPages,
                        totalCount: pagination.totalCount,
                        hasNextPage: pagination.hasNextPage,
                        hasPreviousPage: pagination.hasPreviousPage,
                    }}
                    onNextPage={nextPage}
                    onPreviousPage={previousPage}
                    onGoToPage={goToPage}
                    getPageNumbers={getPageNumbers}
                    itemLabel="testimonials"
                />
            )}

            {/* Bottom CTA - Only show if there are testimonials */}
            {hasTestimonials && (
                <motion.section
                    className="w-full py-12"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    <div className="max-w-5xl mx-auto px-4 sm:px-6">
                        <div
                            className="text-center p-8 rounded-xl"
                            style={{
                                background: "var(--bg-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                        >
                            <i
                                className="ti ti-message-heart text-3xl mb-3 block"
                                style={{ color: "var(--text-muted)" }}
                                aria-hidden="true"
                            />
                            <h3
                                className="text-lg font-medium mb-2"
                                style={{ color: "var(--text-primary)" }}
                            >
                                Worked with me?
                            </h3>
                            <p
                                className="text-sm mb-4"
                                style={{ color: "var(--text-muted)" }}
                            >
                                I&apos;d love to hear about your experience. Your feedback helps others!
                            </p>
                            <Link
                                href="/testimonials/new"
                                className="btn btn-outline btn-md inline-flex items-center gap-2 group"
                            >
                                <i className="ti ti-pencil" aria-hidden="true" />
                                Write a Testimonial
                                <motion.i
                                    className="ti ti-arrow-right text-sm"
                                    aria-hidden="true"
                                    whileHover={{ x: 3 }}
                                    transition={{ duration: 0.2 }}
                                />
                            </Link>
                        </div>
                    </div>
                </motion.section>
            )}

            {/* Back to home */}
            <motion.div
                className="text-center pb-16"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
            >
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm group"
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
            </motion.div>
        </motion.div>
    );
}