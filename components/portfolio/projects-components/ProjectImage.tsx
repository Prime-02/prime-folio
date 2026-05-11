import { motion } from "framer-motion";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

interface ProjectImageProps {
    coverImage?: string | null;
    title: string;
}

export function ProjectImage({ coverImage, title }: ProjectImageProps) {
    return (
        <motion.div
            className="relative h-48 overflow-hidden"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
        >
            {coverImage ? (
                <CloudinaryImage
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "var(--bg-tertiary)" }}
                >
                    <i
                        className="ti ti-layout-grid text-4xl"
                        style={{ color: "var(--text-muted)" }}
                        aria-hidden="true"
                    />
                </div>
            )}

            {/* Gradient overlay */}
            <div
                className="absolute inset-0"
                style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.3) 0%, transparent 50%)",
                }}
            />
        </motion.div>
    );
}