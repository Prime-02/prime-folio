import { motion } from "framer-motion";
import { EducationCard } from "./EducationCard";
import { staggerContainer } from "./animations";

interface Education {
    id: string;
    institution: string;
    degree: string;
    field?: string | null;
    description?: string | null;
    logo?: string | null;
    startYear: number;
    endYear?: number | null;
    current: boolean;
    order: number;
}

interface EducationTimelineProps {
    educations: Education[];
}

export function EducationTimeline({ educations }: EducationTimelineProps) {
    if (!educations || educations.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <i
                    className="ti ti-school text-4xl mb-4 block"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No education added yet.
                </p>
            </motion.div>
        );
    }

    return (
        <div className="relative">
            {/* Timeline line */}
            <motion.div
                className="absolute left-[5px] md:left-[5px] top-2 bottom-2 w-0.5"
                style={{ background: "var(--border-light)" }}
                initial={{ height: 0 }}
                whileInView={{ height: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Education cards */}
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {educations.map((education, index) => (
                    <EducationCard
                        key={education.id}
                        education={education}
                        index={index}
                    />
                ))}
            </motion.div>
        </div>
    );
}