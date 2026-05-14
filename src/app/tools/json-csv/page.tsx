"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import Papa from "papaparse";

export default function JsonCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"json-to-csv" | "csv-to-json">("json-to-csv");
  const [delimiter, setDelimiter] = useState(",");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);

    try {
      if (direction === "json-to-csv") {
        const parsed = JSON.parse(input);
        const csv = Papa.unparse(parsed, { delimiter });
        setOutput(csv);
      } else {
        const result = Papa.parse(input, { header: true, delimiter });
        if (result.errors.length > 0) {
          setError(result.errors[0].message);
          setOutput("");
          return;
        }
        setOutput(JSON.stringify(result.data, null, 2));
      }
    } catch (e: any) {
      setError(e.message || "转换失败");
      setOutput("");
    }
  }, [input, direction, delimiter]);

  return (
    <ToolLayout
      title="JSON ↔ CSV 互转"
      description="在 JSON 数组和 CSV 表格之间快速转换。"
      relatedIds={["json-formatter", "yaml-json"]}
    >
      <div className="flex flex-wrap gap-2">
        <Button
          variant={direction === "json-to-csv" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("json-to-csv")}
        >
          JSON → CSV
        </Button>
        <Button
          variant={direction === "csv-to-json" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("csv-to-json")}
        >
          CSV → JSON
        </Button>
      </div>

      <div>
        <label className="mb-1 block text-xs text-muted-foreground">分隔符</label>
        <select
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
          className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        >
          <option value=",">逗号 (,)</option>
          <option value=";">分号 (;)</option>
          <option value="\t">Tab</option>
        </select>
      </div>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder={
          direction === "json-to-csv"
            ? '[{"name": "Alice", "age": 30}, {"name": "Bob", "age": 25}]'
            : "name,age\nAlice,30\nBob,25"
        }
        error={error}
      />

      <Button onClick={handleConvert}>▶ 转换</Button>

      <OutputArea
        value={output}
        onClear={() => setOutput("")}
        language={direction === "json-to-csv" ? "text" : "json"}
      />
    </ToolLayout>
  );
}
