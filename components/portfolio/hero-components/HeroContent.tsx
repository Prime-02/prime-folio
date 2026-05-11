import { motion } from "framer-motion";
import { MetaItem } from "./MetaItem";
import { SocialButton } from "./SocialButton";
import { fadeInUp, staggerContainer } from "./animations";

interface SocialLink {
    id?: string;
    platform: string;
    url: string;
    order?: number;
    createdAt: Date;
}

interface HeroContentProps {
    name: string;
    headline?: string;
    tagline?: string;
    resumeUrl?: string;
    resumeLabel?: string;
    location?: string;
    timezoneLabel?: string | null;
    socialLinks: SocialLink[];
}

export function HeroContent({
    name,
    headline,
    tagline,
    resumeUrl,
    resumeLabel,
    location,
    timezoneLabel,
    socialLinks,
}: HeroContentProps) {
    const hasMetaInfo = location || timezoneLabel;
    const hasSocialLinks = socialLinks && socialLinks.length > 0;

    return (
        <motion.div
            className="flex flex-col items-center text-center md:items-start md:text-left w-full"
            variants={staggerContainer}
        >
            {/* Eyebrow */}
            <motion.p
                className="text-xs tracking-widest uppercase font-medium mb-3"
                style={{ color: "var(--text-muted)" }}
                variants={fadeInUp}
            >
                Portfolio
            </motion.p>

            {/* Name */}
            <motion.h1
                className="font-Montserrat font-medium leading-tight mb-2"
                style={{
                    fontSize: "clamp(2rem, 5vw, 3.25rem)",
                    color: "var(--text-primary)",
                }}
                variants={fadeInUp}
            >
                {name}
            </motion.h1>

            {/* Headline */}
            {headline && (
                <motion.p
                    className="text-lg sm:text-xl font-normal mb-4"
                    style={{ color: "var(--text-secondary)" }}
                    variants={fadeInUp}
                >
                    {headline}
                </motion.p>
            )}

            {/* Divider */}
            <motion.div
                className="w-10 h-0.5 mb-4 rounded-full flex-shrink-0"
                style={{ background: "var(--border-color)" }}
                variants={fadeInUp}
            />

            {/* Tagline */}
            {tagline && (
                <motion.p
                    className="text-sm leading-relaxed mb-5 max-w-[480px]"
                    style={{ color: "var(--text-secondary)" }}
                    variants={fadeInUp}
                >
                    {tagline}
                </motion.p>
            )}

            {/* Meta row */}
            {hasMetaInfo && (
                <motion.div
                    className="flex flex-wrap justify-center md:justify-start items-center gap-3 mb-6"
                    variants={fadeInUp}
                >
                    {location && <MetaItem icon="ti-map-pin" label={location} />}
                    {location && timezoneLabel && (
                        <span style={{ color: "var(--border-color)" }}>·</span>
                    )}
                    {timezoneLabel && <MetaItem icon="ti-clock" label={timezoneLabel} />}
                </motion.div>
            )}

            {/* CTA buttons */}
            <motion.div
                className="flex flex-wrap justify-center md:justify-start gap-2.5 mb-7 w-full"
                variants={staggerContainer}
            >
                <motion.a
                    href="#projects"
                    className="btn btn-primary btn-md"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="ti ti-layout-grid" aria-hidden="true" />
                    View projects
                </motion.a>
                <motion.a
                    href="#contact"
                    className="btn btn-secondary btn-md"
                    variants={fadeInUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="ti ti-mail" aria-hidden="true" />
                    Get in touch
                </motion.a>
                {resumeUrl && (
                    <motion.a
                        href={resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline btn-md"
                        variants={fadeInUp}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <i className="ti ti-download" aria-hidden="true" />
                        {resumeLabel ?? "Download CV"}
                    </motion.a>
                )}
            </motion.div>

            {/* Social links */}
            {hasSocialLinks && (
                <motion.div
                    className="flex flex-wrap justify-center md:justify-start items-center gap-2"
                    variants={staggerContainer}
                >
                    <motion.span
                        className="text-xs mr-1"
                        style={{ color: "var(--text-muted)" }}
                        variants={fadeInUp}
                    >
                        Find me on
                    </motion.span>
                    {socialLinks.map((link, index) => (
                        <SocialButton
                            key={link.id ?? `social-${index}`}
                            platform={link.platform}
                            url={link.url}
                        />
                    ))}
                </motion.div>
            )}
        </motion.div>
    );
}