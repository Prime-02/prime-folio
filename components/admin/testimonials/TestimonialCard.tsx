"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import Avatar from "@/components/ui/Avatar";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { StarRating } from "@/components/portfolio/testimonials-components";

interface Testimonial {
    id: string;
    name: string;
    role?: string | null;
    company?: string | null;
    avatar?: string | null;
    content: string;
    rating: number;
    approved: boolean;
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

interface TestimonialCardProps {
    testimonial: Testimonial;
    onApprove: (id: string) => void;
    onFeature: (id: string, featured: boolean) => void;
    onDelete: (id: string) => void;
}

function formatDate(date: Date | string): string {
    return new Date(date).toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export default function TestimonialCard({
    testimonial,
    onApprove,
    onFeature,
    onDelete,
}: TestimonialCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <Card padding="md" hover>
                <div className="space-y-4">
                    {/* Header with status badges */}
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                            <Avatar
                                src={testimonial.avatar}
                                name={testimonial.name}
                                size="md"
                            />
                            <div className="min-w-0">
                                <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                    {testimonial.name}
                                </p>
                                {(testimonial.role || testimonial.company) && (
                                    <p className="text-xs text-[var(--text-muted)] truncate">
                                        {[testimonial.role, testimonial.company]
                                            .filter(Boolean)
                                            .join(" at ")}
                                    </p>
                                )}
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    {formatDate(testimonial.createdAt)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                            {testimonial.approved ? (
                                <Badge variant="success" size="sm" dot>
                                    Approved
                                </Badge>
                            ) : (
                                <Badge variant="warning" size="sm" dot>
                                    Pending
                                </Badge>
                            )}
                            {testimonial.featured && (
                                <Badge variant="info" size="sm">
                                    Featured
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <StarRating rating={testimonial.rating} size="sm" />
                    </div>

                    {/* Content */}
                    <p
                        className="text-sm leading-relaxed line-clamp-3"
                        style={{ color: "var(--text-secondary)" }}
                    >
                        &ldquo;{testimonial.content}&rdquo;
                    </p>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-2 border-t border-[var(--border-light)]">
                        {!testimonial.approved && (
                            <Button
                                variant="success"
                                size="xs"
                                onClick={() => onApprove(testimonial.id)}
                                leftIcon={<CheckCircle size={14} />}
                            >
                                Approve
                            </Button>
                        )}
                        <Button
                            variant={testimonial.featured ? "warning" : "outline"}
                            size="xs"
                            onClick={() => onFeature(testimonial.id, !testimonial.featured)}
                            leftIcon={<Star size={14} />}
                        >
                            {testimonial.featured ? "Unfeature" : "Feature"}
                        </Button>
                        <Button
                            variant="danger"
                            size="xs"
                            onClick={() => onDelete(testimonial.id)}
                            leftIcon={<Trash2 size={14} />}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
}