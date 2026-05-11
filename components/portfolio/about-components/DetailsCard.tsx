import { Card } from "./Card";
import { CardTitle } from "./CardTitle";
import { InfoRow } from "./InfoRow";
import { staggerContainer } from "./animations";
import { motion } from "framer-motion";

interface DetailsCardProps {
    location?: string;
    timezoneLabel?: string | null;
    availabilityNote?: string;
    availableForWork?: boolean;
}

export function DetailsCard({
    location,
    timezoneLabel,
    availabilityNote,
    availableForWork,
}: DetailsCardProps) {
    const hasContent = location || timezoneLabel || (availableForWork && availabilityNote);

    if (!hasContent) return null;

    return (
        <Card delay={0.1}>
            <CardTitle>Details</CardTitle>
            <motion.div
                style={{ marginTop: "-0.25rem" }}
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
            >
                {location && (
                    <InfoRow
                        icon="ti-map-pin"
                        label="Location"
                        value={location}
                    />
                )}
                {timezoneLabel && (
                    <InfoRow
                        icon="ti-clock"
                        label="Timezone"
                        value={timezoneLabel}
                    />
                )}
                {availableForWork && availabilityNote && (
                    <InfoRow
                        icon="ti-world"
                        label="Preference"
                        value={availabilityNote}
                    />
                )}
            </motion.div>
        </Card>
    );
}