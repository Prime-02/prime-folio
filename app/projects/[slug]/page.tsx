"use client";

import { useProjectStore } from "@/lib/stores";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
    ProjectSkeleton,
    ProjectError,
    HeroSection,
    ContentSection,
    NavigationSection,
} from "./page-components";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

export default function ProjectDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const { activeProject, fetchProjectBySlug, isLoading, error, clearActiveProject } = useProjectStore();

    useEffect(() => {
        if (slug) {
            fetchProjectBySlug(slug);
        }
        return () => clearActiveProject();
    }, [slug, fetchProjectBySlug, clearActiveProject]);

    if (isLoading) return <ProjectSkeleton />;
    if (error || !activeProject) {
        return <ProjectError error={error ?? undefined} />;
    }

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            <HeroSection project={activeProject} />
            <ContentSection description={activeProject.description} />
            <NavigationSection
                liveUrl={activeProject.liveUrl ?? undefined}
                repoUrl={activeProject.repoUrl ?? undefined}
            />
        </motion.div>
    );
}