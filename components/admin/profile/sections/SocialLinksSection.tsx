// components/admin/profile/sections/SocialLinksSection.tsx
"use client";

import { useState } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { SocialLink } from "@/lib/types";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/Misc";
import { Link, Plus } from "lucide-react";
import SocialLinkList from "./social-links-section-components/SocialLinkList";
import SocialLinkModal from "./social-links-section-components/SocialLinkModal";

export default function SocialLinksSection() {
    const token = useAuthStore((s) => s.token);
    const socialLinks = useProfileStore((s) => s.profile?.socialLinks ?? []);
    const { deleteSocialLink, isSubmitting } = useProfileStore();

    const [modalOpen, setModalOpen] = useState(false);
    const [editLink, setEditLink] = useState<SocialLink | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);

    const openAdd = () => {
        setEditLink(null);
        setModalOpen(true);
    };

    const openEdit = (link: SocialLink) => {
        setEditLink(link);
        setModalOpen(true);
    };

    const handleDelete = async () => {
        if (!token || !deleteTarget) return;
        await deleteSocialLink(token, deleteTarget.id);
        setDeleteTarget(null);
    };

    return (
        <>
            <Card>
                <CardHeader
                    title="Social Links"
                    description="External profiles and websites shown on your portfolio"
                    action={
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={openAdd}
                            leftIcon={<Plus className="w-4 h-4" />}
                        >
                            Add Link
                        </Button>
                    }
                />
                <CardBody>
                    {socialLinks.length === 0 ? (
                        <EmptyState
                            icon={<Link className="w-8 h-8" />}
                            title="No social links yet"
                            description="Add your GitHub, LinkedIn, and other profiles"
                            action={
                                <Button variant="primary" size="sm" onClick={openAdd}>
                                    Add Link
                                </Button>
                            }
                        />
                    ) : (
                        <SocialLinkList
                            socialLinks={socialLinks}
                            onEdit={openEdit}
                            onDelete={setDeleteTarget}
                        />
                    )}
                </CardBody>
            </Card>

            <SocialLinkModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                link={editLink}
            />

            <ConfirmDialog
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                title="Delete Social Link"
                message={`Remove this social link? This cannot be undone.`}
                confirmLabel="Delete"
                variant="danger"
                loading={isSubmitting}
            />
        </>
    );
}