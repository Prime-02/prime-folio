// components/admin/projects/ProjectCard.tsx
"use client";

import { Pencil, Trash2, Eye, ExternalLink, FolderOpen } from "lucide-react";
import type { Project } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

interface ProjectCardProps {
    project: Project;
    onDelete: () => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
    return (
        <div
            className="group relative flex flex-col rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] overflow-hidden hover:shadow-lg transition-shadow duration-200">
            {/* Cover Image */}
            {project.coverImage ? (
                <div className="relative h-40 sm:h-48 overflow-hidden bg-[var(--bg-tertiary)]">
                    <CloudinaryImage
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Link
                            href={`/admin/projects/${project.slug}/edit`}
                            className="p-2 rounded-lg bg-white/90 hover:bg-white text-[var(--text-primary)] transition-colors"
                            title="Edit project"
                        >
                            <Pencil size={16} />
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete();
                            }}
                            className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-[var(--text-primary)] hover:text-[var(--error-600)] transition-colors"
                            title="Delete project"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] flex items-center justify-center">
                    <FolderOpen size={48} className="text-[var(--text-muted)]" strokeWidth={1} />
                    {/* Overlay actions */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                        <Link
                            href={`/admin/projects/${project.slug}/edit`}
                            className="p-2 rounded-lg bg-white/90 hover:bg-white text-[var(--text-primary)] transition-colors"
                            title="Edit project"
                        >
                            <Pencil size={16} />
                        </Link>
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                onDelete();
                            }}
                            className="p-2 rounded-lg bg-white/90 hover:bg-red-50 text-[var(--text-primary)] hover:text-[var(--error-600)] transition-colors"
                            title="Delete project"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Content */}
            <div className="flex-1 flex flex-col p-4">
                {/* Title & Status */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <h2 className="text-sm font-semibold text-[var(--text-primary)] line-clamp-2">
                        {project.title}
                    </h2>
                    <div className="flex gap-1.5 shrink-0">
                        {!project.published && (
                            <Badge variant="warning" size="sm">
                                Draft
                            </Badge>
                        )}
                        {project.featured && (
                            <Badge variant="success" size="sm">
                                Featured
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-[var(--text-muted)] line-clamp-2 mb-3 flex-1">
                    {project.summary}
                </p>

                {/* Tags */}
                {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {project.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="default" size="sm">
                                {tag}
                            </Badge>
                        ))}
                        {project.tags.length > 3 && (
                            <Badge variant="default" size="sm">
                                +{project.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {/* Links & Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
                    <div className="flex items-center gap-2">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-600)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                title="View live site"
                            >
                                <ExternalLink size={14} />
                            </a>
                        )}
                        {project.repoUrl && (
                            <a
                                href={project.repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--primary-600)] hover:bg-[var(--bg-tertiary)] transition-colors"
                                title="View repository"
                            >
                                <BsGithub size={14} />
                            </a>
                        )}
                    </div>
                    <Link
                        href={`/admin/projects/${project.slug}/edit`}
                        className="text-xs font-medium text-[var(--primary-600)] hover:text-[var(--primary-700)] transition-colors"
                    >
                        Edit →
                    </Link>
                </div>
            </div>
        </div>
    );
}