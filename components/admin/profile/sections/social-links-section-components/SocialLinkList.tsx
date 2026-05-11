// components/admin/profile/sections/social-links-section/SocialLinkList.tsx
"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { SocialLink } from "@/lib/types";
import { PLATFORMS, PLATFORM_COLORS } from "./constants";
import {
    FaGithub,
    FaLinkedin,
    FaTwitter,
    FaInstagram,
    FaYoutube,
    FaDribbble,
    FaBehance,
    FaWhatsapp,
} from "react-icons/fa";
import { Globe, Link, Mail } from "lucide-react";

interface SocialLinkListProps {
    socialLinks: SocialLink[];
    onEdit: (link: SocialLink) => void;
    onDelete: (link: SocialLink) => void;
}

function PlatformIcon({ platform }: { platform: string }) {
    const icons: Record<string, React.ReactNode> = {
        github: <FaGithub className="w-4 h-4" />,
        linkedin: <FaLinkedin className="w-4 h-4" />,
        twitter: <FaTwitter className="w-4 h-4" />,
        instagram: <FaInstagram className="w-4 h-4" />,
        youtube: <FaYoutube className="w-4 h-4" />,
        dribbble: <FaDribbble className="w-4 h-4" />,
        behance: <FaBehance className="w-4 h-4" />,
        whatsapp: <FaWhatsapp className="w-4 h-4" />,
        gmail: <Mail className="w-4 h-4" />,
        website: <Globe className="w-4 h-4" />,
        other: <Link className="w-4 h-4" />,
    };

    const icon = icons[platform] ?? icons.other;
    const colorClass = PLATFORM_COLORS[platform] ?? PLATFORM_COLORS.other;

    return (
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${colorClass}`}>
            {icon}
        </div>
    );
}

function getPlatformLabel(platform: string) {
    return PLATFORMS.find((p) => p.value === platform)?.label ?? platform;
}

export default function SocialLinkList({ socialLinks, onEdit, onDelete }: SocialLinkListProps) {
    if (socialLinks.length === 0) return null;

    return (
        <div className="flex flex-col gap-2">
            {socialLinks.map((link) => (
                <div
                    key={link.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-[var(--border-light)] bg-[var(--bg-secondary)] group"
                >
                    <PlatformIcon platform={link.platform} />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)]">
                            {getPlatformLabel(link.platform)}
                        </p>
                        <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-[var(--text-muted)] hover:text-[var(--primary-600)] transition-colors truncate block max-w-[280px]"
                        >
                            {link.url}
                        </a>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => onEdit(link)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                            <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => onDelete(link)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--error-500)] hover:bg-[var(--error-50)] transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}