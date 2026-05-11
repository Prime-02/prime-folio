// components/CVGenerator/CVConfig.tsx (Improved UI)
import type { CVConfigProps, ComplexityMode, ToneMode } from "./types";
import { COMPLEXITY_MODES, TONES, ALL_SECTIONS } from "./constants";

export default function CVConfig({
  complexity,
  tone,
  sections,
  loading,
  error,
  onComplexityChange,
  onToneChange,
  onSectionsChange,
  onGenerate,
}: CVConfigProps) {
  const toggleSection = (id: string) => {
    onSectionsChange(
      sections.includes(id)
        ? sections.filter((s) => s !== id)
        : [...sections, id]
    );
  };

  const selectedMode = COMPLEXITY_MODES.find((m) => m.id === complexity);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-Montserrat text-2xl md:text-3xl font-bold mb-2" style={{ color: "var(--text-primary)" }}>
          Generate CV
        </h1>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Configure your CV options below — then preview and download.
        </p>
      </div>

      {/* Complexity Level */}
      <CVComplexitySelector
        complexity={complexity}
        onChange={onComplexityChange}
      />

      {/* Tone / Style */}
      <CVToneSelector
        tone={tone}
        onChange={onToneChange}
      />

      {/* Sections */}
      <CVSectionSelector
        sections={sections}
        onToggle={toggleSection}
        isCustom={complexity === "custom"}
      />

      {/* Error Message */}
      {error && (
        <div
          className="flex items-center gap-3 p-4 rounded-lg mb-6 text-sm"
          style={{
            background: "var(--error-50)",
            color: "var(--error-700)",
            border: "1px solid var(--error-200)"
          }}
        >
          <i className="ti ti-alert-circle flex-shrink-0" style={{ fontSize: 18 }} />
          <span>{error}</span>
        </div>
      )}

      {/* Summary Card */}
      <CVSummary
        mode={selectedMode?.label}
        tone={tone}
        sectionCount={sections.length}
        isDetailed={complexity === "detailed"}
      />

      {/* Generate Button */}
      <button
        onClick={onGenerate}
        disabled={loading || sections.length === 0}
        className="btn btn-primary btn-lg w-full sm:w-auto"
        style={{
          minWidth: 200,
        }}
      >
        {loading ? (
          <>
            <i className="ti ti-loader-2 animate-spin" style={{ fontSize: 18 }} />
            Generating…
          </>
        ) : (
          <>
            <i className="ti ti-wand" style={{ fontSize: 18 }} />
            Generate CV
          </>
        )}
      </button>
    </div>
  );
}

// ── Complexity Selector ──────────────────────────────────────────────────────
function CVComplexitySelector({
  complexity,
  onChange
}: {
  complexity: ComplexityMode;
  onChange: (mode: ComplexityMode) => void
}) {
  return (
    <div className="mb-8">
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Complexity Level
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {COMPLEXITY_MODES.map((mode) => {
          const isActive = complexity === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id as ComplexityMode)}
              className="relative flex flex-col items-start gap-2 p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive ? "var(--primary-50)" : "var(--bg-primary)",
                border: isActive ? "2px solid var(--primary-500)" : "1px solid var(--border-color)",
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <div className="flex items-center gap-2 w-full">
                <i
                  className={`ti ${mode.icon}`}
                  style={{
                    fontSize: 16,
                    color: isActive ? "var(--primary-600)" : "var(--text-muted)"
                  }}
                />
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isActive ? "var(--primary-700)" : "var(--text-primary)"
                  }}
                >
                  {mode.label}
                </span>
                {isActive && (
                  <i
                    className="ti ti-check ml-auto"
                    style={{ fontSize: 14, color: "var(--primary-600)" }}
                  />
                )}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {mode.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Tone Selector ────────────────────────────────────────────────────────────
function CVToneSelector({
  tone,
  onChange
}: {
  tone: ToneMode;
  onChange: (tone: ToneMode) => void
}) {
  return (
    <div className="mb-8">
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Tone / Style
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {TONES.map((t) => {
          const isActive = tone === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChange(t.id as ToneMode)}
              className="relative p-4 rounded-xl text-left transition-all duration-200"
              style={{
                background: isActive ? "var(--primary-50)" : "var(--bg-primary)",
                border: isActive ? "2px solid var(--primary-500)" : "1px solid var(--border-color)",
                boxShadow: isActive ? "0 4px 12px rgba(0,0,0,0.08)" : "none",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: isActive ? "var(--primary-700)" : "var(--text-primary)"
                  }}
                >
                  {t.label}
                </span>
                {isActive && (
                  <i
                    className="ti ti-check"
                    style={{ fontSize: 14, color: "var(--primary-600)" }}
                  />
                )}
              </div>
              <p
                className="text-xs leading-relaxed"
                style={{ color: "var(--text-secondary)" }}
              >
                {t.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Section Toggle ───────────────────────────────────────────────────────────
function CVSectionSelector({
  sections,
  onToggle,
  isCustom
}: {
  sections: string[];
  onToggle: (id: string) => void;
  isCustom: boolean
}) {
  return (
    <div className="mb-8">
      <label
        className="block text-xs font-semibold uppercase tracking-wider mb-3"
        style={{ color: "var(--text-secondary)" }}
      >
        Sections
        {isCustom && (
          <span
            className="normal-case tracking-normal ml-2"
            style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: 11 }}
          >
            (toggle to include/exclude)
          </span>
        )}
      </label>
      <div className="flex flex-wrap gap-2">
        {ALL_SECTIONS.map((s) => {
          const active = sections.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm transition-all duration-200"
              style={{
                background: active ? "var(--bg-secondary)" : "transparent",
                border: active ? "1px solid var(--border-hover)" : "1px solid var(--border-light)",
                color: active ? "var(--text-primary)" : "var(--text-muted)",
                fontWeight: active ? 500 : 400,
              }}
            >
              <i className={`ti ${s.icon}`} style={{ fontSize: 14 }} />
              {s.label}
              {active && (
                <i
                  className="ti ti-check"
                  style={{ fontSize: 12, color: "var(--success-500)" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Summary Card ─────────────────────────────────────────────────────────────
function CVSummary({
  mode,
  tone,
  sectionCount,
  isDetailed
}: {
  mode?: string;
  tone: ToneMode;
  sectionCount: number;
  isDetailed: boolean
}) {
  return (
    <div
      className="p-4 rounded-xl mb-6 text-sm"
      style={{
        background: "var(--bg-secondary)",
        border: "1px solid var(--border-light)",
        color: "var(--text-secondary)"
      }}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span
          className="font-semibold"
          style={{ color: "var(--text-primary)" }}
        >
          {mode}
        </span>
        <span style={{ color: "var(--text-muted)" }}>·</span>
        <span className="capitalize">{tone} tone</span>
        <span style={{ color: "var(--text-muted)" }}>·</span>
        <span>
          {sectionCount} section{sectionCount !== 1 ? "s" : ""}
        </span>
        {isDetailed && (
          <span
            className="ml-2 font-medium"
            style={{ color: "var(--info-600)" }}
          >
            — all projects will be included
          </span>
        )}
      </div>
    </div>
  );
}