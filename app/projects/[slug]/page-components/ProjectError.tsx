import Link from "next/link";

interface ProjectErrorProps {
    error?: string;
}

export function ProjectError({ error }: ProjectErrorProps) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <i className="ti ti-alert-circle text-5xl mb-4 block" style={{ color: "var(--text-muted)" }} />
                <h2 className="text-xl font-medium mb-2" style={{ color: "var(--text-primary)" }}>
                    {error ?? "Project not found"}
                </h2>
                <Link href="/projects" className="btn btn-outline btn-sm mt-4">
                    View all projects
                </Link>
            </div>
        </div>
    );
}