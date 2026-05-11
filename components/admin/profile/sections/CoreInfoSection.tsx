// components/admin/profile/sections/CoreInfoSection.tsx
"use client";

import { useState, useEffect } from "react";
import { MapPin } from "lucide-react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useAuthStore } from "@/lib/stores";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Toggle from "@/components/ui/Toggle";
import Button from "@/components/ui/Button";
import ImageUpload from "@/components/ui/ImageUpload";
import { Profile } from "@prisma/client";
import MarkdownEditor from "@/components/ui/markdown/MarkdownEditor";

// ── Form data type (matches what we collect in the UI) ────────────────────────
type ProfileFormData = {
    name: string;
    headline: string;
    tagline: string;
    bio: string;
    city: string;
    state: string;
    country: string;
    addressLine: string;
    timezone: string;
    profilePhoto: string | null;
    coverPhoto: string | null;
    availableForWork: boolean;
    availabilityNote: string;
    resumeUrl: string | null;
    resumeLabel: string;
};

// ── Field limits (must match zod validations) ─────────────────────────────────
const FIELD_LIMITS = {
    name: 100,
    headline: 160,
    tagline: 300,
    bio: Infinity, // No hard limit, but you can set one
    city: 100,
    state: 100,
    country: 100,
    addressLine: 200,
    timezone: 60,
    availabilityNote: 200,
    resumeLabel: 60,
} as const;

// Fields that are required when creating a new profile
const REQUIRED_FIELDS: Array<keyof ProfileFormData> = [
    "name",
    "headline",
    "tagline",
    "bio",
];

// Fields that map directly between form and Profile model
const PROFILE_FIELDS: Array<keyof ProfileFormData> = [
    "name",
    "headline",
    "tagline",
    "bio",
    "city",
    "state",
    "country",
    "addressLine",
    "timezone",
    "profilePhoto",
    "coverPhoto",
    "availableForWork",
    "availabilityNote",
    "resumeUrl",
    "resumeLabel",
];

// ── Character count helper ────────────────────────────────────────────────────
function CharCount({
    current,
    max,
}: {
    current: number;
    max: number;
}) {
    if (max === Infinity) return null;

    const isNearLimit = current > max * 0.9;
    const isOverLimit = current > max;

    return (
        <span
            className={`text-xs ml-auto ${isOverLimit
                ? "text-red-500 font-medium"
                : isNearLimit
                    ? "text-amber-500"
                    : "text-[var(--text-muted)]"
                }`}
        >
            {current}/{max}
        </span>
    );
}

