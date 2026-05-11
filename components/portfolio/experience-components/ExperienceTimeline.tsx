import { motion } from "framer-motion";
import { ExperienceCard } from "./ExperienceCard";
import { staggerContainer } from "./animations";

interface Experience {
    id: string;
    company: string;
    role: string;
    description?: string | null;
    location?: string | null;
    companyUrl?: string | null;
    companyLogo?: string | null;
    startDate: Date | string;
    endDate?: Date | string | null;
    current: boolean;
    order: number;
}

interface ExperienceTimelineProps {
    experiences: Experience[];
}

export function ExperienceTimeline({ experiences }: ExperienceTimelineProps) {
    if (!experiences || experiences.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <i
                    className="ti ti-briefcase text-4xl mb-4 block"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No experience added yet.
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

            {/* Experience cards with gap */}
            <motion.div
                className="flex flex-col gap-8"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
            >
                {experiences.map((experience, index) => (
                    <ExperienceCard
                        key={experience.id}
                        experience={experience}
                        index={index}
                    />
                ))}
            </motion.div>
        </div>
    );
}