"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

export default function JsonCsvPage() {
  const t = useTranslations("jsonCsv");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);
    try {
      if (direction === "json-to-csv") setOutput(Papa.unparse(JSON.parse(input), { delimiter }));
      else {
        const result = Papa.parse(input, { header: true, delimiter });
        if (result.errors.length > 0) { setError(result.errors[0].message); setOutput(""); return; }
        setOutput(JSON.stringify(result.data, null, 2));
      }
    } catch (e: any) { setError(e.message); setOutput(""); }
  }, [input, direction, delimiter]);

  const delimiters = [
    { value: ",", label: t("comma") },
    { value: ";", label: t("semicolon") },
    { value: "\t", label: t("tab") },
  ];

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["json-formatter", "yaml-json"]}>
      <div className="flex flex-wrap gap-2">
        <Button variant={direction === "json-to-csv" ? "default" : "outline"} size="sm" onClick={() => setDirection("json-to-csv")}>{t("jsonToCsv")}</Button>
        <Button variant={direction === "csv-to-json" ? "default" : "outline"} size="sm" onClick={() => setDirection("csv-to-json")}>{t("csvToJson")}</Button>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t("delimiter")}</label>
        <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {delimiters.map((d) => (<option key={d.value} value={d.value}>{d.label}</option>))}
        </select>
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={direction === "json-to-csv" ? t("placeholderJson") : t("placeholderCsv")} error={error} />
      <Button onClick={handleConvert}>{t("convert")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
