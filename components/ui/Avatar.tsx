// components/ui/Avatar.tsx
import CloudinaryImage from "./CloudinaryImage";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  src?: string | null;
  name?: string;
  size?: AvatarSize;
  className?: string;
  ring?: boolean;
}

const sizeMap: Record<AvatarSize, { px: number; class: string; text: string }> = {
  xs: { px: 24, class: "w-6 h-6", text: "text-xs" },
  sm: { px: 32, class: "w-8 h-8", text: "text-xs" },
  md: { px: 40, class: "w-10 h-10", text: "text-sm" },
  lg: { px: 56, class: "w-14 h-14", text: "text-base" },
  xl: { px: 80, class: "w-20 h-20", text: "text-xl" },
  "2xl": { px: 112, class: "w-28 h-28", text: "text-2xl" },
};

function initials(name?: string): string {
  if (!name) return "?";
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function Avatar({
  src,
  name,
  size = "md",
  className = "",
  ring = false,
}: AvatarProps) {
  const s = sizeMap[size];

  const base = [
    "relative inline-flex items-center justify-center rounded-full overflow-hidden shrink-0",
    "bg-[var(--bg-tertiary)] text-[var(--text-secondary)] font-semibold select-none",
    s.class,
    s.text,
    ring
      ? "ring-2 ring-[var(--primary-500)] ring-offset-2 ring-offset-[var(--bg-primary)]"
      : "",
    className,
  ].join(" ");

  // Prepare Cloudinary URL if needed
  const cloudinarySrc = src?.startsWith("http") ? null : src;
  const externalSrc = src?.startsWith("http") ? src : null;

  // Calculate optimal image size (2x for retina, 3x for super retina)
  const OPTIMAL_DPI_SCALE = 3; // Use 3x to cover most modern displays
  const imageSize = s.px * OPTIMAL_DPI_SCALE;

  return (
    <div className={base}>
      {src ? (
        externalSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={externalSrc}
            alt={name ?? "Avatar"}
            className="w-full h-full object-cover"
          />
        ) : (
          <CloudinaryImage
            src={cloudinarySrc}
            alt={name ?? "Avatar"}
            fill
            className="object-cover"
            cloudinaryOptions={{
              width: imageSize,
              height: imageSize,
              quality: 80,
              crop: "fill",
              gravity: "auto", // or "face" for better face detection
            }}
          />
        )
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  );
}

// ── Avatar Group ──────────────────────────────────────────────────────────────
interface AvatarGroupProps {
  avatars: Array<{ src?: string | null; name?: string }>;
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ avatars, max = 4, size = "sm" }: AvatarGroupProps) {
  const visible = avatars.slice(0, max);
  const overflow = avatars.length - max;

  return (
    <div className="flex -space-x-2">
      {visible.map((a, i) => (
        <Avatar key={i} src={a.src} name={a.name} size={size} ring />
      ))}
      {overflow > 0 && (
        <div
          className={[
            sizeMap[size].class,
            sizeMap[size].text,
            "relative inline-flex items-center justify-center rounded-full",
            "bg-[var(--bg-tertiary)] text-[var(--text-muted)] font-semibold",
            "ring-2 ring-[var(--bg-primary)]",
          ].join(" ")}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}