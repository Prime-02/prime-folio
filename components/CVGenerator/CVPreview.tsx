// components/CVGenerator/CVPreview.tsx (Fixed DOCX Export)
import { useRef, useState } from "react";
import type { CVPreviewProps, ToneMode } from "./types";
import { COMPLEXITY_MODES } from "./constants";
import { generateDocx } from "./docxGenerator";

export default function CVPreview({
  cvHtml,
  complexity,
  tone,
  sections,
  error,
  onReconfigure,
  profileName,
}: CVPreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadType, setDownloadType] = useState<string | null>(null);

  const handleDownloadPDF = () => {
    if (!iframeRef.current) return;
    const iframeWindow = iframeRef.current.contentWindow;
    if (iframeWindow) {
      iframeWindow.focus();
      iframeWindow.print();
    }
  };

  const handleDownloadDocx = async () => {
    if (!cvHtml) return;
    
    setDownloading(true);
    setDownloadType("docx");
    
    try {
      // Use the proper DOCX generator
      await generateDocx(cvHtml, profileName || "CV");
    } catch (error) {
      console.error("DOCX download failed:", error);
      // Fallback to .doc if docx generation fails
      const printHtml = cvHtml
        .replace('<style>', `<style>
          @media print {
            body { 
              -webkit-print-color-adjust: exact !important; 
              print-color-adjust: exact !important;
            }
          }
        </style>`);
      
      const blob = new Blob(['\ufeff' + printHtml], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${profileName?.replace(/\s+/g, "_") || "CV"}_CV.doc`;
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } finally {
      setDownloading(false);
      setDownloadType(null);
    }
  };

    const modeLabel = COMPLEXITY_MODES.find((m) => m.id === complexity)?.label;

    return (
        <div className="flex flex-col h-full">
            {/* Toolbar */}
            <div
                className="flex items-center justify-between px-4 py-3 border-b flex-wrap gap-3 sticky top-0 z-10"
                style={{
                    background: "var(--bg-primary)",
                    borderColor: "var(--border-color)"
                }}
            >
                <div className="flex items-center gap-3">
                    <button
                        onClick={onReconfigure}
                        className="btn btn-ghost btn-sm"
                    >
                        <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
                        Reconfigure
                    </button>
                    <div className="hidden sm:flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{modeLabel}</span>
                        <span style={{ color: "var(--text-muted)" }}>·</span>
                        <span className="capitalize">{tone}</span>
                        <span style={{ color: "var(--text-muted)" }}>·</span>
                        <span>{sections.length} sections</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleDownloadPDF}
                        className="btn btn-outline btn-sm"
                    >
                        <i className="ti ti-printer" style={{ fontSize: 14 }} />
                        Save as PDF
                    </button>

                    <button
                        onClick={handleDownloadDocx}
                        disabled={downloading}
                        className="btn btn-primary btn-sm"
                        style={{ opacity: downloading ? 0.6 : 1 }}
                    >
                        <i
                            className={`ti ${downloading && downloadType === "docx" ? "ti-loader-2 animate-spin" : "ti-file-word"}`}
                            style={{ fontSize: 14 }}
                        />
                        {downloading && downloadType === "docx" ? "Exporting…" : "Download DOCX"}
                    </button>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div
                    className="flex items-center gap-3 px-4 py-3 text-sm"
                    style={{
                        background: "var(--error-50)",
                        color: "var(--error-700)",
                        borderBottom: "1px solid var(--error-200)"
                    }}
                >
                    <i className="ti ti-alert-circle flex-shrink-0" style={{ fontSize: 16 }} />
                    <span>{error}</span>
                </div>
            )}

            {/* Preview Area */}
            <div
                className="flex-1 p-4 md:p-6 flex justify-center"
                style={{ background: "var(--bg-tertiary)" }}
            >
                {cvHtml ? (
                    <iframe
                        ref={iframeRef}
                        srcDoc={cvHtml}
                        title="CV Preview"
                        className="w-full max-w-4xl border-0 rounded-lg"
                        style={{
                            minHeight: 900,
                            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                            background: "#ffffff",
                        }}
                        onLoad={(e) => {
                            try {
                                const iframe = e.target as HTMLIFrameElement;
                                const doc = iframe.contentDocument || iframe.contentWindow?.document;
                                if (doc) {
                                    const height = Math.max(
                                        doc.body.scrollHeight,
                                        doc.documentElement.scrollHeight,
                                        doc.body.offsetHeight,
                                        doc.documentElement.offsetHeight
                                    );
                                    iframe.style.height = height + "px";
                                }
                            } catch {
                                // Cross-origin issues are ignored
                            }
                        }}
                    />
                ) : (
                    <EmptyState onReconfigure={onReconfigure} />
                )}
            </div>

            {/* Animation styles */}
            <style>{`
        @keyframes spin { 
          to { transform: rotate(360deg); } 
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
        </div>
    );
}

// ── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onReconfigure }: { onReconfigure: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md">
            <i
                className="ti ti-file-off mb-6 opacity-30"
                style={{ fontSize: 64, color: "var(--text-muted)" }}
            />
            <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--text-primary)" }}
            >
                No CV Generated Yet
            </h3>
            <p
                className="text-sm mb-6 leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
            >
                Click "Reconfigure" to adjust your CV settings, then click "Generate CV" to create your preview.
            </p>
            <button
                onClick={onReconfigure}
                className="btn btn-primary btn-md"
            >
                <i className="ti ti-arrow-left" style={{ fontSize: 14 }} />
                Go to Configuration
            </button>
        </div>
    );
}