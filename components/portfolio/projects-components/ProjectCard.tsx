import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectImage } from "./ProjectImage";
import { ProjectTags } from "./ProjectTags";
import { scaleIn } from "./animations";

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

interface ProjectCardProps {
    project: Project;
    index: number;
}

export function ProjectCard({ project, index }: ProjectCardProps) {
    return (
        <motion.div
            variants={scaleIn}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                href={`/projects/${project.slug}`}
                className="block rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border-light)",
                }}
            >
                {/* Project Image */}
                <ProjectImage
                    coverImage={project.coverImage}
                    title={project.title}
                />

                {/* Content */}
                <div className="p-5">
                    {/* Title */}
                    <h3
                        className="text-base font-medium mb-2 group-hover:underline"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {project.title}
                    </h3>

                    {/* Summary */}
                    <p
                        className="text-xs leading-relaxed mb-4 line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {project.summary}
                    </p>

                    {/* Tags */}
                    <div className="flex items-center justify-between">
                        <ProjectTags tags={project.tags} limit={3} />

                        {/* External links */}
                        <div className="flex items-center gap-2">
                            {project.liveUrl && (
                                <motion.span
                                    className="text-[10px] flex items-center gap-1"
                                    style={{ color: "var(--text-muted)" }}
                                    whileHover={{ color: "var(--primary-500)" }}
                                >
                                    <i className="ti ti-external-link text-xs" aria-hidden="true" />
                                    Live
                                </motion.span>
                            )}
                            {project.repoUrl && (
                                <motion.span
                                    className="text-[10px] flex items-center gap-1"
                                    style={{ color: "var(--text-muted)" }}
                                    whileHover={{ color: "var(--primary-500)" }}
                                >
                                    <i className="ti ti-brand-github text-xs" aria-hidden="true" />
                                    Code
                                </motion.span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}