import { motion } from "framer-motion";
import { staggerContainer, fadeInUp } from "./animations";

interface ContactInfoItem {
    icon: string;
    label: string;
    value: string;
    href?: string;
}

interface ContactInfoProps {
    email?: string;
    location?: string;
    timezone?: string;
    socialLinks?: Array<{
        platform: string;
        url: string;
    }>;
}

export function ContactInfo({ email, location, timezone, socialLinks }: ContactInfoProps) {
    const items: ContactInfoItem[] = [];

    if (email) {
        items.push({
            icon: "ti-mail",
            label: "Email",
            value: email,
            href: `mailto:${email}`,
        });
    }

    if (location) {
        items.push({
            icon: "ti-map-pin",
            label: "Location",
            value: location,
        });
    }

    if (timezone) {
        items.push({
            icon: "ti-clock",
            label: "Timezone",
            value: timezone,
        });
    }

    return (
        <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
        >
            {/* Contact details */}
            <div className="space-y-4 mb-8">
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        className="flex items-start gap-3"
                        variants={fadeInUp}
                    >
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                                background: "var(--bg-secondary)",
                                border: "0.5px solid var(--border-light)",
                            }}
                        >
                            <i
                                className={`ti ${item.icon} text-lg`}
                                style={{ color: "var(--text-secondary)" }}
                                aria-hidden="true"
                            />
                        </div>
                        <div>
                            <p className="text-[10px] uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>
                                {item.label}
                            </p>
                            {item.href ? (
                                <a
                                    href={item.href}
                                    className="text-sm font-medium hover:underline"
                                    style={{ color: "var(--text-primary)" }}
                                >
                                    {item.value}
                                </a>
                            ) : (
                                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                                    {item.value}
                                </p>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Availability indicator */}
            <motion.div
                className="rounded-xl p-5 mb-8"
                style={{
                    background: "var(--success-50)",
                    border: "0.5px solid var(--success-500)",
                }}
                variants={fadeInUp}
            >
                <div className="flex items-center gap-3 mb-2">
                    <motion.span
                        className="w-2 h-2 rounded-full"
                        style={{ background: "var(--success-500)" }}
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <span className="text-sm font-medium" style={{ color: "var(--success-700)" }}>
                        Available for new opportunities
                    </span>
                </div>
                <p className="text-xs" style={{ color: "var(--success-700)", opacity: 0.85 }}>
                    I&apos;m currently open to freelance work and interesting projects.
                    Feel free to reach out!
                </p>
            </motion.div>

            {/* Social links */}
            {socialLinks && socialLinks.length > 0 && (
                <motion.div variants={fadeInUp}>
                    <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>
                        FIND ME ON
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {socialLinks.map((link, index) => (
                            <motion.a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                                style={{
                                    background: "var(--bg-secondary)",
                                    border: "0.5px solid var(--border-light)",
                                }}
                                whileHover={{ scale: 1.1, background: "var(--bg-tertiary)" }}
                                whileTap={{ scale: 0.95 }}
                                title={link.platform}
                            >
                                <i
                                    className={`ti ti-brand-${link.platform.toLowerCase()} text-lg`}
                                    style={{ color: "var(--text-secondary)" }}
                                    aria-hidden="true"
                                />
                            </motion.a>
                        ))}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}