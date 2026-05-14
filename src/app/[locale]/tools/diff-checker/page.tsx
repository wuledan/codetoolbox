"use client";

"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { diffLines } from "diff";

interface DiffRow {
  type: "same" | "added" | "removed";
  left: string;
  right: string;
}

function computeDiff(left: string, right: string): DiffRow[] {
  if (!left && !right) return [];
  const changes = diffLines(left, right);
  const rows: DiffRow[] = [];
  for (const part of changes) {
    const lines = part.value.replace(/\n$/, "").split("\n");
    if (part.added) {
      for (const line of lines) rows.push({ type: "added", left: "", right: line });
    } else if (part.removed) {
      for (const line of lines) rows.push({ type: "removed", left: line, right: "" });
    } else {
      for (const line of lines) rows.push({ type: "same", left: line, right: line });
    }
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
      <div className="grid gap-4 mb-4 lg:grid-cols-2">
        <textarea value={leftText} onChange={(e) => setLeftText(e.target.value)} placeholder={t("original")} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "250px" }} spellCheck={false} />
        <textarea value={rightText} onChange={(e) => setRightText(e.target.value)} placeholder={t("modified")} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "250px" }} spellCheck={false} />
      </div>
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
                    <td className={`px-3 py-0.5`}><pre className="whitespace-pre-wrap">{row.type === "removed" ? `- ${row.left}` : row.type === "added" ? `+ ${row.right}` : `  ${row.left}`}</pre></td>
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
