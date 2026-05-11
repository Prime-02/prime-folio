import Avatar from "@/components/ui/Avatar";
import { motion } from "framer-motion";
import { scaleIn } from "./animations";

interface HeroPhotoProps {
    profilePhoto?: string;
    name: string;
}

export function HeroPhoto({ profilePhoto, name }: HeroPhotoProps) {
    return (
        <motion.div
            className="rounded-full p-1 flex-shrink-0"
            style={{ border: "2px solid var(--border-color)" }}
            variants={scaleIn}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
        >
            <Avatar
                src={profilePhoto}
                name={name}
                size="2xl"
                className="w-40 h-40 sm:w-52 sm:h-52"
            />
        </motion.div>
    );
}