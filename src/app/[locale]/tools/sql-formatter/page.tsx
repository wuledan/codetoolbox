"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import { format } from "sql-formatter";

const DIALECTS = ["mysql", "postgresql", "sqlite", "bigquery", "snowflake", "tsql", "plsql"];

export default function SqlFormatterPage() {
  const t = useTranslations("sqlFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState("mysql");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    try { setOutput(format(input, { language: dialect as any, tabWidth: indent })); setError(null); }
    catch (e: any) { setError(e.message); setOutput(""); }
  }, [input, dialect, indent]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["code-formatter", "json-formatter"]}>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("dialect")}</label>
          <select value={dialect} onChange={(e) => setDialect(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            {DIALECTS.map((d) => (<option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("indent")}</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
            <option value={2}>2</option><option value={4}>4</option>
          </select>
        </div>
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={t("placeholder")} error={error} />
      <Button onClick={handleFormat}>{t("format")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
