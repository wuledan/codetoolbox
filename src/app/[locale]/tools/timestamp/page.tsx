"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";

export default function TimestampPage() {
  const t = useTranslations("timestamp");
  const [input, setInput] = useState("");

  const results = useMemo(() => {
    if (!input.trim()) return null;
    const trim = input.trim();
    let date: Date | null = null;
    let detected = "";
    if (/^\d{8,10}$/.test(trim)) { date = new Date(Number(trim) * 1000); detected = "Unix Seconds"; }
    else if (/^\d{13}$/.test(trim)) { date = new Date(Number(trim)); detected = "Unix Milliseconds"; }
    else { date = new Date(trim); if (!isNaN(date.getTime())) detected = "Date String"; }
    if (!date || isNaN(date.getTime())) return null;
    return [
      { label: t("iso8601"), value: date.toISOString() },
      { label: t("utc"), value: date.toUTCString() },
      { label: t("local"), value: date.toLocaleString() },
      { label: t("unixSeconds"), value: String(Math.floor(date.getTime() / 1000)) },
      { label: t("unixMs"), value: String(date.getTime()) },
      { label: t("ymd"), value: date.toISOString().slice(0, 10) },
    ];
  }, [input, t]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["uuid-generator"]}>
      <p className="text-sm text-muted-foreground mb-2">{t("supported")}</p>
      <InputArea value={input} onChange={setInput} placeholder={t("placeholder")} minHeight="60px" />
      {results && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-2">
          {results.map((r) => (
            <div key={r.label} className="flex items-center justify-between rounded bg-secondary px-3 py-2">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <code className="font-mono text-xs">{r.value}</code>
            </div>
          ))}
        </div>
      )}
      {input.trim() && !results && <p className="text-xs text-red-500">⚠ {t("unrecognized")}</p>}
    </ToolLayout>
  );
}
