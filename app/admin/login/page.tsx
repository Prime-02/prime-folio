// app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores";
import { Button, Input } from "@/components/ui";
import { Eye, EyeOff } from "lucide-react";

export default function AdminLoginPage() {
    const router = useRouter();
    const { login, isAuthenticated, isLoading, error, clearError } = useAuthStore();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) router.replace("/admin");
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        const ok = await login(email, password);
        if (ok) router.replace("/admin");
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{ backgroundColor: "var(--bg-primary)" }}
        >
            {/* Background grid texture */}
            <div
                className="fixed inset-0 opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px),
                            linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                }}
            />

            {/* Login card */}
            <div className="relative w-full max-w-md">
                {/* Top accent line */}
                <div
                    className="absolute -top-px left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--text-primary), transparent)" }}
                />

                <div
                    className="rounded-2xl p-8 border"
                    style={{
                        backgroundColor: "var(--bg-secondary)",
                        borderColor: "var(--border-color)",
                    }}
                >
                    {/* Logo / wordmark */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: "var(--text-primary)" }}
                            >
                                <span
                                    className="text-sm font-bold tracking-tight"
                                    style={{ color: "var(--text-inverse)", fontFamily: "Montserrat, sans-serif" }}
                                >
                                    PF
                                </span>
                            </div>
                            <span
                                className="text-xl font-semibold tracking-tight"
                                style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
                            >
                                Prime Folio
                            </span>
                        </div>

                        <h1
                            className="text-2xl font-bold tracking-tight mb-1"
                            style={{ color: "var(--text-primary)", fontFamily: "Montserrat, sans-serif" }}
                        >
                            Admin Access
                        </h1>
                        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                            Sign in to manage your portfolio
                        </p>
                    </div>

                    {/* Error message */}
                    {error && (
                        <div
                            className="mb-6 px-4 py-3 rounded-lg border text-sm"
                            style={{
                                backgroundColor: "var(--error-50)",
                                borderColor: "var(--error-200)",
                                color: "var(--error-600)",
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Email */}
                        <Input
                            id="email"
                            type="email"
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            placeholder="admin@yourdomain.com"
                            inputSize="lg"
                        />

                        {/* Password */}
                        <Input
                            id="password"
                            type={showPass ? "text" : "password"}
                            label="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                            placeholder="••••••••"
                            inputSize="lg"
                            rightIcon={
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="p-1 transition-colors hover:text-[var(--text-primary)]"
                                    style={{ color: "var(--text-muted)" }}
                                    aria-label={showPass ? "Hide password" : "Show password"}
                                >
                                    {showPass ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </button>
                            }
                        />

                        {/* Submit */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            full
                            loading={isLoading}
                            disabled={isLoading || !email || !password}
                            className="mt-2"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Footer note */}
                    <p
                        className="text-center text-xs mt-8"
                        style={{ color: "var(--text-muted)" }}
                    >
                        Admin access only · Not a public page
                    </p>
                </div>

                {/* Bottom accent line */}
                <div
                    className="absolute -bottom-px left-0 right-0 h-px"
                    style={{ background: "linear-gradient(90deg, transparent, var(--border-color), transparent)" }}
                />
            </div>
        </div>
    );
}