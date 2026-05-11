// components/admin/profile/sections/social-links-section/SocialLinkModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { SocialLink } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Link } from "lucide-react";
import { PLATFORMS } from "./constants";

interface SocialLinkModalProps {
    open: boolean;
    onClose: () => void;
    link?: SocialLink | null;
}

const getInitialFormState = () => ({
    platform: "",
    url: "",
    icon: "",
});

export default function SocialLinkModal({ open, onClose, link }: SocialLinkModalProps) {
    const token = useAuthStore((s) => s.token);
    const { addSocialLink, updateSocialLink, isSubmitting } = useProfileStore();

    const [form, setForm] = useState(getInitialFormState());

    // Reset form when modal opens or link changes
    useEffect(() => {
        if (open) {
            if (link) {
                setForm({
                    platform: link.platform ?? "",
                    url: link.url ?? "",
                    icon: link.icon ?? "",
                });
            } else {
                setForm(getInitialFormState());
            }
        }
    }, [open, link]);

    const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

    const handlePlatformChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const platform = e.target.value;
        set("platform", platform);
    };

    const handleSubmit = async () => {
        if (!token || !form.platform || !form.url) return;

        const ok = link
            ? await updateSocialLink(token, link.id, form)
            : await addSocialLink(token, form);

        if (ok) onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={link ? "Edit Social Link" : "Add Social Link"}
            size="sm"
            footer={
                <>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        size="sm"
                        loading={isSubmitting}
                        onClick={handleSubmit}
                    >
                        {link ? "Save Changes" : "Add Link"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <Select
                    label="Platform"
                    value={form.platform}
                    onChange={handlePlatformChange}
                    options={PLATFORMS}
                    placeholder="Select a platform"
                />
                <Input
                    label="URL"
                    type="url"
                    value={form.url}
                    onChange={(e) => set("url", e.target.value)}
                    placeholder="https://github.com/yourusername"
                    leftIcon={<Link className="w-4 h-4" />}
                />
                <Input
                    label="Icon Name (Optional)"
                    value={form.icon ?? ""}
                    onChange={(e) => set("icon", e.target.value)}
                    placeholder="e.g. github, linkedin (leave empty to auto-detect)"
                    hint="Optional — custom icon identifier"
                />
            </div>
        </Modal>
    );
}