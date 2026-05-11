import { motion } from "framer-motion";

interface BlogTagsProps {
    tags: string[];
    limit?: number;
}

export function BlogTags({ tags, limit = 2 }: BlogTagsProps) {
    const displayTags = tags.slice(0, limit);
    const remaining = tags.length - limit;

    return (
        <div className="flex flex-wrap gap-1.5">
            {displayTags.map((tag, index) => (
                <motion.span
                    key={tag}
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                        background: "var(--bg-primary)",
                        color: "var(--text-muted)",
                        border: "0.5px solid var(--border-light)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                >
                    {tag}
                </motion.span>
            ))}
            {remaining > 0 && (
                <motion.span
                    className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                        background: "var(--bg-primary)",
                        color: "var(--text-muted)",
                        border: "0.5px solid var(--border-light)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: displayTags.length * 0.05 }}
                >
                    +{remaining}
                </motion.span>
            )}
        </div>
    );
}