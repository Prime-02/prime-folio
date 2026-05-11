// components/admin/profile/sections/education-section/EducationModal.tsx
"use client";

import { useState, useEffect } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import type { Education } from "@/lib/types";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import ImageUpload from "@/components/ui/ImageUpload";

interface EducationModalProps {
    open: boolean;
    onClose: () => void;
    education?: Education | null;
}

const getInitialFormState = () => ({
    institution: "",
    degree: "",
    field: "",
    startYear: "",
    endYear: "",
    current: false,
    description: "",
    logo: null as string | null,
});

export default function EducationModal({ open, onClose, education }: EducationModalProps) {
    const token = useAuthStore((s) => s.token);
    const { addEducation, updateEducation, isSubmitting } = useProfileStore();

    const [form, setForm] = useState(getInitialFormState());

    // Reset form when modal opens or education changes
    useEffect(() => {
        if (open) {
            if (education) {
                setForm({
                    institution: education.institution ?? "",
                    degree: education.degree ?? "",
                    field: education.field ?? "",
                    startYear: education.startYear?.toString() ?? "",
                    endYear: education.endYear?.toString() ?? "",
                    current: education.current ?? false,
                    description: education.description ?? "",
                    logo: education.logo ?? null,
                });
            } else {
                setForm(getInitialFormState());
            }
        }
    }, [open, education]);

    const set = (key: string, val: any) => setForm((p) => ({ ...p, [key]: val }));

    const handleSubmit = async () => {
        if (!token || !form.institution || !form.degree || !form.startYear) return;

        const data = {
            ...form,
            startYear: parseInt(form.startYear),
            endYear: form.current ? null : (form.endYear ? parseInt(form.endYear) : null),
        };

        const ok = education
            ? await updateEducation(token, education.id, data)
            : await addEducation(token, data);

        if (ok) onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            title={education ? "Edit Education" : "Add Education"}
            size="lg"
            footer={
                <>
                    <Button variant="secondary" size="sm" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button variant="primary" size="sm" loading={isSubmitting} onClick={handleSubmit}>
                        {education ? "Save Changes" : "Add Education"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                {/* Institution Logo */}
                <div>
                    <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                        Institution Logo
                    </label>
                    <ImageUpload
                        token={token ?? ""}
                        folder="education"
                        uploadKey="education-logo"
                        value={form.logo}
                        onChange={(id) => set("logo", id)}
                        aspectRatio="square"
                        className="w-24 h-24"
                    />
                </div>

                <Input
                    label="Institution"
                    value={form.institution}
                    onChange={(e) => set("institution", e.target.value)}
                    placeholder="e.g. MIT, Stanford University"
                />

                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Degree"
                        value={form.degree}
                        onChange={(e) => set("degree", e.target.value)}
                        placeholder="e.g. Bachelor of Science"
                    />
                    <Input
                        label="Field of Study"
                        value={form.field}
                        onChange={(e) => set("field", e.target.value)}
                        placeholder="e.g. Computer Science"
                    />
                    <Input
                        label="Start Year"
                        type="number"
                        min={1950}
                        max={new Date().getFullYear() + 10}
                        value={form.startYear}
                        onChange={(e) => set("startYear", e.target.value)}
                        placeholder="e.g. 2018"
                    />
                    <Input
                        label="End Year"
                        type="number"
                        min={1950}
                        max={new Date().getFullYear() + 10}
                        value={form.endYear}
                        onChange={(e) => set("endYear", e.target.value)}
                        placeholder="e.g. 2022"
                        disabled={form.current}
                        hint={form.current ? "Disabled when currently enrolled" : "Leave blank if unknown"}
                    />
                    <div className="col-span-2">
                        <Toggle
                            checked={form.current}
                            onChange={(v) => {
                                set("current", v);
                                if (v) set("endYear", "");
                            }}
                            label="Currently enrolled"
                            hint="Check if you're still studying here"
                            size="sm"
                        />
                    </div>
                </div>

                <Textarea
                    label="Description"
                    value={form.description}
                    onChange={(e) => set("description", e.target.value)}
                    placeholder="Notable activities, thesis, achievements…"
                    rows={3}
                />
            </div>
        </Modal>
    );
}