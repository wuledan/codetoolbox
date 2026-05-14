"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";

export default function RegexTesterPage() {
  const t = useTranslations("regexTester");
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gm");
  const [testText, setTestText] = useState("");

  const matchCount = useMemo(() => {
    if (!pattern.trim() || !testText) return null;
    try { return [...testText.matchAll(new RegExp(pattern, flags))].length; }
    catch { return null; }
  }, [pattern, flags, testText]);

  const highlighted = useMemo(() => {
    if (!pattern.trim() || !testText) return testText;
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testText.matchAll(regex)];
      if (matches.length === 0) return testText;
      let last = 0;
      const parts: string[] = [];
      for (const m of matches) {
        const idx = m.index!;
        if (idx > last) parts.push(testText.slice(last, idx));
        parts.push(`<mark class="bg-yellow-500/30 text-foreground rounded px-0.5">${m[0]}</mark>`);
        last = idx + m[0].length;
      }
      if (last < testText.length) parts.push(testText.slice(last));
      return parts.join("");
    } catch { return testText; }
  }, [pattern, flags, testText]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["code-formatter"]}>
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-muted-foreground">{t("pattern")}</label>
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder={t("placeholder")} className="w-full rounded-lg border border-border bg-secondary p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("flags")}</label>
          <input value={flags} onChange={(e) => setFlags(e.target.value)} className="w-20 rounded-lg border border-border bg-secondary p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">
          {t("testText")} {matchCount !== null && `— ${t("matches", { count: matchCount })}`}
        </label>
        <textarea value={testText} onChange={(e) => setTestText(e.target.value)} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "200px" }} spellCheck={false} />
      </div>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t("result")}</label>
        <div className="w-full overflow-auto rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed" style={{ minHeight: "150px" }} dangerouslySetInnerHTML={{ __html: highlighted }} />
      </div>
    </ToolLayout>
  );
}
