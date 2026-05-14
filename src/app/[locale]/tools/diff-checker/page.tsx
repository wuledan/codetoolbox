"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";

function computeDiff(left: string, right: string) {
  const lLines = left.split("\n"), rLines = right.split("\n");
  const maxLen = Math.max(lLines.length, rLines.length);
  const rows: { type: "same" | "added" | "removed"; left: string; right: string }[] = [];
  for (let i = 0; i < maxLen; i++) {
    const l = lLines[i] ?? "", r = rLines[i] ?? "";
    if (l === r) rows.push({ type: "same", left: l, right: r });
    else { rows.push({ type: "removed", left: l, right: "" }); rows.push({ type: "added", left: "", right: r }); }
  }
  return rows;
}

export default function DiffCheckerPage() {
  const t = useTranslations("diffChecker");
  const [leftText, setLeftText] = useState("");
  const [rightText, setRightText] = useState("");
  const [mode, setMode] = useState<"side-by-side" | "inline">("side-by-side");
  const diff = useMemo(() => computeDiff(leftText, rightText), [leftText, rightText]);
  const changes = diff.filter((r) => r.type !== "same").length;

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["markdown-preview"]}>
      <div className="flex gap-2 mb-2">
        <Button variant={mode === "side-by-side" ? "default" : "outline"} size="sm" onClick={() => setMode("side-by-side")}>{t("sideBySide")}</Button>
        <Button variant={mode === "inline" ? "default" : "outline"} size="sm" onClick={() => setMode("inline")}>{t("inline")}</Button>
        <Button variant="outline" size="sm" onClick={() => { setLeftText(""); setRightText(""); }}>{t("clear")}</Button>
      </div>
      {mode === "side-by-side" ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} placeholder={t("original")} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "250px" }} spellCheck={false} />
          <textarea value={rightText} onChange={(e) => setRightText(e.target.value)} placeholder={t("modified")} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "250px" }} spellCheck={false} />
        </div>
      ) : (
        <textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "200px" }} spellCheck={false} />
      )}
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t("diffCount", { lines: diff.length, changes })}</label>
        <div className="w-full overflow-auto rounded-lg border border-border font-mono text-sm leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {diff.map((row, i) => (
                <tr key={i} className={row.type === "added" ? "bg-green-500/10" : row.type === "removed" ? "bg-red-500/10" : ""}>
                  {mode === "side-by-side" ? (
                    <>
                      <td className={`border-r border-border px-3 py-0.5 ${row.type === "removed" ? "text-red-500" : ""}`}><pre className="whitespace-pre-wrap">{row.left}</pre></td>
                      <td className={`px-3 py-0.5 ${row.type === "added" ? "text-green-500" : ""}`}><pre className="whitespace-pre-wrap">{row.right}</pre></td>
                    </>
                  ) : (
                    <td className={`px-3 py-0.5 `}><pre className="whitespace-pre-wrap">{row.type === "removed" ? `- ${row.left}` : row.type === "added" ? `+ ${row.right}` : `  ${row.left}`}</pre></td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </ToolLayout>
  );
}
