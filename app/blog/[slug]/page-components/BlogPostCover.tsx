// app/blog/[slug]/page-components/BlogPostCover.tsx
import { motion, type Variants } from "framer-motion";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
    },
};

interface BlogPostCoverProps {
    coverImage: string;
    title: string;
}

export function BlogPostCover({ coverImage, title }: BlogPostCoverProps) {
    return (
        <section className="w-full pb-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6">
                <motion.div
                    className="rounded-xl overflow-hidden"
                    variants={fadeInUp}
                >
                    <CloudinaryImage
                        src={coverImage}
                        alt={title}
                        className="w-full h-auto max-h-[500px] object-cover"
                    />
                </motion.div>
            </div>
        </section>
    );
}