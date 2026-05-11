// app/admin/projects/[slug]/edit/page.tsx
"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function EditProjectPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params?.slug as string;

    const { activeProject, isLoading, error, fetchProjectBySlug, clearActiveProject } =
        useProjectStore();

    useEffect(() => {
        if (slug) {
            fetchProjectBySlug(slug);
        }
        return () => {
            clearActiveProject();
        };
    }, [slug, fetchProjectBySlug, clearActiveProject]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <SectionLoader message="Loading project…" />
                </div>
            </div>
        );
    }

    if (error || !activeProject) {
        return (
            <div className="min-h-screen bg-[var(--bg-primary)]">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="mb-6 sm:mb-8">
                        <Breadcrumb
                            items={[
                                { label: "Admin", href: "/admin" },
                                { label: "Projects", href: "/admin/projects" },
                                { label: "Edit Project" },
                            ]}
                            className="mb-3"
                        />
                    </div>
                    <div className="text-center py-12">
                        <p className="text-lg text-[var(--text-muted)]">
                            {error || "Project not found"}
                        </p>
                        <button
                            onClick={() => router.push("/admin/projects")}
                            className="mt-4 text-sm text-[var(--primary-600)] hover:text-[var(--primary-700)]"
                        >
                            ← Back to projects
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Projects", href: "/admin/projects" },
                            { label: activeProject.title },
                        ]}
                        className="mb-3"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        Edit Project
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Editing: {activeProject.title}
                    </p>
                </div>

                <ProjectForm project={activeProject} isEditing={true} />
            </div>
        </div>
    );
}