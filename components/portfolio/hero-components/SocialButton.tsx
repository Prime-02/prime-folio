import { motion } from "framer-motion";
import { PLATFORMS } from "../../admin/profile/sections/social-links-section-components/constants";
import { getPlatformIcon } from "./constants";
import { fadeInUp } from "./animations";

interface SocialButtonProps {
    platform: string;
    url: string;
}

export function SocialButton({ platform, url }: SocialButtonProps) {
    const iconClass = getPlatformIcon(platform);
    const label =
        PLATFORMS.find((p) => p.value === platform)?.label ??
        platform.charAt(0).toUpperCase() + platform.slice(1);

    return (
        <motion.a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${label} profile`}
            className="btn btn-secondary btn-icon btn-sm"
            title={label}
            variants={fadeInUp}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
        >
            <i className={`ti ${iconClass}`} aria-hidden="true" />
        </motion.a>
    );
}