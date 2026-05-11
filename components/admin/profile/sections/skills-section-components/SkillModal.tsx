// components/admin/profile/sections/skills-section-components/SkillModal.tsx
"use client";

import { useEffect, useState } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Skill } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ImageUpload from "@/components/ui/ImageUpload";
import { PROFICIENCY_LEVELS } from "@/components/admin/profile/sections/skills-section-components/constants";
import { SkillLevel } from "@prisma/client";

interface SkillModalProps {
    open: boolean;
    onClose: () => void;
    skill?: Skill | null;
}

export default function SkillModal({ open, onClose, skill }: SkillModalProps) {
    const token = useAuthStore((s) => s.token);
    const { addSkill, updateSkill, isSubmitting } = useProfileStore();

    const [form, setForm] = useState({
        name: "",
        category: "",
        proficiency: "INTERMEDIATE" as SkillLevel,
        icon: null as string | null,
    });

    // Sync form when skill changes or modal opens
    useEffect(() => {
        if (open) {
            setForm({
                name: skill?.name ?? "",
                category: skill?.category ?? "",
                proficiency: skill?.proficiency ?? ("INTERMEDIATE" as SkillLevel),
                icon: skill?.icon ?? null,
            });
        }
    }, [open, skill]);

    const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

    const handleSubmit = async () => {
        if (!token || !form.name || !form.category) return;
        const ok = skill
            ? await updateSkill(token, skill.id, form)
            : await addSkill(token, form);
        if (ok) onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={skill ? "Edit Skill" : "Add Skill"}
            size="sm"
            footer={
                <>
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" loading={isSubmitting} onClick={handleSubmit}>
                        {skill ? "Save Changes" : "Add Skill"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Skill Icon - Custom implementation for small icon */}
                <div className="flex flex-col gap-2">
                    <label className="block text-sm font-medium text-[var(--text-primary)]">
                        Skill Icon
                    </label>
                    <div className="flex items-start gap-3">
                        <div className="w-16 h-16">
                            <ImageUpload
                                token={token ?? ""}
                                folder="skills"
                                uploadKey="skill-icon"
                                value={form.icon}
                                onChange={(id) => set("icon", id)}
                                aspectRatio="square"
                                minHeight={64}
                                className="w-full h-full"
                            />
                        </div>
                        <p className="text-xs text-[var(--text-muted)] pt-1">
                            Optional — upload a custom icon or logo
                        </p>
                    </div>
                </div>

                <Input
                    label="Skill Name"
                    value={form.name}
                    onChange={(e) => set("name", e.target.value)}
                    placeholder="e.g. TypeScript"
                />

                <Input
                    label="Category"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                    placeholder="e.g. Frontend, Backend, DevOps"
                    hint="Used to group skills on your profile"
                />

                <ProficiencySelector
                    value={form.proficiency}
                    onChange={(value) => set("proficiency", value as SkillLevel)}
                />
            </div>
        </Modal>
    );
}

// Proficiency Selector Component
interface ProficiencySelectorProps {
    value: SkillLevel;
    onChange: (value: SkillLevel) => void;
}

function ProficiencySelector({ value, onChange }: ProficiencySelectorProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-[var(--text-secondary)]">
                Proficiency
            </label>
            <div className="grid grid-cols-2 gap-2">
                {PROFICIENCY_LEVELS.map((level) => (
                    <button
                        key={level.value}
                        type="button"
                        onClick={() => onChange(level.value as SkillLevel)}
                        className={[
                            "px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all duration-150",
                            value === level.value
                                ? "border-[var(--primary-600)] bg-[var(--primary-600)] text-[var(--text-inverse)]"
                                : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--border-hover)]",
                        ].join(" ")}
                    >
                        {level.label}
                    </button>
                ))}
            </div>
        </div>
    );
}