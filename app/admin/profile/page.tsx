// app/admin/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { SectionLoader } from "@/components/ui/Spinner";
import { Breadcrumb } from "@/components/ui/Misc";
import CoreInfoSection from "@/components/admin/profile/sections/CoreInfoSection";
import SkillsSection from "@/components/admin/profile/sections/SkillsSection";
import ExperienceSection from "@/components/admin/profile/sections/ExperienceSection";
import EducationSection from "@/components/admin/profile/sections/EducationSection";
import SocialLinksSection from "@/components/admin/profile/sections/SocialLinksSection";
import ProfileSidebar, { ProfileSection } from "@/components/admin/profile/ProdileSidebar";

const SECTION_TITLES: Record<ProfileSection, { title: string; description: string }> = {
    core: {
        title: "Core Information",
        description: "Your public-facing identity — name, photo, bio, and availability",
    },
    skills: {
        title: "Skills",
        description: "Technical and professional skills grouped by category",
    },
    experience: {
        title: "Work Experience",
        description: "Your professional history and career journey",
    },
    education: {
        title: "Education",
        description: "Academic qualifications and institutions",
    },
    social: {
        title: "Social Links",
        description: "External profiles and websites linked from your portfolio",
    },
};

export default function AdminProfilePage() {
    const [activeSection, setActiveSection] = useState<ProfileSection>("core");
    const { profile, isLoading, error, fetchProfile } = useProfileStore();

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const meta = SECTION_TITLES[activeSection];

    return (
        <div className="min-h-screen h-auto bg-[var(--bg-primary)]">
            <div className="max-w-6xl h-full mx-auto px-4 sm:px-6 py-6 sm:py-8">

                {/* Page Header */}
                <div className="mb-6 sm:mb-8">
                    <Breadcrumb
                        items={[
                            { label: "Admin", href: "/admin" },
                            { label: "Profile" },
                        ]}
                        className="mb-3"
                    />
                    <h1 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                        Profile
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        Manage your public portfolio profile
                    </p>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="mb-6 px-4 py-3 rounded-xl border border-[var(--error-200)] bg-[var(--error-50)] text-sm text-[var(--error-700)]">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {isLoading ? (
                    <SectionLoader message="Loading profile…" />
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        {/* Sidebar */}
                        <ProfileSidebar
                            active={activeSection}
                            onChange={setActiveSection}
                        />

                        {/* Content panel */}
                        <main className="flex-1 min-w-0 w-full">
                            {/* Section heading */}
                            <div className="mb-4 sm:mb-6">
                                <h2 className="text-base sm:text-lg font-semibold text-[var(--text-primary)]">
                                    {meta.title}
                                </h2>
                                <p className="text-sm text-[var(--text-muted)] mt-0.5">
                                    {meta.description}
                                </p>
                            </div>

                            {/* Section content */}
                            {activeSection === "core" && <CoreInfoSection />}
                            {activeSection === "skills" && <SkillsSection />}
                            {activeSection === "experience" && <ExperienceSection />}
                            {activeSection === "education" && <EducationSection />}
                            {activeSection === "social" && <SocialLinksSection />}
                        </main>

                    </div>
                )}
            </div>
        </div>
    );
}