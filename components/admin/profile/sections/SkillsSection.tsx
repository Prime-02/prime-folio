"use client";

import { useState, useMemo } from "react";
import { Plus, Lightbulb } from "lucide-react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Skill } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/Misc";
import { ConfirmDialog } from "@/components/ui/Modal";
import SkillModal from "./skills-section-components/SkillModal";
import SkillCategorySection from "./skills-section-components/SkillCategorySection";

export default function SkillsSection() {
    const token = useAuthStore((s) => s.token);

    // Get individual stable primitives/arrays instead of derived object
    const skills = useProfileStore((s) => s.profile?.skills ?? []);
    const { deleteSkill, isSubmitting } = useProfileStore();

    // Memoize the categorization - only recalculates when skills array changes
    const skillsByCategory = useMemo(() => {
        return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
            if (!acc[skill.category]) acc[skill.category] = [];
            acc[skill.category].push(skill);
            return acc;
        }, {});
    }, [skills]);

    const [modalOpen, setModalOpen] = useState(false);
    const [editSkill, setEditSkill] = useState<Skill | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);

    const categories = Object.keys(skillsByCategory);

    const openAdd = () => { setEditSkill(null); setModalOpen(true); };
    const openEdit = (skill: Skill) => {  setEditSkill(skill); setModalOpen(true); };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        await deleteSkill(token, deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <>
            <Card>
                <CardHeader
                    title="Skills"
                    description="Manage your technical and professional skills"
                    action={
                        <Button variant="primary" size="sm" onClick={openAdd}
                            leftIcon={<Plus size={16} />}
                        >
                            Add Skill
                        </Button>
                    }
                />
                <CardBody>
                    {categories.length === 0 ? (
                        <EmptyState
                            icon={<Lightbulb size={32} strokeWidth={1.5} />}
                            title="No skills yet"
                            description="Add your first skill to showcase your expertise"
                            action={
                                <Button variant="primary" size="sm" onClick={openAdd}>Add Skill</Button>
                            }
                        />
                    ) : (
                        <div className="flex flex-col gap-6">
                            {categories.map((category) => (
                                <SkillCategorySection
                                    key={category}
                                    category={category}
                                    skills={skillsByCategory[category]}
                                    onEdit={openEdit}
                                    onDelete={setDeleteTarget}
                                />
                            ))}
                        </div>
                    )}
                </CardBody>
            </Card>

            <SkillModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                skill={editSkill}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Skill"
                message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={isSubmitting}
            />
        </>
    );
}