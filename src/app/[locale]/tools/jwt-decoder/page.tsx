"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

export default function JwtDecoderPage() {
  const t = useTranslations("jwtDecoder");
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null); setHeader(""); setPayload(""); setSignature("");
    if (!input.trim()) return;
    const parts = input.trim().split(".");
    if (parts.length !== 3) { setError(t("invalidToken")); return; }
    try {
      const decode = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        return JSON.parse(atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")));
      };
      setHeader(JSON.stringify(decode(parts[0]), null, 2));
      setPayload(JSON.stringify(decode(parts[1]), null, 2));
      setSignature(parts[2]);
    } catch { setError("Decode failed"); }
  }, [input, t]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["base64-encode"]}>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={t("placeholder")} error={error} />
      <Button onClick={handleDecode}>{t("decode")}</Button>
      {header && (
        <div className="space-y-4 mt-4">
          {[{ label: t("header"), value: header }, { label: t("payload"), value: payload }, { label: t("signature"), value: signature }].map((s) => (
            <div key={s.label}>
              <h3 className="mb-2 text-xs font-medium text-muted-foreground">{s.label}</h3>
              <pre className="rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed overflow-auto"><code>{s.value}</code></pre>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
