// components/ui/CloudinaryImage.tsx
import Image, { ImageProps } from "next/image";
import { resolveImageUrl } from "@/lib/cloudinary/helpers";

// Match the exact type expected by your resolveImageUrl function
interface CloudinaryImageOptions {
    width?: number;
    height?: number;
    crop?: "fill" | "fit" | "scale" | "thumb" | "crop";
    quality?: number | "auto";
    format?: "auto" | "webp" | "jpg" | "png" | "avif";
    gravity?: "auto" | "face" | "center";
}

interface CloudinaryImageProps extends Omit<ImageProps, "src" | "alt"> {
    src: string | null | undefined;
    alt: string;
    cloudinaryOptions?: CloudinaryImageOptions;
}

export default function CloudinaryImage({
    src,
    alt,
    cloudinaryOptions,
    width,
    height,
    fill,
    ...imageProps
}: CloudinaryImageProps) {
    // Handle invalid or missing src
    if (!src) {
        if (fill) {
            return <div className="bg-[var(--bg-tertiary)] w-full h-full" aria-label={alt} />;
        }
        return (
            <div
                style={{ width: width || 100, height: height || 100 }}
                className="bg-[var(--bg-tertiary)]"
                aria-label={alt}
            />
        );
    }

    // Resolve the URL
    const resolvedUrl = src.startsWith("http")
        ? src
        : resolveImageUrl(src, cloudinaryOptions);

    // For fill mode, width/height are optional
    const resolvedWidth = fill ? undefined : width || 800;
    const resolvedHeight = fill ? undefined : height || 600;

    return (
        <Image
            src={resolvedUrl}
            alt={alt}
            width={resolvedWidth}
            height={resolvedHeight}
            fill={fill}
            unoptimized={src.startsWith("http")} // Skip optimization for external URLs
            {...imageProps}
        />
    );
}