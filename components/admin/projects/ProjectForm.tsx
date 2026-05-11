// components/admin/projects/ProjectForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, X, Plus } from "lucide-react";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { useAuthStore } from "@/lib/stores";
import type { Project } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUpload from "@/components/ui/ImageUpload";
import Badge from "@/components/ui/Badge";
import { BsGithub } from "react-icons/bs";
import MarkdownEditor from "@/components/ui/markdown/MarkdownEditor";

interface ProjectFormProps {
    project?: Project | null;
    isEditing?: boolean;
}

const FIELD_LIMITS = {
    title: 200,
    summary: 300,
    tag: 50,
} as const;

export default function ProjectForm({ project, isEditing = false }: ProjectFormProps) {
    const router = useRouter();
    const token = useAuthStore((s) => s.token);
    const { createProject, updateProject, isSubmitting, error } = useProjectStore();

    const [form, setForm] = useState({
        title: "",
        slug: "",
        summary: "",
        description: "",
        coverImage: null as string | null,
        liveUrl: "",
        repoUrl: "",
        tags: [] as string[],
        published: false,
        featured: false,
        order: 0,
    });

    const [tagInput, setTagInput] = useState("");

    // Sync project data when editing
    useEffect(() => {
        if (project && isEditing) {
            setForm({
                title: project.title ?? "",
                slug: project.slug ?? "",
                summary: project.summary ?? "",
                description: project.description ?? "",
                coverImage: project.coverImage ?? null,
                liveUrl: project.liveUrl ?? "",
                repoUrl: project.repoUrl ?? "",
                tags: project.tags ?? [],
                published: project.published ?? false,
                featured: project.featured ?? false,
                order: project.order ?? 0,
            });
        }
    }, [project, isEditing]);

    const set = (key: string, val: any) =>
        setForm((prev) => ({ ...prev, [key]: val }));

    // Auto-generate slug from title (only when creating)
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        set("title", title);
        set(
            "slug",
            title
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .trim()
        );
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
        if (!token || !form.title || !form.summary) return;

        const data = {
            ...form,
            tags: form.tags,
        };

        let success: boolean;
        if (isEditing && project) {
            success = await updateProject(token, project.slug, data);
        } else {
            success = await createProject(token, data);
        }

        if (success) {
            router.push("/admin/projects");
        }
    };

    const handleCancel = () => {
        router.back();
    };

    return (
        <div className="flex flex-col gap-4 sm:gap-6">
            {/* Cover Image */}
            <Card>
                <CardHeader
                    title="Cover Image"
                    description="The main image shown in project cards"
                />
                <CardBody>
                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                        <ImageUpload
                            token={token ?? ""}
                            folder="projects"
                            uploadKey="project-cover"
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
                    description="Core details about your project"
                />
                <CardBody>
                    <div className="grid grid-cols-1 gap-4">
                        <Input
                            label="Project Title"
                            required
                            value={form.title}
                            onChange={handleTitleChange}
                            placeholder="e.g. E-Commerce Dashboard"
                            maxLength={FIELD_LIMITS.title}
                            hint={`${form.title.length}/${FIELD_LIMITS.title} characters`}
                        />
                        <Input
                            label="Slug"
                            required
                            value={form.slug}
                            onChange={(e) => set("slug", e.target.value)}
                            placeholder="e-commerce-dashboard"
                            hint="URL-friendly identifier (auto-generated from title)"
                            disabled={true} // Always disabled
                        />
                        <Textarea
                            label="Summary"
                            required
                            value={form.summary}
                            onChange={(e) => set("summary", e.target.value)}
                            placeholder="A brief overview of your project (1-2 sentences)"
                            rows={2}
                            maxLength={FIELD_LIMITS.summary}
                            hint={`${form.summary.length}/${FIELD_LIMITS.summary} characters`}
                        />
                        <div className="relative">
                            <MarkdownEditor
                                label="Full Description"
                                value={form.description}
                                onChange={(e) => set("description", e)}
                                placeholder="Detailed description of your project. Supports markdown formatting."
                                hint={`${form.summary.length}/${FIELD_LIMITS.summary} characters`}
                                uploadToken={token ?? ""}
                                uploadFolder={`projects`}
                                showCopy={false}
                                showDownload={false}
                                enableImageUpload={!!token}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Links */}
            <Card>
                <CardHeader
                    title="Project Links"
                    description="External URLs for your project"
                />
                <CardBody>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                            label="Live URL"
                            type="url"
                            value={form.liveUrl}
                            onChange={(e) => set("liveUrl", e.target.value)}
                            placeholder="https://your-project.com"
                            leftIcon={<ExternalLink size={16} />}
                        />
                        <Input
                            label="Repository URL"
                            type="url"
                            value={form.repoUrl}
                            onChange={(e) => set("repoUrl", e.target.value)}
                            placeholder="https://github.com/username/repo"
                            leftIcon={<BsGithub size={16} />}
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Tags */}
            <Card>
                <CardHeader
                    title="Tags"
                    description="Categorize your project with relevant tags"
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
                            hint="Make this project visible on your public portfolio"
                            size="md"
                        />
                        <Toggle
                            checked={form.featured}
                            onChange={(v) => set("featured", v)}
                            label="Featured"
                            hint="Show this project prominently on your portfolio"
                            size="md"
                        />
                        {form.featured && (
                            <Input
                                label="Display Order"
                                type="number"
                                value={form.order.toString()}
                                onChange={(e) => set("order", parseInt(e.target.value) || 0)}
                                placeholder="0"
                                min={0}
                                hint="Lower numbers appear first. Used for featured projects ordering."
                            />
                        )}
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
                    onClick={handleCancel}
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
                    disabled={!form.title || !form.summary}
                    className="w-full sm:w-auto"
                >
                    {isEditing ? "Save Changes" : "Create Project"}
                </Button>
            </div>
        </div>
    );
}