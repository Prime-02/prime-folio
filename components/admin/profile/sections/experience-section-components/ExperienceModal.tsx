// components/admin/profile/sections/experience-section/ExperienceModal.tsx
"use client";

import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Experience } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUpload from "@/components/ui/ImageUpload";

interface ExperienceModalProps {
    open: boolean;
    onClose: () => void;
    experience?: Experience | null;
}

// Helper to format Date to YYYY-MM string for input type="month"
const formatDateToMonth = (date?: Date | string | null): string => {
    if (!date) return "";
    const d = date instanceof Date ? date : new Date(date);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
};

const getInitialFormState = () => ({
    company: "",
    role: "",
    location: "",
    companyUrl: "",
    companyLogo: null as string | null,
    startDate: "",
    endDate: "",
    current: false,
    description: "",
});

export default function ExperienceModal({ open, onClose, experience }: ExperienceModalProps) {
    const token = useAuthStore((s) => s.token);
    const { addExperience, updateExperience, isSubmitting } = useProfileStore();

    const [form, setForm] = useState(getInitialFormState());

    // Reset form when modal opens or experience changes
    useEffect(() => {
        if (open) {
            if (experience) {
                setForm({
                    company: experience.company ?? "",
                    role: experience.role ?? "",
                    location: experience.location ?? "",
                    companyUrl: experience.companyUrl ?? "",
                    companyLogo: experience.companyLogo ?? null,
                    startDate: formatDateToMonth(experience.startDate),
                    endDate: formatDateToMonth(experience.endDate),
                    current: experience.current ?? false,
                    description: experience.description ?? "",
                });
            } else {
                setForm(getInitialFormState());
            }
        }
    }, [open, experience]);

    const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

    const handleSubmit = async () => {
        if (!token || !form.company || !form.role || !form.startDate) return;

        const payload = {
            ...form,
            startDate: new Date(form.startDate + "-01"),
            endDate: form.current ? null : (form.endDate ? new Date(form.endDate + "-01") : null),
        };

        const ok = experience
            ? await updateExperience(token, experience.id, payload)
            : await addExperience(token, payload);

        if (ok) onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={experience ? "Edit Experience" : "Add Experience"}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" loading={isSubmitting} onClick={handleSubmit}>
                        {experience ? "Save Changes" : "Add Experience"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                {/* Company Logo */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Company Logo
                    </label>
                    <ImageUpload
                        token={token ?? ""}
                        folder="experience"
                        uploadKey="company-logo"
                        value={form.companyLogo}
                        onChange={(id) => set("companyLogo", id)}
                        aspectRatio="square"
                        className="w-24 h-24"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Company"
                        value={form.company}
                        onChange={(e) => set("company", e.target.value)}
                        placeholder="e.g. Acme Inc."
                    />
                    <Input
                        label="Role / Title"
                        value={form.role}
                        onChange={(e) => set("role", e.target.value)}
                        placeholder="e.g. Senior Engineer"
                    />
                    <Input
                        label="Location"
                        value={form.location}
                        onChange={(e) => set("location", e.target.value)}
                        placeholder="e.g. Remote / New York"
                    />
                    <Input
                        label="Company Website"
                        type="url"
                        value={form.companyUrl}
                        onChange={(e) => set("companyUrl", e.target.value)}
                        placeholder="https://company.com"
                        leftIcon={<ExternalLink size={16} />}
                    />
                    <Input
                        label="Start Date"
                        type="month"
                        value={form.startDate}
                        onChange={(e) => set("startDate", e.target.value)}
                    />
                    {!form.current && (
                        <Input
                            label="End Date"
                            type="month"
                            value={form.endDate}
                            onChange={(e) => set("endDate", e.target.value)}
                        />
                    )}
                    <div className={form.current ? "col-span-2" : ""}>
                        <Toggle
                            checked={form.current}
                            onChange={(v) => set("current", v)}
                            label="Currently working here"
                        />
                    </div>
                </div>
                <Textarea
                    label="Description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements…"
                    rows={4}
                />
            </div>
        </Modal>
    );
}