// ── components/CVGenerator/types.ts ────────────────────────────────────────
export type ComplexityMode = "one-pager" | "standard" | "detailed" | "custom";
export type ToneMode = "professional" | "creative" | "minimal";

export interface CVConfigProps {
  complexity: ComplexityMode;
  tone: ToneMode;
  sections: string[];
  loading: boolean;
  error: string | null;
  onComplexityChange: (mode: ComplexityMode) => void;
  onToneChange: (tone: ToneMode) => void;
  onSectionsChange: (sections: string[]) => void;
  onGenerate: () => void;
}

export interface CVPreviewProps {
  cvHtml: string | null;
  complexity: ComplexityMode;
  tone: ToneMode;
  sections: string[];
  error: string | null;
  onReconfigure: () => void;
  profileName?: string;
}
