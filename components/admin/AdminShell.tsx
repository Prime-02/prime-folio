// components/admin/AdminShell.tsx
"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { PageLoader } from "@/components/ui";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export default function AdminShell({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { isAuthenticated, isLoading, _hasHydrated } = useAuthStore();

    const isPublicPath = PUBLIC_ADMIN_PATHS.includes(pathname);

    useEffect(() => {
        // Wait for Zustand to rehydrate from localStorage before acting.
        // Without this guard, isAuthenticated is always false on first render,
        // causing router.replace("/admin/login") to fire and clobber the URL
        // before the persisted token is even read.
        if (!_hasHydrated) return;

        if (!isLoading && !isAuthenticated && !isPublicPath) {
            router.replace("/admin/login");
        }
    }, [isAuthenticated, isLoading, isPublicPath, router, _hasHydrated]);

    // Show login page without shell chrome
    if (isPublicPath) return <>{children}</>;

    // Sit on the loader until hydration is done AND auth is confirmed.
    // Previously this was (!isAuthenticated) only — which is true during
    // hydration even for logged-in users, making every deep-link redirect.
    if (!_hasHydrated || !isAuthenticated) return <PageLoader message="Checking access…" />;

    return (
        <div
            className="flex h-screen overflow-hidden"
            style={{ backgroundColor: "var(--bg-primary)" }}
        >
            {/* Sidebar */}
            <AdminSidebar />

            {/* Main area */}
            <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                <AdminHeader />

                {/* Page content */}
                <main
                    className="flex-1 overflow-y-auto p-6"
                    style={{ backgroundColor: "var(--bg-primary)" }}
                >
                    {children}
                </main>
            </div>
        </div>
    );
}