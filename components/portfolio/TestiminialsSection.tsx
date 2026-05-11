"use client";

import { useTestimonialStore } from "@/lib/stores";
import { useEffect, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import {
    TestimonialsSkeleton,
    TestimonialGrid,
} from "./testimonials-components";

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

export default function TestimonialsSection() {
    const { fetchTestimonials, testimonials, isLoading } = useTestimonialStore();

    useEffect(() => {
        fetchTestimonials({ page: 1, limit: 10 });
    }, [fetchTestimonials]);

    const featuredTestimonials = useMemo(() => {
        return testimonials
            .filter((t) => t.featured)
            .slice(0, 6);
    }, [testimonials]);

    if (isLoading) return <TestimonialsSkeleton />;

    const hasTestimonials = testimonials.length > 0;
    const hasMoreTestimonials = testimonials.length > 6;

    return (
        <motion.section
            id="testimonials"
            aria-label="Testimonials"
            className="w-full py-16 md:py-24"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
        >
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                {/* Section header */}
                <motion.div variants={headerVariants}>
                    <div className="flex items-center justify-between mb-2">
                        <div>
                            <p
                                className="text-[10px] tracking-widest uppercase font-medium mb-2"
                                style={{ color: "var(--text-muted)" }}
                            >
                                Testimonials
                            </p>
                            <h2
                                className="font-Montserrat font-medium"
                                style={{
                                    fontSize: "clamp(1.5rem, 3vw, 1.875rem)",
                                    color: "var(--text-primary)",
                                }}
                            >
                                What People Say
                            </h2>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Write Testimonial CTA */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                            >
                                <Link
                                    href="/testimonials/new"
                                    className="btn btn-primary btn-sm group hidden sm:inline-flex items-center gap-2"
                                >
                                    <i className="ti ti-pencil" aria-hidden="true" />
                                    Share Experience
                                </Link>
                            </motion.div>

                            {/* See All Link */}
                            {hasMoreTestimonials && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3, duration: 0.5 }}
                                >
                                    <Link
                                        href="/testimonials"
                                        className="btn btn-outline btn-sm group hidden sm:inline-flex items-center gap-2"
                                    >
                                        <span>See all</span>
                                        <motion.i
                                            className="ti ti-arrow-right text-sm"
                                            aria-hidden="true"
                                            initial={{ x: 0 }}
                                            whileHover={{ x: 3 }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    </div>
                    <div
                        className="w-10 h-0.5 rounded-full mb-10"
                        style={{ background: "var(--border-color)" }}
                    />
                </motion.div>

                {/* Testimonials grid */}
                {hasTestimonials ? (
                    <TestimonialGrid testimonials={featuredTestimonials} showAll={false} />
                ) : (
                    <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <i
                            className="ti ti-messages text-4xl mb-4 block"
                            style={{ color: "var(--text-muted)" }}
                            aria-hidden="true"
                        />
                        <p
                            className="text-sm mb-6"
                            style={{ color: "var(--text-muted)" }}
                        >
                            No testimonials yet. Be the first to share your experience!
                        </p>
                        <Link
                            href="/testimonials/new"
                            className="btn btn-primary btn-md inline-flex items-center gap-2 group"
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
                    </motion.div>
                )}

                {/* Bottom CTAs for mobile */}
                <motion.div
                    className="flex flex-col sm:hidden items-center gap-3 mt-8"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                >
                    <Link
                        href="/testimonials/new"
                        className="btn btn-primary btn-md w-full justify-center inline-flex items-center gap-2"
                    >
                        <i className="ti ti-pencil" aria-hidden="true" />
                        Share Your Experience
                    </Link>

                    {hasMoreTestimonials && (
                        <Link
                            href="/testimonials"
                            className="btn btn-outline btn-md w-full justify-center inline-flex items-center gap-2 group"
                        >
                            <span>See all testimonials</span>
                            <motion.i
                                className="ti ti-arrow-right text-sm"
                                aria-hidden="true"
                                whileHover={{ x: 3 }}
                                transition={{ duration: 0.2 }}
                            />
                        </Link>
                    )}
                </motion.div>

                {/* Bottom CTA Card - Only show if there are testimonials */}
                {hasTestimonials && hasMoreTestimonials && (
                    <motion.div
                        className="hidden sm:block mt-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
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
                    </motion.div>
                )}
            </div>
        </motion.section>
    );
}