import { motion } from "framer-motion";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

interface CompanyLogoProps {
    logo?: string | null;
    company: string;
}

export function CompanyLogo({ logo, company }: CompanyLogoProps) {
    return (
        <motion.div
            className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
            style={{
                background: "var(--bg-primary)",
                border: "0.5px solid var(--border-light)",
            }}
            whileHover={{ scale: 1.1, rotate: -5 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            {logo ? (
                <CloudinaryImage
                    src={logo}
                    alt={company}
                    className="w-full h-full object-contain p-1"
                />
            ) : (
                <i
                    className="ti ti-building text-lg"
                    style={{ color: "var(--text-muted)" }}
                    aria-hidden="true"
                />
            )}
        </motion.div>
    );
}