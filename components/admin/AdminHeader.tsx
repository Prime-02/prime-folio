// components/admin/AdminHeader.tsx
"use client";

import { usePathname } from "next/navigation";
import { useUIStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import { Menu, ExternalLink, Sun, Moon } from "lucide-react";

const routeLabels: Record<string, string> = {
    "/admin": "Dashboard",
    "/admin/profile": "Profile",
    "/admin/projects": "Projects",
    "/admin/blog": "Blog",
    "/admin/testimonials": "Testimonials",
    "/admin/contact": "Messages",
};

export default function AdminHeader() {
    const pathname = usePathname();
    const { toggleMobileMenu, toggleTheme, theme } = useUIStore();

    const pageTitle = routeLabels[pathname] ?? "Admin";

    return (
        <header
            className="flex items-center justify-between px-6 h-16 border-b shrink-0"
            style={{
                backgroundColor: "var(--bg-secondary)",
                borderColor: "var(--border-light)",
            }}
        >
            {/* Left — mobile menu + page title */}
            <div className="flex items-center gap-4">
                {/* Mobile menu toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    icon
                    onClick={toggleMobileMenu}
                    className="lg:hidden"
                    aria-label="Toggle menu"
                >
                    <Menu className="w-5 h-5" />
                </Button>

                {/* Page title */}
                <div>
                    <h2
                        className="text-base font-semibold leading-tight"
                        style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
                    >
                        {pageTitle}
                    </h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        prime-folio.vercel.app
                    </p>
                </div>
            </div>

            {/* Right — actions */}
            <div className="flex items-center gap-2">
                {/* View site link */}
                <a
                    href="/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150"
                    style={{ color: "var(--text-muted)", backgroundColor: "transparent" }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "var(--bg-tertiary)";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                        (e.currentTarget as HTMLElement).style.color = "var(--text-muted)";
                    }}
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Site
                </a>

                {/* Divider */}
                <div className="w-px h-5 hidden sm:block" style={{ backgroundColor: "var(--border-color)" }} />

                {/* Theme toggle */}
                <Button
                    variant="ghost"
                    size="sm"
                    icon
                    onClick={toggleTheme}
                    aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
                >
                    {theme === "dark" ? (
                        <Sun className="w-4 h-4" />
                    ) : (
                        <Moon className="w-4 h-4" />
                    )}
                </Button>
            </div>
        </header>
    );
}