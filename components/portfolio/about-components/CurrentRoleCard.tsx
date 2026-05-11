import { motion } from "framer-motion";
import { Card } from "./Card";
import { CardTitle } from "./CardTitle";
import CloudinaryImage from "@/components/ui/CloudinaryImage";

// Update interface to accept null values
interface Experience {
    company: string;
    role: string;
    startDate: Date | string;
    current?: boolean;
    companyLogo?: string | null;  // Accept null
}

interface CurrentRoleCardProps {
    currentJob: Experience;
}

function formatDate(date: Date | string) {
    return new Date(date).toLocaleDateString("en", { month: "short", year: "numeric" });
}

export function CurrentRoleCard({ currentJob }: CurrentRoleCardProps) {
    return (
        <Card delay={0.2}>
            <CardTitle>Currently</CardTitle>
            <motion.div
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {/* Company logo or fallback icon */}
                <div
                    className="w-9 h-9 rounded-lg shrink-0 flex items-center justify-center overflow-hidden"
                    style={{
                        background: "var(--bg-primary)",
                        border: "0.5px solid var(--border-light)",
                    }}
                >
                    {currentJob.companyLogo ? (
                        <CloudinaryImage
                            src={currentJob.companyLogo}
                            alt={currentJob.company}
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <i
                            className="ti ti-building text-base"
                            style={{ color: "var(--text-muted)" }}
                            aria-hidden="true"
                        />
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {currentJob.role}
                    </p>
                    <p
                        className="text-xs truncate"
                        style={{ color: "var(--text-muted)" }}
                    >
                        {currentJob.company} · {formatDate(currentJob.startDate)} – Present
                    </p>
                </div>

                {/* Current badge */}
                <motion.span
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0"
                    style={{
                        background: "var(--success-50)",
                        color: "var(--success-700)",
                        border: "0.5px solid var(--success-500)",
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                    <span
                        className="w-1 h-1 rounded-full"
                        style={{ background: "var(--success-500)" }}
                    />
                    Current
                </motion.span>
            </motion.div>
        </Card>
    );
}