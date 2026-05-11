"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTestimonialStore, useUploadStore } from "@/lib/stores";
import { StarRating } from "./StarRating";
import ImageUpload from "@/components/ui/ImageUpload";
import { fadeInUp } from "./animations";

// Get token from auth store (you'll need to adjust this based on your auth setup)
import { useAuthStore } from "@/lib/stores";

export function TestimonialForm() {
    const { submitTestimonial, isSubmitting, submitSuccess, submitError, resetSubmitState } = useTestimonialStore();
    const { token } = useAuthStore();

    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [company, setCompany] = useState("");
    const [content, setContent] = useState("");
    const [rating, setRating] = useState(5);
    const [avatar, setAvatar] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!name.trim()) newErrors.name = "Name is required";
        if (!content.trim()) newErrors.content = "Feedback is required";
        if (content.trim().length < 10) newErrors.content = "Feedback must be at least 10 characters";
        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        const success = await submitTestimonial({
            name: name.trim(),
            role: role.trim() || undefined,
            company: company.trim() || undefined,
            content: content.trim(),
            rating,
            avatar: avatar || undefined,
        });

        if (success) {
            setName("");
            setRole("");
            setCompany("");
            setContent("");
            setRating(5);
            setAvatar(null);
            setErrors({});

            // Reset the upload store for this form
            useUploadStore.getState().resetUpload("testimonial-avatar");
        }
    };

    if (submitSuccess) {
        return (
            <motion.div
                className="text-center py-12 px-6 rounded-xl"
                style={{
                    background: "var(--success-50)",
                    border: "0.5px solid var(--success-500)",
                }}
                variants={fadeInUp}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                    <i
                        className="ti ti-circle-check text-5xl mb-4 block"
                        style={{ color: "var(--success-500)" }}
                        aria-hidden="true"
                    />
                </motion.div>
                <h3
                    className="text-lg font-medium mb-2"
                    style={{ color: "var(--success-700)" }}
                >
                    Thank You!
                </h3>
                <p
                    className="text-sm mb-6"
                    style={{ color: "var(--success-700)", opacity: 0.85 }}
                >
                    Your testimonial has been submitted and will appear after review.
                </p>
                <button
                    onClick={resetSubmitState}
                    className="btn btn-outline btn-sm"
                    style={{
                        borderColor: "var(--success-500)",
                        color: "var(--success-700)",
                    }}
                >
                    Submit another
                </button>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="rounded-xl p-6"
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
            variants={fadeInUp}
        >
            <h3
                className="text-lg font-medium mb-6"
                style={{ color: "var(--text-primary)" }}
            >
                Share Your Experience
            </h3>

            <div className="space-y-4">
                {/* Avatar Upload */}
                {token && (
                    <div>
                        <ImageUpload
                            token={token}
                            folder="testimonials"
                            uploadKey="testimonial-avatar"
                            value={avatar}
                            onChange={(publicId) => setAvatar(publicId)}
                            hint="Your Photo or company logo (optional)"
                            aspectRatio="square"
                            className="w-44 h-44"
                        />
                    </div>
                )}

                {/* Rating */}
                <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: "var(--text-secondary)" }}>
                        Rating
                    </label>
                    <StarRating
                        rating={rating}
                        onChange={setRating}
                        size="lg"
                        interactive
                    />
                </div>

                {/* Name */}
                <div>
                    <label
                        htmlFor="testimonial-name"
                        className="text-sm font-medium mb-1.5 block"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Name <span style={{ color: "var(--error-500)" }}>*</span>
                    </label>
                    <input
                        id="testimonial-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 ${errors.name ? "border-red-500 bg-red-50" : ""
                            }`}
                        style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            border: errors.name
                                ? "2px solid var(--error-500)"
                                : "2px solid var(--border-color)",
                        }}
                        placeholder="Your name"
                        maxLength={100}
                    />
                    {errors.name && (
                        <p className="text-xs mt-1" style={{ color: "var(--error-500)" }}>
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Role & Company */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label
                            htmlFor="testimonial-role"
                            className="text-sm font-medium mb-1.5 block"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Role
                        </label>
                        <input
                            id="testimonial-role"
                            type="text"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
                            style={{
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                border: "2px solid var(--border-color)",
                            }}
                            placeholder="e.g., Product Manager"
                            maxLength={100}
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="testimonial-company"
                            className="text-sm font-medium mb-1.5 block"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Company
                        </label>
                        <input
                            id="testimonial-company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200"
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

                {/* Feedback */}
                <div>
                    <label
                        htmlFor="testimonial-content"
                        className="text-sm font-medium mb-1.5 block"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Your Feedback <span style={{ color: "var(--error-500)" }}>*</span>
                    </label>
                    <textarea
                        id="testimonial-content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        className={`w-full px-4 py-2.5 rounded-lg text-sm transition-all duration-200 resize-none ${errors.content ? "border-red-500 bg-red-50" : ""
                            }`}
                        style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            border: errors.content
                                ? "2px solid var(--error-500)"
                                : "2px solid var(--border-color)",
                        }}
                        placeholder="Share your experience working with me..."
                        maxLength={500}
                    />
                    <div className="flex justify-between mt-1">
                        {errors.content ? (
                            <p className="text-xs" style={{ color: "var(--error-500)" }}>
                                {errors.content}
                            </p>
                        ) : (
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Min. 10 characters
                            </p>
                        )}
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {content.length}/500
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn btn-primary btn-md w-full"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Submitting...
                        </span>
                    ) : (
                        "Submit Testimonial"
                    )}
                </motion.button>

                {submitError && (
                    <p className="text-xs text-center" style={{ color: "var(--error-500)" }}>
                        {submitError}
                    </p>
                )}
            </div>
        </motion.form>
    );
}