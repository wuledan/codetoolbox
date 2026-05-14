"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

export default function UrlEncodePage() {
  const t = useTranslations("urlEncode");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState(true);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    try {
      setOutput(mode === "encode" ? (component ? encodeURIComponent(input) : encodeURI(input)) : (component ? decodeURIComponent(input) : decodeURI(input)));
    } catch { setOutput("Decode failed"); }
  }, [input, mode, component]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["base64-encode", "html-escape"]}>
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "encode" ? "default" : "outline"} size="sm" onClick={() => setMode("encode")}>{t("encode")}</Button>
        <Button variant={mode === "decode" ? "default" : "outline"} size="sm" onClick={() => setMode("decode")}>{t("decode")}</Button>
      </div>
      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={component} onChange={(e) => setComponent(e.target.checked)} />
        {t("componentMode")}
      </label>
      <InputArea value={input} onChange={setInput} placeholder={mode === "encode" ? t("placeholderEncode") : t("placeholderDecode")} />
      <Button onClick={handleConvert}>{t("convert")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
