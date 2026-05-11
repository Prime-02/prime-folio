"use client";

import { useState, useEffect } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { useTestimonialStore, useUploadStore, useAuthStore } from "@/lib/stores";
import ImageUpload from "@/components/ui/ImageUpload";
import { StarRating } from "@/components/portfolio/testimonials-components";

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

const fadeInUp: Variants = {
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

const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94] as const,
        },
    },
};

export default function NewTestimonialPage() {
    const { submitTestimonial, isSubmitting, submitSuccess, submitError, resetSubmitState } = useTestimonialStore();
    const { token } = useAuthStore();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    // Reset form when component mounts
    useEffect(() => {
        resetSubmitState();
        useUploadStore.getState().resetUpload("testimonial-avatar-new");
    }, [resetSubmitState]);

    const validateStep = (step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!name.trim()) newErrors.name = "Name is required";
            if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";
        }

        if (step === 2) {
            if (!content.trim()) newErrors.content = "Feedback is required";
            if (content.trim().length < 10) newErrors.content = "Feedback must be at least 10 characters";
            if (content.trim().length > 500) newErrors.content = "Feedback must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(2)) return;

        const success = await submitTestimonial({
            name: name.trim(),
            role: role.trim() || undefined,
            company: company.trim() || undefined,
            content: content.trim(),
            rating,
            avatar: avatar || undefined,
        });

        if (success) {
            setCurrentStep(3);
            useUploadStore.getState().resetUpload("testimonial-avatar-new");
        }
    };

    const handleStartOver = () => {
        setName("");
        setRole("");
        setCompany("");
        setContent("");
        setRating(5);
        setAvatar(null);
        setErrors({});
        setCurrentStep(1);
        resetSubmitState();
    };

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <section className="w-full py-16 md:py-24">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <motion.div variants={fadeInUp} className="text-center mb-12">
                        {/* Back link */}
                        <Link
                            href="/testimonials"
                            className="inline-flex items-center gap-2 text-sm mb-6 group"
                            style={{ color: "var(--text-muted)" }}
                        >
                            <motion.i
                                className="ti ti-arrow-left"
                                aria-hidden="true"
                                whileHover={{ x: -3 }}
                                transition={{ duration: 0.2 }}
                            />
                            Back to testimonials
                        </Link>

                        <motion.p
                            className="text-[10px] tracking-widest uppercase font-medium mb-3"
                            style={{ color: "var(--text-muted)" }}
                        >
                            Share Your Experience
                        </motion.p>
                        <motion.h1
                            className="font-Montserrat font-medium mb-4"
                            style={{
                                fontSize: "clamp(1.875rem, 5vw, 3rem)",
                                color: "var(--text-primary)",
                            }}
                        >
                            Write a Testimonial
                        </motion.h1>
                        <motion.p
                            className="text-sm max-w-lg mx-auto"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Your feedback helps others understand what it&apos;s like to work with me.
                            I truly appreciate you taking the time to share your experience.
                        </motion.p>
                    </motion.div>

                    {/* Progress Steps */}
                    {currentStep < 3 && (
                        <motion.div
                            className="flex items-center justify-center gap-2 mb-12"
                            variants={fadeInUp}
                        >
                            {[1, 2, 3].map((step) => (
                                <div key={step} className="flex items-center gap-2">
                                    <motion.div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${step <= currentStep
                                                ? "text-white"
                                                : "text-muted"
                                            }`}
                                        style={{
                                            background: step <= currentStep
                                                ? step === 3
                                                    ? "var(--success-500)"
                                                    : "var(--primary-500)"
                                                : "var(--bg-tertiary)",
                                            color: step <= currentStep
                                                ? "white"
                                                : "var(--text-muted)",
                                        }}
                                        animate={step === currentStep ? { scale: [1, 1.1, 1] } : {}}
                                        transition={{ repeat: 0, duration: 0.3 }}
                                    >
                                        {step < currentStep ? (
                                            <i className="ti ti-check text-xs" aria-hidden="true" />
                                        ) : (
                                            step
                                        )}
                                    </motion.div>
                                    <span
                                        className="text-xs hidden sm:inline"
                                        style={{
                                            color: step <= currentStep
                                                ? "var(--text-primary)"
                                                : "var(--text-muted)",
                                        }}
                                    >
                                        {step === 1 && "Info"}
                                        {step === 2 && "Feedback"}
                                        {step === 3 && "Done"}
                                    </span>
                                    {step < 3 && (
                                        <div
                                            className="w-8 sm:w-16 h-0.5 mx-1"
                                            style={{
                                                background: step < currentStep
                                                    ? "var(--primary-500)"
                                                    : "var(--bg-tertiary)",
                                            }}
                                        />
                                    )}
                                </div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Form Content */}
            <section className="w-full pb-16 md:pb-24">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div
                                className="rounded-xl p-6 md:p-8"
                                style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                            >
                                <h2
                                    className="text-xl font-medium mb-2"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    About You
                                </h2>
                                <p
                                    className="text-sm mb-6"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    Tell us a bit about yourself. All fields except your name are optional.
                                </p>

                                <div className="space-y-5">
                                    {/* Avatar Upload */}
                                    {token && (
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block" style={{ color: "var(--text-secondary)" }}>
                                                Profile Photo (optional)
                                            </label>
                                            <ImageUpload
                                                token={token}
                                                folder="testimonials"
                                                uploadKey="testimonial-avatar-new"
                                                value={avatar}
                                                onChange={(publicId) => setAvatar(publicId)}
                                                hint="A clear photo of yourself helps personalize your testimonial"
                                                aspectRatio="square"
                                                minHeight={160}
                                            />
                                        </div>
                                    )}

                                    {/* Name */}
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="text-sm font-medium mb-1.5 block"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            Full Name <span style={{ color: "var(--error-500)" }}>*</span>
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                            style={{
                                                background: "var(--bg-primary)",
                                                color: "var(--text-primary)",
                                                border: errors.name
                                                    ? "2px solid var(--error-500)"
                                                    : "2px solid var(--border-color)",
                                            }}
                                            placeholder="e.g., John Doe"
                                            maxLength={100}
                                        />
                                        {errors.name && (
                                            <p className="text-xs mt-1" style={{ color: "var(--error-500)" }}>
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    {/* Role */}
                                    <div>
                                        <label
                                            htmlFor="role"
                                            className="text-sm font-medium mb-1.5 block"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            Your Role (optional)
                                        </label>
                                        <input
                                            id="role"
                                            type="text"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                            style={{
                                                background: "var(--bg-primary)",
                                                color: "var(--text-primary)",
                                                border: "2px solid var(--border-color)",
                                            }}
                                            placeholder="e.g., Senior Product Manager"
                                            maxLength={100}
                                        />
                                    </div>

                                    {/* Company */}
                                    <div>
                                        <label
                                            htmlFor="company"
                                            className="text-sm font-medium mb-1.5 block"
                                            style={{ color: "var(--text-secondary)" }}
                                        >
                                            Company (optional)
                                        </label>
                                        <input
                                            id="company"
                                            type="text"
                                            value={company}
                                            onChange={(e) => setCompany(e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                                            style={{
                                                background: "var(--bg-primary)",
                                                color: "var(--text-primary)",
                                                border: "2px solid var(--border-color)",
                                            }}
                                            placeholder="e.g., Acme Inc."
                                            maxLength={100}
                                        />
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex justify-end mt-8">
                                    <motion.button
                                        type="button"
                                        onClick={handleNext}
                                        className="btn btn-primary btn-md"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Next Step
                                        <i className="ti ti-arrow-right text-sm ml-2" aria-hidden="true" />
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Feedback */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <form onSubmit={handleSubmit}>
                                <div
                                    className="rounded-xl p-6 md:p-8"
                                    style={{
                                        background: "var(--bg-secondary)",
                                        border: "0.5px solid var(--border-light)",
                                    }}
                                >
                                    <h2
                                        className="text-xl font-medium mb-2"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        Your Feedback
                                    </h2>
                                    <p
                                        className="text-sm mb-6"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        Share your honest experience. Your testimonial will be reviewed before being published.
                                    </p>

                                    <div className="space-y-6">
                                        {/* Rating */}
                                        <div>
                                            <label className="text-sm font-medium mb-3 block" style={{ color: "var(--text-secondary)" }}>
                                                Overall Rating
                                            </label>
                                            <div className="flex items-center gap-4">
                                                <StarRating
                                                    rating={rating}
                                                    onChange={setRating}
                                                    size="lg"
                                                    interactive
                                                />
                                                <motion.span
                                                    className="text-sm font-medium"
                                                    style={{ color: "var(--warning-500)" }}
                                                    key={rating}
                                                    initial={{ scale: 1.5, opacity: 0 }}
                                                    animate={{ scale: 1, opacity: 1 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {rating === 5 && "Excellent!"}
                                                    {rating === 4 && "Great!"}
                                                    {rating === 3 && "Good"}
                                                    {rating === 2 && "Okay"}
                                                    {rating === 1 && "Poor"}
                                                </motion.span>
                                            </div>
                                        </div>

                                        {/* Divider */}
                                        <div className="h-px" style={{ background: "var(--border-light)" }} />

                                        {/* Feedback Text */}
                                        <div>
                                            <label
                                                htmlFor="content"
                                                className="text-sm font-medium mb-1.5 block"
                                                style={{ color: "var(--text-secondary)" }}
                                            >
                                                Your Testimonial <span style={{ color: "var(--error-500)" }}>*</span>
                                            </label>
                                            <textarea
                                                id="content"
                                                value={content}
                                                onChange={(e) => setContent(e.target.value)}
                                                rows={6}
                                                className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 resize-none"
                                                style={{
                                                    background: "var(--bg-primary)",
                                                    color: "var(--text-primary)",
                                                    border: errors.content
                                                        ? "2px solid var(--error-500)"
                                                        : "2px solid var(--border-color)",
                                                }}
                                                placeholder="Tell others about your experience working with me. What did you enjoy? What were the results? Would you recommend me to others?"
                                                maxLength={500}
                                            />
                                            <div className="flex justify-between mt-2">
                                                {errors.content ? (
                                                    <p className="text-xs" style={{ color: "var(--error-500)" }}>
                                                        {errors.content}
                                                    </p>
                                                ) : (
                                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                                        Be specific and authentic
                                                    </p>
                                                )}
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="h-1 rounded-full w-24"
                                                        style={{ background: "var(--bg-tertiary)" }}
                                                    >
                                                        <motion.div
                                                            className="h-full rounded-full"
                                                            style={{
                                                                width: `${(content.length / 500) * 100}%`,
                                                                background: content.length > 450
                                                                    ? "var(--warning-500)"
                                                                    : "var(--primary-500)",
                                                            }}
                                                            layout
                                                        />
                                                    </div>
                                                    <p
                                                        className={`text-xs ${content.length > 450
                                                                ? "text-warning"
                                                                : "text-muted"
                                                            }`}
                                                        style={{
                                                            color: content.length > 450
                                                                ? "var(--warning-500)"
                                                                : "var(--text-muted)",
                                                        }}
                                                    >
                                                        {content.length}/500
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Tips */}
                                        <div
                                            className="rounded-lg p-4"
                                            style={{
                                                background: "var(--info-50)",
                                                border: "0.5px solid var(--info-500)",
                                            }}
                                        >
                                            <p
                                                className="text-xs font-medium mb-2 flex items-center gap-1.5"
                                                style={{ color: "var(--info-700)" }}
                                            >
                                                <i className="ti ti-bulb text-sm" aria-hidden="true" />
                                                Tips for a great testimonial
                                            </p>
                                            <ul
                                                className="text-xs space-y-1"
                                                style={{ color: "var(--info-700)", opacity: 0.85 }}
                                            >
                                                <li>• Be specific about the project or collaboration</li>
                                                <li>• Mention results or outcomes if possible</li>
                                                <li>• Keep it genuine and authentic</li>
                                            </ul>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {submitError && (
                                        <motion.div
                                            className="mt-6 p-4 rounded-lg"
                                            style={{
                                                background: "var(--error-50)",
                                                border: "0.5px solid var(--error-500)",
                                            }}
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <p
                                                className="text-sm flex items-center gap-2"
                                                style={{ color: "var(--error-700)" }}
                                            >
                                                <i className="ti ti-alert-circle" aria-hidden="true" />
                                                {submitError}
                                            </p>
                                        </motion.div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex justify-between mt-8">
                                        <motion.button
                                            type="button"
                                            onClick={handlePrevious}
                                            className="btn btn-outline btn-md"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <i className="ti ti-arrow-left text-sm mr-2" aria-hidden="true" />
                                            Previous
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="btn btn-primary btn-md"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    Submitting...
                                                </span>
                                            ) : (
                                                <>
                                                    Submit Testimonial
                                                    <i className="ti ti-send text-sm ml-2" aria-hidden="true" />
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                            </form>
                        </motion.div>
                    )}

                    {/* Step 3: Success */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                        >
                            <div
                                className="rounded-xl p-8 md:p-12 text-center"
                                style={{
                                    background: "var(--success-50)",
                                    border: "0.5px solid var(--success-500)",
                                }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.3 }}
                                >
                                    <div
                                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                                        style={{
                                            background: "var(--success-100)",
                                            border: "2px solid var(--success-500)",
                                        }}
                                    >
                                        <i
                                            className="ti ti-circle-check text-4xl"
                                            style={{ color: "var(--success-500)" }}
                                            aria-hidden="true"
                                        />
                                    </div>
                                </motion.div>

                                <motion.h2
                                    className="text-2xl font-medium mb-3"
                                    style={{ color: "var(--success-700)" }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    Thank You for Your Feedback!
                                </motion.h2>

                                <motion.p
                                    className="text-sm mb-8 max-w-md mx-auto"
                                    style={{ color: "var(--success-700)", opacity: 0.85 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    Your testimonial has been successfully submitted. It will be reviewed
                                    and published shortly. I truly appreciate you taking the time to share
                                    your experience!
                                </motion.p>

                                <motion.div
                                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <Link
                                        href="/testimonials"
                                        className="btn btn-primary btn-md"
                                    >
                                        View All Testimonials
                                    </Link>
                                    <button
                                        onClick={handleStartOver}
                                        className="btn btn-outline btn-md"
                                        style={{
                                            borderColor: "var(--success-500)",
                                            color: "var(--success-700)",
                                        }}
                                    >
                                        Write Another
                                    </button>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </section>
        </motion.div>
    );
}