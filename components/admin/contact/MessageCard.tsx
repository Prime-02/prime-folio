"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Mail, MailCheck, Archive, Trash2, ChevronDown } from "lucide-react";
import type { ContactMessage, MessageStatus } from "@/lib/types";
import { CgMailForward } from "react-icons/cg";

interface MessageCardProps {
    message: ContactMessage;
    onUpdateStatus: (id: string, status: MessageStatus) => void;
    onDelete: (id: string) => void;
    isUpdating: boolean;
}

function formatDate(date: Date | string): string {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return d.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: d.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
}

export default function MessageCard({
    message,
    onUpdateStatus,
    onDelete,
    isUpdating,
}: MessageCardProps) {
    const [isExpanded, setIsExpanded] = useState(message.status === "UNREAD");

    const handleExpand = () => {
        setIsExpanded(!isExpanded);

        // Auto-mark as read when expanding
        if (message.status === "UNREAD") {
            onUpdateStatus(message.id, "READ");
        }
    };

    const statusConfig: Record<MessageStatus, { label: string; variant: "warning" | "info" | "success" | "default" }> = {
        UNREAD: { label: "Unread", variant: "warning" },
        READ: { label: "Read", variant: "info" },
        REPLIED: { label: "Replied", variant: "success" },
        ARCHIVED: { label: "Archived", variant: "default" },
    };

    const status = statusConfig[message.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`rounded-xl overflow-hidden transition-all duration-200 ${message.status === "UNREAD" ? "ring-1 ring-[var(--primary-500)]" : ""
                }`}
            style={{
                background: "var(--bg-secondary)",
                border: "0.5px solid var(--border-light)",
            }}
        >
            {/* Header - Always visible */}
            <button
                onClick={handleExpand}
                className="w-full p-4 sm:p-5 text-left hover:bg-[var(--bg-tertiary)]/50 transition-colors"
            >
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                        {/* Avatar */}
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 text-sm font-medium"
                            style={{
                                background: "var(--bg-primary)",
                                color: "var(--text-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                        >
                            {message.name
                                .split(" ")
                                .slice(0, 2)
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <p
                                    className={`text-sm truncate ${message.status === "UNREAD" ? "font-semibold" : "font-medium"
                                        }`}
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {message.name}
                                </p>
                                <Badge variant={status.variant} size="sm" dot>
                                    {status.label}
                                </Badge>
                            </div>
                            <p
                                className="text-sm truncate"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {message.subject || message.message}
                            </p>
                            <div className="flex items-center gap-3 mt-1.5">
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {message.email}
                                </span>
                                <span
                                    className="text-xs"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    {formatDate(message.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                        {message.status === "UNREAD" && (
                            <div className="w-2 h-2 rounded-full" style={{ background: "var(--primary-500)" }} />
                        )}
                        <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <ChevronDown size={16} style={{ color: "var(--text-muted)" }} />
                        </motion.div>
                    </div>
                </div>
            </button>

            {/* Expanded content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div
                            className="px-4 sm:px-5 pb-4 sm:pb-5 border-t"
                            style={{ borderColor: "var(--border-light)" }}
                        >
                            {/* Subject */}
                            {message.subject && (
                                <div className="pt-4 mb-3">
                                    <p
                                        className="text-xs mb-1"
                                        style={{ color: "var(--text-muted)" }}
                                    >
                                        SUBJECT
                                    </p>
                                    <p
                                        className="text-sm font-medium"
                                        style={{ color: "var(--text-primary)" }}
                                    >
                                        {message.subject}
                                    </p>
                                </div>
                            )}

                            {/* Message body */}
                            <div className="mb-4">
                                <p
                                    className="text-xs mb-2"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    MESSAGE
                                </p>
                                <p
                                    className="text-sm leading-relaxed whitespace-pre-wrap"
                                    style={{ color: "var(--text-secondary)" }}
                                >
                                    {message.message}
                                </p>
                            </div>

                            {/* Contact info */}
                            <div
                                className="rounded-lg p-3 mb-4"
                                style={{
                                    background: "var(--bg-primary)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                            >
                                <p
                                    className="text-xs mb-2"
                                    style={{ color: "var(--text-muted)" }}
                                >
                                    CONTACT INFO
                                </p>
                                <div className="space-y-1">
                                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                        <span style={{ color: "var(--text-muted)" }}>Name:</span>{" "}
                                        {message.name}
                                    </p>
                                    <p className="text-sm" style={{ color: "var(--text-primary)" }}>
                                        <span style={{ color: "var(--text-muted)" }}>Email:</span>{" "}
                                        <a
                                            href={`mailto:${message.email}`}
                                            className="hover:underline"
                                            style={{ color: "var(--primary-500)" }}
                                        >
                                            {message.email}
                                        </a>
                                    </p>
                                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                                        Received: {new Date(message.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border-light)" }}>
                                {message.status !== "READ" && message.status !== "REPLIED" && (
                                    <Button
                                        variant="info"
                                        size="xs"
                                        onClick={() => onUpdateStatus(message.id, "READ")}
                                        leftIcon={<MailCheck size={14} />}
                                        disabled={isUpdating}
                                    >
                                        Mark Read
                                    </Button>
                                )}
                                {message.status !== "REPLIED" && (
                                    <Button
                                        variant="success"
                                        size="xs"
                                        onClick={() => onUpdateStatus(message.id, "REPLIED")}
                                        leftIcon={<CgMailForward size={14} />}
                                        disabled={isUpdating}
                                    >
                                        Mark Replied
                                    </Button>
                                )}
                                {message.status !== "ARCHIVED" && (
                                    <Button
                                        variant="outline"
                                        size="xs"
                                        onClick={() => onUpdateStatus(message.id, "ARCHIVED")}
                                        leftIcon={<Archive size={14} />}
                                        disabled={isUpdating}
                                    >
                                        Archive
                                    </Button>
                                )}
                                <div className="flex-1" />
                                <a
                                    href={`mailto:${message.email}?subject=Re: ${message.subject || "Your message"}`}
                                    className="btn btn-primary btn-xs"
                                >
                                    <CgMailForward size={14} />
                                    Reply via Email
                                </a>
                                <Button
                                    variant="danger"
                                    size="xs"
                                    onClick={() => onDelete(message.id)}
                                    leftIcon={<Trash2 size={14} />}
                                    disabled={isUpdating}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}