// app/admin/layout.tsx
// Root layout for all /admin/* pages

import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";

export const metadata: Metadata = {
    title: { template: "%s · Prime Folio Admin", default: "Prime Folio Admin" },
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return <AdminShell>{children}</AdminShell>;
}