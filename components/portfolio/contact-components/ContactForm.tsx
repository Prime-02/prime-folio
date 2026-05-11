"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useContactStore } from "@/lib/stores";
import { fadeInUp } from "./animations";

export function ContactForm() {
    const { submitContact, isSubmitting, submitSuccess, submitError, resetSubmitState } = useContactStore();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!name.trim()) newErrors.name = "Name is required";
        if (name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

        if (!email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!message.trim()) newErrors.message = "Message is required";
        if (message.trim().length < 10) newErrors.message = "Message must be at least 10 characters";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        const success = await submitContact({
            name: name.trim(),
            email: email.trim(),
            subject: subject.trim() || undefined,
            message: message.trim(),
        });

        if (success) {
            setName("");
            setEmail("");
            setSubject("");
            setMessage("");
            setErrors({});
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
                initial="hidden"   // ← add this
                animate="visible"  // ← add this
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                >
                    <div
                        className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{
                            background: "var(--success-100)",
                            border: "2px solid var(--success-500)",
                        }}
                    >
                        <i
                            className="ti ti-send text-3xl"
                            style={{ color: "var(--success-500)" }}
                            aria-hidden="true"
                        />
                    </div>
                </motion.div>

                <h3
                    className="text-xl font-medium mb-2"
                    style={{ color: "var(--success-700)" }}
                >
                    Message Sent!
                </h3>
                <p
                    className="text-sm mb-6"
                    style={{ color: "var(--success-700)", opacity: 0.85 }}
                >
                    Thank you for reaching out. I&apos;ll get back to you as soon as possible.
                </p>
                <button
                    onClick={resetSubmitState}
                    className="btn btn-outline btn-sm"
                    style={{
                        borderColor: "var(--success-500)",
                        color: "var(--success-700)",
                    }}
                >
                    Send another message
                </button>
            </motion.div>
        );
    }

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="rounded-xl p-6 md:p-8"
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
            variants={fadeInUp}
            initial="hidden"   // ← add this
            animate="visible"  // ← add this
        >
            <div className="space-y-5">
                {/* Name & Email row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="contact-name"
                            className="text-sm font-medium mb-1.5 block"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Name <span style={{ color: "var(--error-500)" }}>*</span>
                        </label>
                        <input
                            id="contact-name"
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
                            placeholder="Your name"
                            maxLength={100}
                        />
                        {errors.name && (
                            <p className="text-xs mt-1" style={{ color: "var(--error-500)" }}>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="contact-email"
                            className="text-sm font-medium mb-1.5 block"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            Email <span style={{ color: "var(--error-500)" }}>*</span>
                        </label>
                        <input
                            id="contact-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                            style={{
                                background: "var(--bg-primary)",
                                color: "var(--text-primary)",
                                border: errors.email
                                    ? "2px solid var(--error-500)"
                                    : "2px solid var(--border-color)",
                            }}
                            placeholder="your@email.com"
                            maxLength={100}
                        />
                        {errors.email && (
                            <p className="text-xs mt-1" style={{ color: "var(--error-500)" }}>
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Subject */}
                <div>
                    <label
                        htmlFor="contact-subject"
                        className="text-sm font-medium mb-1.5 block"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Subject (optional)
                    </label>
                    <input
                        id="contact-subject"
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200"
                        style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            border: "2px solid var(--border-color)",
                        }}
                        placeholder="What's this about?"
                        maxLength={200}
                    />
                </div>

                {/* Message */}
                <div>
                    <label
                        htmlFor="contact-message"
                        className="text-sm font-medium mb-1.5 block"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        Message <span style={{ color: "var(--error-500)" }}>*</span>
                    </label>
                    <textarea
                        id="contact-message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        className="w-full px-4 py-3 rounded-lg text-sm transition-all duration-200 resize-none"
                        style={{
                            background: "var(--bg-primary)",
                            color: "var(--text-primary)",
                            border: errors.message
                                ? "2px solid var(--error-500)"
                                : "2px solid var(--border-color)",
                        }}
                        placeholder="Tell me about your project, idea, or just say hello..."
                        maxLength={1000}
                    />
                    <div className="flex justify-between mt-1.5">
                        {errors.message ? (
                            <p className="text-xs" style={{ color: "var(--error-500)" }}>
                                {errors.message}
                            </p>
                        ) : (
                            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                Min. 10 characters
                            </p>
                        )}
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {message.length}/1000
                        </p>
                    </div>
                </div>

                {/* Error message */}
                {submitError && (
                    <motion.div
                        className="p-4 rounded-lg"
                        style={{
                            background: "var(--error-50)",
                            border: "0.5px solid var(--error-500)",
                        }}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <p className="text-sm flex items-center gap-2" style={{ color: "var(--error-700)" }}>
                            <i className="ti ti-alert-circle" aria-hidden="true" />
                            {submitError}
                        </p>
                    </motion.div>
                )}

                {/* Submit button */}
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
                            Sending...
                        </span>
                    ) : (
                        <>
                            <i className="ti ti-send" aria-hidden="true" />
                            Send Message
                        </>
                    )}
                </motion.button>
            </div>
        </motion.form>
    );
}