export default function CoreInfoSection() {
    const token = useAuthStore((s) => s.token);
    const { profile, isSubmitting, updateProfile, createProfile } =
        useProfileStore();

    const [form, setForm] = useState<ProfileFormData>({
        name: "",
        headline: "",
        tagline: "",
        bio: "",
        city: "",
        state: "",
        country: "",
        addressLine: "",
        timezone: "",
        profilePhoto: null,
        coverPhoto: null,
        availableForWork: false,
        availabilityNote: "",
        resumeUrl: null,
        resumeLabel: "",
    });

    // Sync store → form
    useEffect(() => {
        if (profile) {
            setForm({
                name: profile.name ?? "",
                headline: profile.headline ?? "",
                tagline: profile.tagline ?? "",
                bio: profile.bio ?? "",
                city: profile.city ?? "",
                state: profile.state ?? "",
                country: profile.country ?? "",
                addressLine: profile.addressLine ?? "",
                timezone: profile.timezone ?? "",
                profilePhoto: profile.profilePhoto ?? null,
                coverPhoto: profile.coverPhoto ?? null,
                availableForWork: profile.availableForWork ?? false,
                availabilityNote: profile.availabilityNote ?? "",
                resumeUrl: profile.resumeUrl ?? null,
                resumeLabel: profile.resumeLabel ?? "",
            });
        }
    }, [profile]);

    const set = <K extends keyof ProfileFormData>(
        key: K,
        value: ProfileFormData[K]
    ) => setForm((prev) => ({ ...prev, [key]: value }));

    // ── Check if form has changes compared to saved profile ──────────────────
    const hasChanges = ((): boolean => {
        if (!profile) return true; // No profile yet — show button

        return PROFILE_FIELDS.some((key) => {
            const currentValue = form[key];
            const originalValue = profile[key as keyof Profile];

            // Treat empty string, null, and undefined the same
            const normalized = (v: unknown) =>
                v === "" || v === null || v === undefined ? null : v;

            return normalized(currentValue) !== normalized(originalValue);
        });
    })();

    // ── Build the payload to send to the API ──────────────────────────────────
    const buildPayload = (): Partial<Profile> => {
        if (profile) {
            // UPDATING — only include fields that changed
            const changes: Partial<Profile> = {};

            for (const key of PROFILE_FIELDS) {
                const currentValue = form[key];
                const originalValue = profile[key as keyof Profile];

                if (currentValue !== originalValue) {
                    // Omit empty strings — they shouldn't overwrite existing data
                    if (currentValue !== "" && currentValue !== null) {
                        (changes as Record<string, unknown>)[key] = currentValue;
                    }
                }
            }

            return changes;
        }

        // CREATING — required fields + non-empty optionals
        const payload: Partial<Profile> = {};

        // Required fields
        for (const key of REQUIRED_FIELDS) {
            const value = form[key];
            if (value) {
                (payload as Record<string, unknown>)[key] = value;
            }
        }

        // Optional fields — only include if they have a real value
        const optionalFields: Array<keyof ProfileFormData> = PROFILE_FIELDS.filter(
            (f) => !REQUIRED_FIELDS.includes(f)
        );

        for (const key of optionalFields) {
            const value = form[key];
            if (value !== "" && value !== null && value !== undefined) {
                (payload as Record<string, unknown>)[key] = value;
            }
        }

        return payload;
    };

    const handleSave = async () => {
        if (!token) return;

        const payload = buildPayload();

        if (profile) {
            // Only call if there are actual changes
            if (Object.keys(payload).length > 0) {
                await updateProfile(token, payload);
            }
        } else {
            await createProfile(token, payload);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Photos */}
            <Card>
                <CardHeader
                    title="Profile Photos"
                    description="Your public photos shown across the portfolio"
                />
                <CardBody>
                    <div className="flex flex-col gap-6">
                        {/* Profile Photo */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Profile Photo
                            </label>
                            <div className="flex items-center gap-6">
                                <ImageUpload
                                    token={token ?? ""}
                                    folder="profile"
                                    uploadKey="profile-photo"
                                    value={form.profilePhoto}
                                    onChange={(id) => set("profilePhoto", id)}
                                    aspectRatio="square"
                                    className="w-36 h-36 shrink-0"
                                />
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                                        Upload guidelines
                                    </p>
                                    <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                                        <li>Recommended: 400×400px or larger</li>
                                        <li>Formats: JPG, PNG, WebP</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Cover Photo */}
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">
                                Cover Photo
                            </label>
                            <div className="flex items-center gap-6">
                                <ImageUpload
                                    token={token ?? ""}
                                    folder="profile"
                                    uploadKey="cover-photo"
                                    value={form.coverPhoto}
                                    onChange={(id) => set("coverPhoto", id)}
                                    aspectRatio="banner"
                                    className="w-72 h-36 shrink-0"
                                />
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                                        Upload guidelines
                                    </p>
                                    <ul className="text-sm text-[var(--text-muted)] list-disc list-inside space-y-1">
                                        <li>Recommended: 1200×600px or larger</li>
                                        <li>Formats: JPG, PNG, WebP</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Basic Info */}
            <Card>
                <CardHeader
                    title="Basic Information"
                    description={
                        profile
                            ? "Your name, titles, and public-facing details"
                            : "Fill in the required fields to create your profile"
                    }
                />
                <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Input
                                label="Full Name"
                                required={!profile}
                                value={form.name}
                                onChange={(e) => set("name", e.target.value)}
                                placeholder="e.g. Jane Doe"
                                maxLength={FIELD_LIMITS.name}
                                hint={
                                    <CharCount
                                        current={form.name.length}
                                        max={FIELD_LIMITS.name}
                                    />
                                }
                            />
                        </div>
                        <Input
                            label="Headline"
                            required={!profile}
                            value={form.headline}
                            onChange={(e) => set("headline", e.target.value)}
                            placeholder="e.g. Full-Stack Engineer"
                            maxLength={FIELD_LIMITS.headline}
                            hint={
                                <div className="flex justify-between items-center w-full">
                                    <span>Primary role/title shown prominently</span>
                                    <CharCount
                                        current={form.headline.length}
                                        max={FIELD_LIMITS.headline}
                                    />
                                </div>
                            }
                        />
                        <Input
                            label="Tagline"
                            required={!profile}
                            value={form.tagline}
                            onChange={(e) => set("tagline", e.target.value)}
                            placeholder="e.g. Building delightful web experiences"
                            maxLength={FIELD_LIMITS.tagline}
                            hint={
                                <div className="flex justify-between items-center w-full">
                                    <span>Short punchy subtitle</span>
                                    <CharCount
                                        current={form.tagline.length}
                                        max={FIELD_LIMITS.tagline}
                                    />
                                </div>
                            }
                        />
                        <div className="col-span-2">
                            <MarkdownEditor
                                label="Post Content"
                                value={form.bio}
                                onChange={(e) => set("bio", e)}
                                placeholder="Write a short bio about yourself…"
                                showCopy={false}
                                showDownload={false}
                                enableImageUpload={false}
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Location */}
            <Card>
                <CardHeader
                    title="Location"
                    description="Your physical location details"
                />
                <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="City"
                            value={form.city}
                            onChange={(e) => set("city", e.target.value)}
                            placeholder="e.g. San Francisco"
                            maxLength={FIELD_LIMITS.city}
                            hint={
                                <CharCount
                                    current={form.city.length}
                                    max={FIELD_LIMITS.city}
                                />
                            }
                        />
                        <Input
                            label="State"
                            value={form.state}
                            onChange={(e) => set("state", e.target.value)}
                            placeholder="e.g. California"
                            maxLength={FIELD_LIMITS.state}
                            hint={
                                <CharCount
                                    current={form.state.length}
                                    max={FIELD_LIMITS.state}
                                />
                            }
                        />
                        <Input
                            label="Country"
                            value={form.country}
                            onChange={(e) => set("country", e.target.value)}
                            placeholder="e.g. United States"
                            maxLength={FIELD_LIMITS.country}
                            hint={
                                <CharCount
                                    current={form.country.length}
                                    max={FIELD_LIMITS.country}
                                />
                            }
                        />
                        <Input
                            label="Timezone"
                            value={form.timezone}
                            onChange={(e) => set("timezone", e.target.value)}
                            placeholder="e.g. Africa/Lagos"
                            maxLength={FIELD_LIMITS.timezone}
                            hint={
                                <CharCount
                                    current={form.timezone.length}
                                    max={FIELD_LIMITS.timezone}
                                />
                            }
                        />
                        <div className="col-span-2">
                            <Input
                                label="Address Line"
                                value={form.addressLine}
                                onChange={(e) => set("addressLine", e.target.value)}
                                placeholder="Optional street address"
                                maxLength={FIELD_LIMITS.addressLine}
                                leftIcon={<MapPin size={16} />}
                                hint={
                                    <CharCount
                                        current={form.addressLine.length}
                                        max={FIELD_LIMITS.addressLine}
                                    />
                                }
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Availability */}
            <Card>
                <CardHeader
                    title="Availability"
                    description="Control whether you appear as open to new opportunities"
                />
                <CardBody>
                    <div className="flex flex-col gap-4">
                        <Toggle
                            checked={form.availableForWork}
                            onChange={(v) => set("availableForWork", v)}
                            label="Available for work"
                            hint="Displays a green badge on your public profile"
                            size="md"
                        />
                        <Input
                            label="Availability Note"
                            value={form.availabilityNote}
                            onChange={(e) =>
                                set("availabilityNote", e.target.value)
                            }
                            placeholder='e.g. "Open to remote roles"'
                            maxLength={FIELD_LIMITS.availabilityNote}
                            hint={
                                <div className="flex justify-between items-center w-full">
                                    <span>Shown when available for work is enabled</span>
                                    <CharCount
                                        current={form.availabilityNote.length}
                                        max={FIELD_LIMITS.availabilityNote}
                                    />
                                </div>
                            }
                        />
                    </div>
                </CardBody>
            </Card>

            {/* Resume */}
            <Card>
                <CardHeader
                    title="Resume"
                    description="Upload your resume for visitors to download"
                />
                <CardBody>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <ImageUpload
                                token={token ?? ""}
                                folder="profile"
                                uploadKey="resume"
                                value={form.resumeUrl}
                                onChange={(id) => set("resumeUrl", id)}
                                accept=".pdf,.doc,.docx"
                                className="w-full h-36"
                            />
                        </div>
                        <div className="col-span-2">
                            <Input
                                label="Resume Label"
                                value={form.resumeLabel}
                                onChange={(e) =>
                                    set("resumeLabel", e.target.value)
                                }
                                placeholder='e.g. "Download CV"'
                                maxLength={FIELD_LIMITS.resumeLabel}
                                hint={
                                    <div className="flex justify-between items-center w-full">
                                        <span>Button text shown on your portfolio</span>
                                        <CharCount
                                            current={form.resumeLabel.length}
                                            max={FIELD_LIMITS.resumeLabel}
                                        />
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Save */}
            <div className="flex justify-end items-center gap-4">
                {!hasChanges && profile && (
                    <p className="text-sm text-[var(--text-muted)]">
                        No changes to save
                    </p>
                )}
                <Button
                    variant="primary"
                    size="md"
                    loading={isSubmitting}
                    onClick={handleSave}
                    disabled={!hasChanges}
                >
                    {profile ? "Save Changes" : "Create Profile"}
                </Button>
            </div>
        </div>
    );
}