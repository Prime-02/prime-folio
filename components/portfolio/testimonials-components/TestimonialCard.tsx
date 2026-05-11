import { motion } from "framer-motion";
import { StarRating } from "./StarRating";
import Avatar from "@/components/ui/Avatar";
import { scaleIn } from "./animations";

interface Testimonial {
    id: string;
    name: string;
    role?: string | null;
    company?: string | null;
    avatar?: string | null;
    content: string;
    rating: number;
    approved: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    index: number;
}

export function TestimonialCard({ testimonial, index }: TestimonialCardProps) {
    return (
        <motion.div
            className="rounded-xl p-6 relative group"
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
            variants={scaleIn}
            whileHover={{
                y: -4,
                boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
            }}
            transition={{ duration: 0.2 }}
        >
            {/* Quote icon */}
            <div
                className="absolute top-4 right-4 opacity-10"
                style={{ color: "var(--text-muted)" }}
            >
                <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
            </div>

            {/* Rating */}
            <div className="mb-4">
                <StarRating rating={testimonial.rating} size="sm" />
            </div>

            {/* Content */}
            <p
                className="text-sm leading-relaxed mb-6 line-clamp-4"
                style={{ color: "var(--text-secondary)" }}
            >
                "{testimonial.content}"
            </p>

            {/* Author */}
            <div className="flex items-center gap-3 mt-auto">
                <Avatar
                    src={testimonial.avatar}
                    name={testimonial.name}
                    size="sm"
                />
                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {testimonial.name}
                    </p>
                    {(testimonial.role || testimonial.company) && (
                        <p
                            className="text-xs truncate"
                            style={{ color: "var(--text-muted)" }}
                        >
                            {[testimonial.role, testimonial.company]
                                .filter(Boolean)
                                .join(" at ")}
                        </p>
                    )}
                </div>

                {testimonial.featured && (
                    <motion.div
                        className="shrink-0"
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    >
                        <i
                            className="ti ti-star-filled text-sm"
                            style={{ color: "var(--warning-500)" }}
                            aria-label="Featured testimonial"
                        />
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}