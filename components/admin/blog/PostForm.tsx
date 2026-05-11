// components/admin/blog/PostForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { usePostStore } from "@/lib/stores/usePostStore";
import { useAuthStore } from "@/lib/stores";
import type { Post } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUpload from "@/components/ui/ImageUpload";
import Badge from "@/components/ui/Badge";
import MarkdownEditor from "@/components/ui/markdown/MarkdownEditor";

interface PostFormProps {
    post?: Post | null;
    isEditing?: boolean;
}

const FIELD_LIMITS = {
    title: 160,
    summary: 400,
    tag: 50,
} as const;

export default function PostForm({ post, isEditing = false }: PostFormProps) {
    const router = useRouter();
    const token = useAuthStore((s) => s.token);
    const { createPost, updatePost, isSubmitting, error } = usePostStore();

    const [form, setForm] = useState({
        title: "",
        slug: "",
        summary: "",
        content: "",
        coverImage: null as string | null,
        tags: [] as string[],
        published: false,
        featured: false,
        publishedAt: null as string | null,
    });

    const [tagInput, setTagInput] = useState("");

    // Sync when editing
    useEffect(() => {
        if (post && isEditing) {
            setForm({
                title: post.title ?? "",
                slug: post.slug ?? "",
                summary: post.summary ?? "",
                content: post.content ?? "",
                coverImage: post.coverImage ?? null,
                tags: post.tags ?? [],
                published: post.published ?? false,
                featured: post.featured ?? false,
                publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
            });
        }
    }, [post, isEditing]);

    const set = (key: string, val: any) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    // Auto-generate slug from title (create only)
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        set("title", title);
        if (!isEditing) {
            set(
                "slug",
                title
                    .toLowerCase()
                    .replace(/[^a-z0-9\s-]/g, "")
                    .replace(/\s+/g, "-")
                    .replace(/-+/g, "-")
                    .trim()
            );
        }
    };

    const handleAddTag = () => {
        const tag = tagInput.trim().toLowerCase();
        if (tag && !form.tags.includes(tag) && form.tags.length < 10) {
            set("tags", [...form.tags, tag]);
            setTagInput("");
        }
    };

    const handleRemoveTag = (tag: string) => {
        set("tags", form.tags.filter((t) => t !== tag));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTag();
        }
    };

    const handleSubmit = async () => {
        if (!token || !form.title || !form.summary || !form.content) return;

        const { publishedAt, ...rest } = form;

        const data = {
            ...rest,
            publishedAt: form.publishedAt ? new Date(form.publishedAt) : undefined, // undefined = omit, not null
        };

        let success: boolean;
        if (isEditing && post) {
            success = await updatePost(token, post.slug, data);
        } else {
            success = await createPost(token, data);
        }

        if (success) router.push("/admin/blog");
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            {/* Cover Image */}
            <Card>
                <CardHeader
                    title="Cover Image"
                    description="The main image shown in the post card and header"
                />
                <CardBody>
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        <ImageUpload
                            token={token ?? ""}
                            folder="blog"
                            uploadKey="post-cover"
                            value={form.coverImage}
                            onChange={(id) => set("coverImage", id)}
                            aspectRatio="banner"
                            className="w-full sm:w-72 h-40 sm:h-48 shrink-0"
                        />
                        <div className="flex flex-col gap-1.5">
                            <p className="text-sm font-medium text-[var(--text-secondary)]">
                                Upload guidelines
                            </p>
                            <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                                <li>Recommended: 1200×630px (16:9 ratio)</li>
                                <li>Formats: JPG, PNG, WebP</li>
                            </ul>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Basic Information */}
            <Card>
                <CardHeader
                    title="Basic Information"
                    description="Core details about your post"
                />
                <CardBody>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Post Title"
                            required
                            value={form.title}
                            onChange={handleTitleChange}
                            placeholder="e.g. How I built my portfolio"
                            maxLength={FIELD_LIMITS.title}
                            hint={`${form.title.length}/${FIELD_LIMITS.title} characters`}
                        />
                        <Input
                            label="Slug"
                            required
                            value={form.slug}
                            onChange={(e) => set("slug", e.target.value)}
                            placeholder="how-i-built-my-portfolio"
                            hint="URL-friendly identifier (auto-generated from title)"
                            disabled={true} // lock slug on edit
                        />
                        <Textarea
                            label="Summary"
                            required
                            value={form.summary}
                            onChange={(e) => set("summary", e.target.value)}
                            placeholder="A short description shown in post cards and meta tags"
                            rows={2}
                            maxLength={FIELD_LIMITS.summary}
                            hint={`${form.summary.length}/${FIELD_LIMITS.summary} characters`}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Content */}
            <Card>
                <CardHeader
                    title="Content"
                    description="The full body of your post. Supports markdown."
                />
                <CardBody>
                    <MarkdownEditor
                        label="Post Content"
                        value={form.content}
                        onChange={(val) => set("content", val)}
                        placeholder="Write your post here. Markdown is supported."
                        uploadToken={token ?? ""}
                        uploadFolder="blog"
                        showCopy={false}
                        showDownload={false}
                        enableImageUpload={!!token}
                    />
                </CardBody>
            </Card>

            {/* Tags */}
            <Card>
                <CardHeader
                    title="Tags"
                    description="Categorize your post with relevant tags"
                />
                <CardBody>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                placeholder="Add a tag..."
                                maxLength={FIELD_LIMITS.tag}
                                className="flex-1"
                            />
                            <Button
                                variant="secondary"
                                size="md"
                                onClick={handleAddTag}
                                leftIcon={<Plus size={16} />}
                                disabled={!tagInput.trim()}
                            >
                                Add
                            </Button>
                        </div>
                        {form.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {form.tags.map((tag) => (
                                    <Badge key={tag} variant="default" size="md">
                                        <span className="flex items-center gap-1">
                                            {tag}
                                            <button
                                                onClick={() => handleRemoveTag(tag)}
                                                className="ml-1 hover:text-[var(--error-600)] transition-colors"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    </Badge>
                                ))}
                            </div>
                        )}
                        <p className="text-xs text-[var(--text-muted)]">
                            Press Enter to add a tag. Max 10 tags.
                        </p>
                    </div>
                </CardBody>
            </Card>

            {/* Settings */}
            <Card>
                <CardHeader
                    title="Settings"
                    description="Control visibility and display options"
                />
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <Toggle
                            checked={form.published}
                            onChange={(v) => set("published", v)}
                            label="Published"
                            hint="Make this post visible on your public blog"
                            size="md"
                        />
                        <Toggle
                            checked={form.featured}
                            onChange={(v) => set("featured", v)}
                            label="Featured"
                            hint="Highlight this post on your blog homepage"
                            size="md"
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Error */}
            {error && (
                <div className="px-4 py-3 rounded-xl border border-[var(--error-200)] bg-[var(--error-50)] text-sm text-[var(--error-700)]">
                    {error}
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 sm:gap-4">
                <Button
                    variant="secondary"
                    size="md"
                    onClick={() => router.back()}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    size="md"
                    loading={isSubmitting}
                    onClick={handleSubmit}
                    disabled={!form.title || !form.summary || !form.content}
                    className="w-full sm:w-auto"
                >
                    {isEditing ? "Save Changes" : "Publish Post"}
                </Button>
            </div>
        </div>
    );
}