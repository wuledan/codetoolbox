"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import { format } from "sql-formatter";

const DIALECTS = [
  "mysql",
  "postgresql",
  "sqlite",
  "bigquery",
  "db2",
  "hive",
  "mariadb",
  "n1ql",
  "plsql",
  "redshift",
  "singlestoredb",
  "snowflake",
  "spark",
  "tsql",
  "trino",
];

export default function SqlFormatterPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [dialect, setDialect] = useState("mysql");
  const [indent, setIndent] = useState(2);
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    try {
      const result = format(input, {
        language: dialect as any,
        tabWidth: indent,
      });
      setOutput(result);
      setError(null);
    } catch (e: any) {
      setError(e.message || "格式化失败");
      setOutput("");
    }
  }, [input, dialect, indent]);

  return (
    <ToolLayout
      title="SQL 格式化"
      description="格式化 SQL 语句，支持 MySQL、PostgreSQL、SQLite 等 15 种数据库方言。"
      relatedIds={["code-formatter", "json-formatter"]}
    >
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">数据库方言</label>
          <select
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            {DIALECTS.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">缩进</label>
          <select
            value={indent}
            onChange={(e) => setIndent(Number(e.target.value))}
            className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
          >
            <option value={2}>2 空格</option>
            <option value={4}>4 空格</option>
          </select>
        </div>

      </div>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder="SELECT * FROM users WHERE id = 1"
        error={error}
      />

      <Button onClick={handleFormat}>▶ 格式化</Button>

      <OutputArea value={output} onClear={() => setOutput("")} language="sql" />
    </ToolLayout>
  );
}
