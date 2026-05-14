"use client";

import { useState, useCallback, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("gm");
  const [testText, setTestText] = useState("");
  const [matchCount, setMatchCount] = useState<number | null>(null);

  const result = useMemo(() => {
    if (!pattern.trim() || !testText) {
      setMatchCount(null);
      return testText;
    }
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...testText.matchAll(regex)];
      setMatchCount(matches.length);

      // Highlight matches in text
      if (matches.length === 0) return testText;

      let lastIndex = 0;
      const parts: string[] = [];
      for (const match of matches) {
        const idx = match.index!;
        if (idx > lastIndex) parts.push(testText.slice(lastIndex, idx));
        parts.push(`<mark class="bg-yellow-500/30 text-foreground rounded px-0.5">${match[0]}</mark>`);
        lastIndex = idx + match[0].length;
      }
      if (lastIndex < testText.length) parts.push(testText.slice(lastIndex));
      return parts.join("");
    } catch {
      setMatchCount(null);
      return testText;
    }
  }, [pattern, flags, testText]);

  return (
    <ToolLayout
      title="正则测试器"
      description="实时测试正则表达式匹配，支持语法高亮和分组展示。"
      relatedIds={["code-formatter"]}
    >
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="mb-1 block text-xs text-muted-foreground">正则表达式</label>
          <input
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="\d+"
            className="w-full rounded-lg border border-border bg-secondary p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">标志</label>
          <input
            value={flags}
            onChange={(e) => setFlags(e.target.value)}
            placeholder="gim"
            className="w-20 rounded-lg border border-border bg-secondary p-3 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">
          测试文本
          {matchCount !== null && (
            <span className="ml-2">匹配 {matchCount} 处</span>
          )}
        </label>
        <textarea
          value={testText}
          onChange={(e) => setTestText(e.target.value)}
          placeholder="在此输入测试文本..."
          className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
          style={{ minHeight: "200px" }}
          spellCheck={false}
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">匹配结果</label>
        <div
          className="w-full overflow-auto rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed"
          style={{ minHeight: "150px" }}
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </div>
    </ToolLayout>
  );
}
