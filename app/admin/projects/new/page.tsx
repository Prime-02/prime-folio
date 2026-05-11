// app/admin/projects/new/page.tsx
"use client";

import { Breadcrumb } from "@/components/ui/Misc";
import ProjectForm from "@/components/admin/projects/ProjectForm";

export default function NewProjectPage() {
    return (
        <div className="min-h-screen bg-[var(--bg-primary)]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Projects", href: "/admin/projects" },
                            { label: "New Project" },
                        ]}
                        className="mb-3"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        New Project
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Create a new project to showcase in your portfolio
                    </p>
                </div>

                <ProjectForm />
            </div>
        </div>
    );
}