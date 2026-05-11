import { motion, type Variants, AnimatePresence } from "framer-motion";
import { ProjectCard } from "@/components/portfolio/projects-components";
import { Project } from "@prisma/client";

const staggerGrid: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: {
            duration: 0.3,
        },
    },
};

interface ProjectsGridProps {
    projects: Project[];
    filterKey: string;
}

export function ProjectsGrid({ projects, filterKey }: ProjectsGridProps) {
    return (
        <section className="w-full pb-16 md:pb-24">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={filterKey}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerGrid}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                variants={cardVariants}
                                layout
                            >
                                <ProjectCard project={project} index={0} />
                            </motion.div>
                        ))}
                    </motion.div>
                </AnimatePresence>
            </div>
        </section>
    );
}