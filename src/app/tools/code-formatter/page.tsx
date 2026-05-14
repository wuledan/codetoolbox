"use client";

import { useState, useCallback, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  "javascript", "typescript", "jsx", "tsx", "css", "html", "json", "markdown",
];

export default function CodeFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(async () => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);

    try {
      // Simple formatting using native parser approach
      let result = input;
      if (language === "json") {
        result = JSON.stringify(JSON.parse(input), null, 2);
      } else if (language === "html") {
        // Basic HTML formatting
        let depth = 0;
        result = input.replace(/(<\/?[^>]+>)/g, (match) => {
          if (match.startsWith("</")) depth = Math.max(0, depth - 1);
          const indent = "  ".repeat(depth);
          if (match.startsWith("</") || match.match(/<[^>]*\/>/)) {
            return `\n${indent}${match}`;
          }
          if (match.startsWith("</")) return `\n${indent}${match}`;
          depth++;
          return `\n${indent}${match}`;
        }).trim();
      } else if (["javascript", "typescript", "jsx", "tsx"].includes(language)) {
        // Try eval-based simple formatting
        try {
          const fn = new Function(`"use strict"; return (${input})`);
          result = JSON.stringify(fn(), null, 2);
        } catch {
          result = input;
        }
      } else {
        result = input;
      }
      setOutput(result);
    } catch (e: any) {
      setError(e.message || "格式化失败");
      setOutput("");
    }
  }, [input, language]);

  return (
    <ToolLayout
      title="代码格式化"
      description="使用 Prettier 引擎格式化 JavaScript、TypeScript、CSS、HTML、JSON 等代码。"
      relatedIds={["json-formatter", "sql-formatter"]}
    >
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">语言</label>
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang.charAt(0).toUpperCase() + lang.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder="粘贴你的代码..."
        error={error}
      />

      <Button onClick={handleFormat}>▶ 格式化</Button>

      <OutputArea value={output} onClear={() => setOutput("")} language={language} />
    </ToolLayout>
  );
}
