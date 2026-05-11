// components/admin/AdminSidebar.tsx
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useUIStore } from "@/lib/stores";
import { Button } from "@/components/ui";
import {
    LayoutDashboard,
    User,
    FolderKanban,
    FileText,
    MessageSquareQuote,
    Mail,
    LogOut
} from "lucide-react";

interface NavItem {
    label: string;
    href: string;
    icon: React.ReactNode;
    badge?: number;
}

const navItems: NavItem[] = [
    {
        label: "Dashboard",
        href: "/admin",
        icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
        label: "Profile",
        href: "/admin/profile",
        icon: <User className="w-5 h-5" />,
    },
    {
        label: "Projects",
        href: "/admin/projects",
        icon: <FolderKanban className="w-5 h-5" />,
    },
    {
        label: "Blog",
        href: "/admin/blog",
        icon: <FileText className="w-5 h-5" />,
    },
    {
        label: "Testimonials",
        href: "/admin/testimonials",
        icon: <MessageSquareQuote className="w-5 h-5" />,
    },
    {
        label: "Messages",
        href: "/admin/contact",
        icon: <Mail className="w-5 h-5" />,
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, email } = useAuthStore();
    const { isMobileMenuOpen, closeMobileMenu } = useUIStore();

    const handleLogout = () => {
        logout();
        router.replace("/admin/login");
    };

    const isActive = (href: string) =>
        href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

    return (
        <>
            {/* Mobile overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 lg:hidden"
                    style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                    onClick={closeMobileMenu}
                />
            )}

            {/* Sidebar */}
            <aside
                className={[
                    "fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 lg:static lg:translate-x-0",
                    isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
                ].join(" ")}
                style={{
                    backgroundColor: "var(--bg-secondary)",
                    borderColor: "var(--border-light)",
                }}
            >
                {/* Logo */}
                <div
                    className="flex items-center gap-3 px-6 h-16 border-b shrink-0"
                    style={{ borderColor: "var(--border-light)" }}
                >
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: "var(--text-primary)" }}
                    >
                        <span
                            className="text-xs font-bold"
                            style={{ color: "var(--text-inverse)", fontFamily: "Montserrat, sans-serif" }}
                        >
                            PF
                        </span>
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span
                            className="text-sm font-semibold leading-tight truncate"
                            style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
                        >
                            Prime Folio
                        </span>
                        <span className="text-xs leading-tight" style={{ color: "var(--text-muted)" }}>
                            Admin
                        </span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <p
                        className="px-3 mb-2 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Menu
                    </p>
                    <ul className="flex flex-col gap-0.5">
                        {navItems.map((item) => {
                            const active = isActive(item.href);
                            return (
                                <li key={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        full
                                        onClick={() => { router.push(item.href); closeMobileMenu(); }}
                                        className="justify-start gap-3 px-3 py-2.5 rounded-lg text-sm font-medium relative"
                                        style={{
                                            backgroundColor: active ? "var(--bg-hover)" : "transparent",
                                            color: active ? "var(--text-primary)" : "var(--text-muted)",
                                        }}
                                    >
                                        {/* Active indicator */}
                                        <span
                                            className="absolute left-0 w-0.5 h-6 rounded-r transition-opacity duration-150"
                                            style={{
                                                backgroundColor: "var(--text-primary)",
                                                opacity: active ? 1 : 0,
                                            }}
                                        />
                                        <span className="shrink-0">
                                            {item.icon}
                                        </span>
                                        <span className="flex-1 text-left">{item.label}</span>
                                        {item.badge !== undefined && item.badge > 0 && (
                                            <span
                                                className="ml-auto px-1.5 py-0.5 text-xs rounded-full leading-none"
                                                style={{
                                                    backgroundColor: "var(--error-500)",
                                                    color: "#fff",
                                                }}
                                            >
                                                {item.badge}
                                            </span>
                                        )}
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* User / logout */}
                <div
                    className="px-3 py-4 border-t shrink-0"
                    style={{ borderColor: "var(--border-light)" }}
                >
                    <div className="flex items-center gap-3 px-3 py-2 rounded-lg mb-1"
                        style={{ backgroundColor: "var(--bg-tertiary)" }}
                    >
                        <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                            style={{ backgroundColor: "var(--text-primary)", color: "var(--text-inverse)" }}
                        >
                            {email?.[0]?.toUpperCase() ?? "A"}
                        </div>
                        <span
                            className="text-xs truncate flex-1"
                            style={{ color: "var(--text-secondary)" }}
                        >
                            {email}
                        </span>
                    </div>
                    <Button
                        variant="danger"
                        size="sm"
                        full
                        onClick={handleLogout}
                        leftIcon={<LogOut className="w-4 h-4" />}
                    >
                        Sign out
                    </Button>
                </div>
            </aside>
        </>
    );
}