"use client";

import { useState, useCallback, useRef } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Mode = "text-encode" | "text-decode" | "image-encode";

export default function Base64Page() {
  const t = useTranslations("base64");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("text-encode");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    if (!input.trim()) { setOutput(""); return; }
    try {
      if (mode === "text-encode") setOutput(btoa(input));
      else if (mode === "text-decode") setOutput(atob(input));
      else setOutput(input);
    } catch { setError(t("error")); setOutput(""); }
  }, [input, mode, t]);

  const handleImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setInput(reader.result as string); setOutput(reader.result as string); };
    reader.readAsDataURL(file);
  }, []);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["url-encode", "html-escape"]}>
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "text-encode" ? "default" : "outline"} size="sm" onClick={() => setMode("text-encode")}>{t("textToBase64")}</Button>
        <Button variant={mode === "text-decode" ? "default" : "outline"} size="sm" onClick={() => setMode("text-decode")}>{t("base64ToText")}</Button>
        <Button variant={mode === "image-encode" ? "default" : "outline"} size="sm" onClick={() => setMode("image-encode")}>{t("imageToBase64")}</Button>
      </div>
      {mode === "image-encode" && (
        <div className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-muted-foreground/50" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">{t("clickToSelect")}</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
        </div>
      )}
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={mode === "text-encode" ? t("placeholder") : t("placeholderDecode")} error={error} />
      {mode !== "image-encode" && <Button onClick={handleConvert}>{t("convert")}</Button>}
      <OutputArea value={output} onClear={() => { setOutput(""); setInput(""); }} />
    </ToolLayout>
  );
}
