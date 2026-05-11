import { motion } from "framer-motion";
import { TestimonialCard } from "./TestimonialCard";
import { staggerContainer } from "./animations";

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

interface TestimonialGridProps {
    testimonials: Testimonial[];
    showAll?: boolean;
}

export function TestimonialGrid({ testimonials, showAll = false }: TestimonialGridProps) {
    const displayTestimonials = showAll ? testimonials : testimonials.slice(0, 6);

    if (!displayTestimonials || displayTestimonials.length === 0) {
        return (
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
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No testimonials yet. Be the first to share your experience!
                </p>
            </motion.div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
        >
            {displayTestimonials.map((testimonial, index) => (
                <TestimonialCard
                    key={testimonial.id}
                    testimonial={testimonial}
                    index={index}
                />
            ))}
        </motion.div>
    );
}