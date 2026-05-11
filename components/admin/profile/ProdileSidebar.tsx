// components/admin/profile/ProfileSidebar.tsx
"use client";

import { UserCircle, Lightbulb, Briefcase, GraduationCap, Link2 } from "lucide-react";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import { useProfileStore } from "@/lib/stores/useProfileStore";

export type ProfileSection =
    | "core"
    | "skills"
    | "experience"
    | "education"
    | "social";

interface NavItem {
    id: ProfileSection;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: "core", label: "Core Info", icon: <UserCircle size={16} /> },
    { id: "skills", label: "Skills", icon: <Lightbulb size={16} /> },
    { id: "experience", label: "Experience", icon: <Briefcase size={16} /> },
    { id: "education", label: "Education", icon: <GraduationCap size={16} /> },
    { id: "social", label: "Social Links", icon: <Link2 size={16} /> },
];

const countMap: Record<ProfileSection, (p: any) => number | null> = {
    core: () => null,
    skills: (p) => p?.skills?.length ?? null,
    experience: (p) => p?.experiences?.length ?? null,
    education: (p) => p?.educations?.length ?? null,
    social: (p) => p?.socialLinks?.length ?? null,
};

interface ProfileSidebarProps {
    active: ProfileSection;
    onChange: (s: ProfileSection) => void;
}

export default function ProfileSidebar({ active, onChange }: ProfileSidebarProps) {
    const profile = useProfileStore((s) => s.profile);

    return (
        <aside className="w-full lg:w-56 lg:sticky lg:top-6 shrink-0 flex flex-col gap-6">
            {/* Identity snapshot */}
            <div className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl border border-[var(--border-light)] bg-[var(--bg-secondary)]">
                <Avatar
                    src={profile?.profilePhoto}
                    name={profile?.name ?? "Profile"}
                    size="xl"
                    ring
                />
                <div className="text-center">
                    <p className="text-sm font-semibold text-[var(--text-primary)] leading-tight">
                        {profile?.name ?? "Your Name"}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5 leading-tight">
                        {profile?.headline ?? "Add a headline"}
                    </p>
                </div>
                <Badge
                    variant={profile?.availableForWork ? "success" : "default"}
                    size="sm"
                    dot
                >
                    {profile?.availableForWork ? "Available" : "Unavailable"}
                </Badge>
            </div>

            {/* Nav */}
            <nav className="flex flex-col gap-1">
                {navItems.map((item) => {
                    const count = countMap[item.id](profile);
                    const isActive = active === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onChange(item.id)}
                            className={[
                                "flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 text-left w-full",
                                isActive
                                    ? "bg-[var(--primary-800)] text-[var(--text-inverse)]"
                                    : "text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]",
                            ].join(" ")}
                        >
                            <span className="flex items-center gap-2.5">
                                <span className={isActive ? "opacity-100" : "opacity-60"}>{item.icon}</span>
                                {item.label}
                            </span>
                            {count !== null && count > 0 && (
                                <span
                                    className={[
                                        "text-xs font-semibold px-1.5 py-0.5 rounded-full min-w-[20px] text-center leading-none",
                                        isActive
                                            ? "bg-white/20 text-white"
                                            : "bg-[var(--bg-tertiary)] text-[var(--text-muted)]",
                                    ].join(" ")}
                                >
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}