// components/CVGenerator/CVGenerator.tsx (Fixed Version)
"use client";

import { useState, useCallback } from "react";
import { useProfileStore } from "@/lib/stores/useProfileStore";
import { useProjectStore } from "@/lib/stores/useProjectStore";
import { useTestimonialStore } from "@/lib/stores/useTestimonialStore";
import CVConfig from "./CVConfig";
import CVPreview from "./CVPreview";
import {buildCVHtml } from "./cvHtmlBuilder";
import type { ComplexityMode, ToneMode } from "./types";
import { COMPLEXITY_MODES } from "./constants";

export default function CVGenerator() {
    const [step, setStep] = useState<"config" | "preview">("config");
    const [complexity, setComplexity] = useState<ComplexityMode>("standard");
    const [tone, setTone] = useState<ToneMode>("professional");
    const [sections, setSections] = useState<string[]>([
        "bio", "experience", "education", "skills", "projects", "testimonials", "social"
    ]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [cvHtml, setCvHtml] = useState<string | null>(null);

    // Store hooks - get the actions and state
    const fetchProfile = useProfileStore((state) => state.fetchProfile);
    const profile = useProfileStore((state) => state.profile);

    const fetchProjects = useProjectStore((state) => state.fetchProjects);
    const projects = useProjectStore((state) => state.projects);

    const fetchTestimonials = useTestimonialStore((state) => state.fetchTestimonials);
    const testimonials = useTestimonialStore((state) => state.testimonials);

    const handleGenerate = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Step 1: Fetch all required data in parallel
            const fetchPromises: Promise<any>[] = [];

            // Always fetch profile first
            fetchPromises.push(fetchProfile());

            // Fetch projects if needed
            if (sections.includes("projects")) {
                const mode = COMPLEXITY_MODES.find((m) => m.id === complexity);

                if (mode?.projectStrategy === "featured") {
                    // Fetch featured projects
                    fetchPromises.push(
                        useProjectStore.getState().fetchProjects(undefined, 1, 50)
                    );
                } else if (mode?.projectStrategy === "page") {
                    fetchPromises.push(
                        useProjectStore.getState().fetchProjects(undefined, 1, 10)
                    );
                } else {
                    // Fetch all projects
                    fetchPromises.push(
                        useProjectStore.getState().fetchProjects(undefined, 1, 100)
                    );
                }
            }

            // Fetch testimonials if needed
            if (sections.includes("testimonials")) {
                const mode = COMPLEXITY_MODES.find((m) => m.id === complexity);
                if (mode && mode.maxTestimonials > 0) {
                    fetchPromises.push(
                        useTestimonialStore.getState().fetchTestimonials({
                            featured: true,
                            page: 1,
                            limit: 50
                        })
                    );
                }
            }

            // Wait for all fetches to complete
            await Promise.all(fetchPromises);

            // Step 2: Get the current state after fetches complete
            const currentProfile = useProfileStore.getState().profile;
            const currentProjects = useProjectStore.getState().projects;
            const currentTestimonials = useTestimonialStore.getState().testimonials;

            // Step 3: Validate we have the required data
            if (!currentProfile) {
                throw new Error("No profile found. Please set up your profile first.");
            }

            // Step 4: Filter projects based on strategy
            let filteredProjects = currentProjects;
            if (sections.includes("projects")) {
                const mode = COMPLEXITY_MODES.find((m) => m.id === complexity);

                if (mode?.projectStrategy === "featured") {
                    filteredProjects = currentProjects.filter(p => p.featured);
                }
                // For "page" and "all" strategies, use all fetched projects
            } else {
                filteredProjects = [];
            }

            // Step 5: Filter testimonials based on max count
            let filteredTestimonials = currentTestimonials;
            if (sections.includes("testimonials")) {
                const mode = COMPLEXITY_MODES.find((m) => m.id === complexity);
                if (mode?.maxTestimonials) {
                    filteredTestimonials = currentTestimonials.slice(0, mode.maxTestimonials);
                }
            } else {
                filteredTestimonials = [];
            }

            // Step 6: Generate the CV HTML
            const html = buildCVHtml({
                profile: currentProfile,
                projects: filteredProjects,
                testimonials: filteredTestimonials,
                config: complexity,
                tone,
                sections,
            });

            setCvHtml(html);
            setStep("preview");

        } catch (e: any) {
            console.error("CV Generation Error:", e);
            setError(e.message || "Failed to generate CV. Please try again.");
        } finally {
            setLoading(false);
        }
    }, [complexity, tone, sections, fetchProfile, fetchProjects, fetchTestimonials]);

    const handleReconfigure = useCallback(() => {
        setStep("config");
        setCvHtml(null);
        setError(null);
    }, []);

    if (step === "config") {
        return (
            <CVConfig
                complexity={complexity}
                tone={tone}
                sections={sections}
                loading={loading}
                error={error}
                onComplexityChange={setComplexity}
                onToneChange={setTone}
                onSectionsChange={setSections}
                onGenerate={handleGenerate}
            />
        );
    }

    return (
        <CVPreview
            cvHtml={cvHtml}
            complexity={complexity}
            tone={tone}
            sections={sections}
            error={error}
            onReconfigure={handleReconfigure}
            profileName={profile?.name}
        />
    );
}