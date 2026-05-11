import { motion } from "framer-motion";
import Link from "next/link";
import { BlogImage } from "./BlogImage";
import { BlogTags } from "./BlogTags";
import { scaleIn } from "./animations";

interface Post {
    id: string;
    title: string;
    slug: string;
    summary: string;
    content: string;
    coverImage?: string | null;
    tags: string[];
    published: boolean;
    featured: boolean;
    publishedAt?: Date | string | null;
    createdAt: Date;
    updatedAt: Date;
}

interface BlogCardProps {
    post: Post;
    index: number;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

function getReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

export function BlogCard({ post, index }: BlogCardProps) {
    const publishedDate = post.publishedAt ?? post.createdAt;
    const readingTime = post.content ? getReadingTime(post.content) : null;

    return (
        <motion.div
            variants={scaleIn}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.2 }}
        >
            <Link
                href={`/blog/${post.slug}`}
                className="block rounded-xl overflow-hidden group focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                    background: "var(--bg-secondary)",
                    border: "0.5px solid var(--border-light)",
                }}
            >
                {/* Cover Image */}
                <BlogImage
                    coverImage={post.coverImage}
                    title={post.title}
                />

                {/* Content */}
                <div className="p-5">
                    {/* Tags */}
                    <div className="mb-3">
                        <BlogTags tags={post.tags} limit={2} />
                    </div>

                    {/* Title */}
                    <h3
                        className="text-base font-medium mb-2 group-hover:underline line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {post.title}
                    </h3>

                    {/* Summary */}
                    <p
                        className="text-xs leading-relaxed mb-4 line-clamp-2"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        {post.summary}
                    </p>

                    {/* Meta info */}
                    <div
                        className="flex items-center justify-between text-[10px]"
                        style={{ color: "var(--text-muted)" }}
                    >
                        <div className="flex items-center gap-2">
                            <i className="ti ti-calendar text-xs" aria-hidden="true" />
                            <span>{formatDate(publishedDate)}</span>
                        </div>
                        {readingTime && (
                            <div className="flex items-center gap-2">
                                <i className="ti ti-clock text-xs" aria-hidden="true" />
                                <span>{readingTime}</span>
                            </div>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}