// components/admin/profile/sections/ExperienceSection.tsx
"use client";

import { useState } from "react";
import { Plus, Briefcase } from "lucide-react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Experience } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import ExperienceTimeline from "./experience-section-components/ExperienceTimeline";
import ExperienceModal from "./experience-section-components/ExperienceModal";

export default function ExperienceSection() {
    const token = useAuthStore((s) => s.token);
    const experiences = useProfileStore((s) => s.profile?.experiences ?? []);
    const { deleteExperience, isSubmitting } = useProfileStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editExp, setEditExp] = useState<Experience | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);

    const openAdd = () => {
        setEditExp(null);
        setModalOpen(true);
    };

    const openEdit = (exp: Experience) => {
        setEditExp(exp);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        await deleteExperience(token, deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <>
            <Card>
                <CardHeader
                    title="Work Experience"
                    description="Your professional history, most recent first"
                    action={
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={openAdd}
                            leftIcon={<Plus size={16} />}
                        >
                            Add Experience
                        </Button>
                    }
                />
                <CardBody>
                    {experiences.length === 0 ? (
                        <EmptyState
                            icon={<Briefcase size={32} strokeWidth={1.5} />}
                            title="No experience added"
                            description="Add your work history to show your professional background"
                            action={
                                <Button variant="primary" size="sm" onClick={openAdd}>
                                    Add Experience
                                </Button>
                            }
                        />
                    ) : (
                        <ExperienceTimeline
                            experiences={experiences}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardBody>
            </Card>

            <ExperienceModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                experience={editExp}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Experience"
                message={`Remove "${deleteTarget?.role} at ${deleteTarget?.company}"? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={isSubmitting}
            />
        </>
    );
}