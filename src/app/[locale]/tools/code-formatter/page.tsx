"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

const LANGUAGES = ["javascript", "typescript", "jsx", "tsx", "css", "html", "json", "markdown"];

export default function CodeFormatterPage() {
  const t = useTranslations("codeFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);
    try {
      let result = input;
      if (language === "json") result = JSON.stringify(JSON.parse(input), null, 2);
      else result = input;
      setOutput(result);
    } catch (e: any) { setError(e.message); setOutput(""); }
  }, [input, language]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["json-formatter", "sql-formatter"]}>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t("language")}</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
          ))}
        </select>
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={t("placeholder")} error={error} />
      <Button onClick={handleFormat}>{t("format")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
