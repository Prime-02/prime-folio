// components/admin/profile/sections/EducationSection.tsx
"use client";

import { useState } from "react";
import { Plus, GraduationCap } from "lucide-react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Education } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import EducationList from "./education-section-components/EducationList";
import EducationModal from "./education-section-components/EducationModal";

export default function EducationSection() {
    const token = useAuthStore((s) => s.token);
    const educations = useProfileStore((s) => s.profile?.educations ?? []);
    const { deleteEducation, isSubmitting } = useProfileStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editEdu, setEditEdu] = useState<Education | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);

    const openAdd = () => {
        setEditEdu(null);
        setModalOpen(true);
    };

    const openEdit = (edu: Education) => {
        setEditEdu(edu);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        await deleteEducation(token, deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <>
            <Card>
                <CardHeader
                    title="Education"
                    description="Your academic background and qualifications"
                    action={
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={openAdd}
                            leftIcon={<Plus size={16} />}
                        >
                            Add Education
                        </Button>
                    }
                />
                <CardBody>
                    {educations.length === 0 ? (
                        <EmptyState
                            icon={<GraduationCap size={32} strokeWidth={1.5} />}
                            title="No education added"
                            description="Add your academic background and qualifications"
                            action={
                                <Button variant="primary" size="sm" onClick={openAdd}>
                                    Add Education
                                </Button>
                            }
                        />
                    ) : (
                        <EducationList
                            educations={educations}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardBody>
            </Card>

            <EducationModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                education={editEdu}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Education"
                message={`Remove "${deleteTarget?.degree} at ${deleteTarget?.institution}"? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={isSubmitting}
            />
        </>
    );
}