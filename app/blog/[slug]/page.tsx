// app/blog/[slug]/page.tsx
"use client";

import { usePostStore } from "@/lib/stores";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { motion, type Variants } from "framer-motion";
import {
    BlogPostHero,
    BlogPostCover,
    BlogPostContent,
    BlogPostNavigation,
    BlogPostError,
    BlogPostSkeleton,
} from "./page-components";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

function getReadingTime(content: string): string {
    const wordsPerMinute = 200;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
}

export default function BlogPostPage() {
    const { slug } = useParams<{ slug: string }>();
    const {
        activePost,
        fetchPostBySlug,
        isLoading,
        error,
        clearActivePost,
    } = usePostStore();

    useEffect(() => {
        if (slug) {
            fetchPostBySlug(slug);
        }
        return () => clearActivePost();
    }, [slug, fetchPostBySlug, clearActivePost]);

    if (isLoading) return <BlogPostSkeleton />;

    if (error || !activePost) {
        return <BlogPostError error={error} />;
    }

    const post = activePost;
    const readingTime = post.content ? getReadingTime(post.content) : null;

    return (
        <motion.div
            className="min-h-screen"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* Hero Section */}
            <BlogPostHero
                title={post.title}
                summary={post.summary}
                tags={post.tags}
                featured={post.featured}
                publishedAt={post.publishedAt}
                createdAt={post.createdAt}
                readingTime={readingTime}
            />

            {/* Cover Image */}
            {post.coverImage && (
                <BlogPostCover
                    coverImage={post.coverImage}
                    title={post.title}
                />
            )}

            {/* Content Section */}
            {post.content && (
                <BlogPostContent content={post.content} />
            )}

            {/* Navigation */}
            <BlogPostNavigation
                publishedAt={post.publishedAt}
                createdAt={post.createdAt}
                readingTime={readingTime}
            />
        </motion.div>
    );
}