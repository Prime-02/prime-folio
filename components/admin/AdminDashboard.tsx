// components/admin/AdminDashboard.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuthStore, toast } from "@/lib/stores";
import { SectionLoader, Card, CardHeader, Button } from "@/components/ui";
import type { DashboardStats } from "@/lib/types";
import { FolderKanban, FileText, MessageSquareQuote, Mail, ArrowRight, Plus, Pencil, Check, ExternalLink } from "lucide-react";

interface StatCardProps {
    label: string;
    value: number;
    sub?: string;
    subValue?: number;
    subLabel?: string;
    href: string;
    icon: React.ReactNode;
    accent: string;
}

function StatCard({ label, value, sub, subValue, subLabel, href, icon, accent }: StatCardProps) {
    return (
        <a
            href={href}
            className="group block rounded-xl p-6 border transition-all duration-200 hover:shadow-lg"
            style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-light)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)")}
        >
            <div className="flex items-start justify-between mb-4">
                <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: accent + "15", color: accent }}
                >
                    {icon}
                </div>
                <ArrowRight
                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1 group-hover:translate-x-0 duration-200"
                    style={{ color: "var(--text-muted)" }}
                />
            </div>

            <div
                className="text-3xl font-bold tracking-tight mb-1"
                style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
            >
                {value}
            </div>
            <div className="text-sm font-medium mb-3" style={{ color: "var(--text-secondary)" }}>
                {label}
            </div>

            {sub && subValue !== undefined && (
                <div
                    className="text-xs px-2 py-1 rounded-md inline-flex items-center gap-1"
                    style={{ backgroundColor: "var(--bg-tertiary)", color: "var(--text-muted)" }}
                >
                    <span
                        className="inline-block w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: subValue > 0 ? "var(--warning-500)" : "var(--success-500)" }}
                    />
                    {subValue} {subLabel}
                </div>
            )}
        </a>
    );
}

export default function AdminDashboard() {
    const { token } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;

        fetch("/api/admin/stats", {
            headers: { Authorization: `Bearer ${token}` },
        })
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setStats(d.data);
                else toast.error("Failed to load stats");
            })
            .catch(() => toast.error("Failed to load stats"))
            .finally(() => setLoading(false));
    }, [token]);

    if (loading) return <SectionLoader message="Loading dashboard…" />;

    const cards: StatCardProps[] = [
        {
            label: "Total Projects",
            value: stats?.projects.total ?? 0,
            subValue: stats?.projects.total !== undefined ? (stats.projects.total - stats.projects.published) : 0,
            subLabel: "unpublished",
            href: "/admin/projects",
            accent: "var(--info-500)",
            icon: <FolderKanban className="w-5 h-5" />,
        },
        {
            label: "Blog Posts",
            value: stats?.posts.total ?? 0,
            subValue: stats?.posts.total !== undefined ? (stats.posts.total - stats.posts.published) : 0,
            subLabel: "drafts",
            href: "/admin/blog",
            accent: "var(--success-500)",
            icon: <FileText className="w-5 h-5" />,
        },
        {
            label: "Testimonials",
            value: stats?.testimonials.total ?? 0,
            subValue: stats?.testimonials.pending,
            subLabel: "pending approval",
            href: "/admin/testimonials",
            accent: "var(--warning-500)",
            icon: <MessageSquareQuote className="w-5 h-5" />,
        },
        {
            label: "Messages",
            value: stats?.messages.total ?? 0,
            subValue: stats?.messages.unread,
            subLabel: "unread",
            href: "/admin/contact",
            accent: "var(--error-500)",
            icon: <Mail className="w-5 h-5" />,
        },
    ];

    const quickActions = [
        { label: "Add Project", href: "/admin/projects/new", icon: <Plus className="w-4 h-4" /> },
        { label: "Register Blog Post", href: "/admin/blog/new", icon: <Plus className="w-4 h-4" /> },
        { label: "Edit Profile", href: "/admin/profile", icon: <Pencil className="w-4 h-4" /> },
        { label: "Review Testimonials", href: "/admin/testimonials", icon: <Check className="w-4 h-4" /> },
        { label: "Read Messages", href: "/admin/contact", icon: <Mail className="w-4 h-4" /> },
        { label: "View Site", href: "/", icon: <ExternalLink className="w-4 h-4" /> },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Page heading */}
            <div className="mb-8">
                <h1
                    className="text-2xl font-bold tracking-tight mb-1"
                    style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
                >
                    Overview
                </h1>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                    Your portfolio at a glance
                </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
                {cards.map((card) => (
                    <StatCard key={card.label} {...card} />
                ))}
            </div>

            {/* Quick actions */}
            <Card>
                <CardHeader
                    title="Quick Actions"
                    description="Shortcuts to common tasks"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {quickActions.map((action) => (
                        <a
                            key={action.label}
                            href={action.href}
                            target={action.href === "/" ? "_blank" : undefined}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-150"
                            style={{
                                backgroundColor: "var(--bg-secondary)",
                                borderColor: "var(--border-light)",
                                color: "var(--text-secondary)",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-hover)";
                                (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-tertiary)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLElement).style.borderColor = "var(--border-light)";
                                (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)";
                                (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-secondary)";
                            }}
                        >
                            <span
                                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ backgroundColor: "var(--bg-hover)", color: "var(--text-primary)" }}
                            >
                                {action.icon}
                            </span>
                            {action.label}
                        </a>
                    ))}
                </div>
            </Card>
        </div>
    );
}