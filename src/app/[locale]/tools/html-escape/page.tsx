"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

const ENTITY_MAP: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const REVERSE_MAP: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&#x27;": "'" };

export default function HtmlEscapePage() {
  const t = useTranslations("htmlEscape");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["url-encode", "base64-encode"]}>
      <div className="flex gap-2">
        <Button variant={mode === "escape" ? "default" : "outline"} size="sm" onClick={() => setMode("escape")}>{t("escape")}</Button>
        <Button variant={mode === "unescape" ? "default" : "outline"} size="sm" onClick={() => setMode("unescape")}>{t("unescape")}</Button>
      </div>
      <InputArea value={input} onChange={setInput} placeholder={mode === "escape" ? t("placeholderEscape") : t("placeholderUnescape")} />
      <Button onClick={() => { if (!input.trim()) { setOutput(""); return; } setOutput(mode === "escape" ? input.replace(/[&<>"']/g, (c) => ENTITY_MAP[c] || c) : input.replace(/&(?:amp|lt|gt|quot|#39|#x27);/g, (m) => REVERSE_MAP[m] || m)); }}>{t("convert")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
