"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import OutputButtons from "@/components/tools/OutputButtons";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/tools/FileDropZone";

export default function JsonFormatterPage() {
  const t = useTranslations("jsonFormatter");
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [outputSize, setOutputSize] = useState("");

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setError(null); setOutput(""); setOutputSize(""); return; }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, sortKeys ? Object.keys(parsed).sort() : null, indent);
      setOutput(formatted);
      setOutputSize(`${(new Blob([formatted]).size / 1024).toFixed(1)}KB`);
      setError(null);
    } catch (e: any) {
      setError(e.message || t("invalid"));
      setOutput(""); setOutputSize("");
    }
  }, [input, indent, sortKeys, t]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setOutputSize(`${(new Blob([JSON.stringify(parsed)]).size / 1024).toFixed(1)}KB`);
      setError(null);
    } catch (e: any) { setError(e.message); }
  }, [input]);

  const handleFile = useCallback((content: string) => setInput(content), []);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["yaml-json", "json-csv"]}>
      <FileDropZone onFile={handleFile} accept=".json" label={t("dropFile")} />
      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          {t("indent")}
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded border border-border bg-card px-2 py-1 text-xs">
            <option value={2}>2 {t("spaces")}</option>
            <option value={4}>4 {t("spaces")}</option>
            <option value={8}>8 {t("spaces")}</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input type="checkbox" checked={sortKeys} onChange={(e) => setSortKeys(e.target.checked)} />
          {t("sortKeys")}
        </label>
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={t("placeholder")} error={error} />
      <div className="flex gap-2">
        <Button onClick={handleFormat}>{t("format")}</Button>
        <Button variant="outline" onClick={handleMinify}>{t("minify")}</Button>
      </div>
      <OutputArea value={output} label={`${t("output")} ${outputSize ? `(${outputSize})` : ""}`} onClear={() => { setOutput(""); setOutputSize(""); }} status={output && !error ? t("valid") : null} statusType="success" />
    </ToolLayout>
  );
}
