"use client";

import { useState, useCallback, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import FileDropZone from "@/components/tools/FileDropZone";

export default function JsonFormatterPage() {
  const [input, setInput] = useState("");
  const [indent, setIndent] = useState(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [outputSize, setOutputSize] = useState("");

  const handleFormat = useCallback(() => {
    if (!input.trim()) {
      setError(null);
      setOutput("");
      setOutputSize("");
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(
        parsed,
        sortKeys ? Object.keys(parsed).sort() : null,
        indent
      );
      setOutput(formatted);
      setOutputSize(`${(new Blob([formatted]).size / 1024).toFixed(1)}KB`);
      setError(null);
    } catch (e: any) {
      setError(e.message || "JSON 格式无效");
      setOutput("");
      setOutputSize("");
    }
  }, [input, indent, sortKeys]);

  const handleMinify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setOutputSize(`${(new Blob([JSON.stringify(parsed)]).size / 1024).toFixed(1)}KB`);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  }, [input]);

  const handleFile = useCallback((content: string) => {
    setInput(content);
  }, []);

  return (
    <ToolLayout
      title="JSON 格式化器 & 校验器"
      description="格式化、美化、校验你的 JSON 数据，支持缩进配置和键排序。"
      relatedIds={["yaml-json", "json-csv"]}
    >
      <FileDropZone onFile={handleFile} accept=".json" label="拖放 JSON 文件到此处，或点击选择" />

      <div className="flex items-center gap-4 flex-wrap">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          缩进
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded border border-border bg-card px-2 py-1 text-xs"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
            <option value={8}>8 空格</option>
            <option value={0}>Tab</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            checked={sortKeys}
            onChange={(e) => setSortKeys(e.target.checked)}
          />
          排序键
        </label>
      </div>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder='{"name": "Alice", "age": 30}'
        error={error}
      />

      <div className="flex gap-2">
        <Button onClick={handleFormat}>▶ 格式化</Button>
        <Button variant="outline" onClick={handleMinify}>
          压缩
        </Button>
      </div>

      <OutputArea
        value={output}
        label={`输出 ${outputSize ? `(${outputSize})` : ""}`}
        onClear={() => { setOutput(""); setOutputSize(""); }}
        language="json"
        status={output && !error ? "JSON 有效" : null}
        statusType="success"
      />
    </ToolLayout>
  );
}
