import { PreviewPane } from "@/components/ui/markdown/PreviewPane";

interface MarkdownRendererProps {
    content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
    return (
        <div className="prose prose-lg max-w-none">
            <PreviewPane markdown={content} />
        </div>
    );
}