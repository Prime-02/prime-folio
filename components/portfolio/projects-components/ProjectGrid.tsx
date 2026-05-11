import { motion } from "framer-motion";
import { ProjectCard } from "./ProjectCard";
import { staggerContainer } from "./animations";

interface Project {
    id: string;
    title: string;
    slug: string;
    summary: string;
    description: string;
    tags: string[];
    coverImage?: string | null;
    liveUrl?: string | null;
    repoUrl?: string | null;
    featured: boolean;
    published: boolean;
    order: number;
    createdAt: Date;
    updatedAt: Date;
}

interface ProjectGridProps {
    projects: Project[];
    showAll?: boolean;
}

export function ProjectGrid({ projects, showAll = false }: ProjectGridProps) {
    const displayProjects = showAll ? projects : projects.slice(0, 3);

    if (!displayProjects || displayProjects.length === 0) {
        return (
            <motion.div
                className="text-center py-12"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            >
                <i
                    className="ti ti-layout-grid text-4xl mb-4 block"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    No projects to show yet.
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
            {displayProjects.map((project, index) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                />
            ))}
        </motion.div>
    );
}