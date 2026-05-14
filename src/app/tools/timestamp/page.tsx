"use client";

import { useState, useCallback, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

export default function TimestampPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return null;
    setError(null);

    const trim = input.trim();
    let date: Date | null = null;
    let detected = "";

    // Try Unix seconds
    if (/^\d{8,10}$/.test(trim)) {
      date = new Date(Number(trim) * 1000);
      detected = "Unix 秒级";
    }
    // Try Unix milliseconds
    else if (/^\d{11,13}$/.test(trim)) {
      date = new Date(Number(trim));
      detected = "Unix 毫秒级";
    }
    // Try ISO / date string
    else {
      date = new Date(trim);
      if (!isNaN(date.getTime())) {
        detected = "日期字符串";
      }
    }

    if (!date || isNaN(date.getTime())) {
      setError("无法识别的时间格式");
      return null;
    }

    return {
      detected,
      iso: date.toISOString(),
      local: date.toLocaleString(),
      unixSeconds: Math.floor(date.getTime() / 1000),
      unixMs: date.getTime(),
      utc: date.toUTCString(),
      ymd: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`,
    };
  }, [input]);

  return (
    <ToolLayout
      title="时间戳转换"
      description="Unix 时间戳与日期互转，支持秒级、毫秒级和多种日期格式。"
      relatedIds={["uuid-generator"]}
    >
      <p className="text-sm text-muted-foreground mb-2">
        支持：Unix 秒级 (如 1719360000)、Unix 毫秒级 (如 1719360000000)、ISO 8601 (如 2024-06-26T00:00:00Z)
      </p>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder="1719360000"
        error={error}
        minHeight="60px"
      />

      {results && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            检测格式：
            <span className="rounded bg-blue-500/10 px-2 py-0.5 text-blue-500">
              {results.detected}
            </span>
          </div>

          <div className="space-y-2">
            {[
              { label: "ISO 8601", value: results.iso },
              { label: "UTC 字符串", value: results.utc },
              { label: "本地时间", value: results.local },
              { label: "Unix 秒级", value: String(results.unixSeconds) },
              { label: "Unix 毫秒级", value: String(results.unixMs) },
              { label: "年月日", value: results.ymd },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded bg-secondary px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <code className="font-mono text-xs">{row.value}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
