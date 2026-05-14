"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

function generateV1(): string {
  const now = Date.now();
  const timeHex = now.toString(16).padStart(12, "0");
  const clockSeq = Math.floor(Math.random() * 0x3fff)
    .toString(16)
    .padStart(4, "0");
  const node = Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
  ).join("");
  return `${timeHex.slice(0, 8)}-${timeHex.slice(8, 12)}-1${clockSeq.slice(
    0,
    3
  )}-${clockSeq.slice(3)}-${node}`;
}

function generateV4(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

function generateV7(): string {
  const now = Date.now().toString(16).padStart(12, "0");
  const rand = Array.from({ length: 8 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("");
  return `${now.slice(0, 8)}-${now.slice(8, 12)}-7${rand.slice(0, 3)}-${(
    "89ab"[Math.floor(Math.random() * 4)] + rand.slice(3, 6)
  )}-${rand.slice(6)}${Array.from({ length: 4 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join("")}`;
}

const generators: Record<string, () => string> = { v1: generateV1, v4: generateV4, v7: generateV7 };

export default function UuidGeneratorPage() {
  const [version, setVersion] = useState("v4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const { copied, copy } = useCopyToClipboard();

  const handleGenerate = useCallback(() => {
    const gen = generators[version] || generateV4;
    setUuids(Array.from({ length: count }, gen));
  }, [version, count]);

  const handleCopyAll = useCallback(() => {
    copy(uuids.join("\n"));
  }, [uuids, copy]);

  return (
    <ToolLayout
      title="UUID 生成器"
      description="生成 UUID v1/v4/v7，支持批量生成和一键复制。"
      relatedIds={["timestamp"]}
    >
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">版本</label>
          <div className="flex gap-2">
            {["v1", "v4", "v7"].map((v) => (
              <Button
                key={v}
                variant={version === v ? "default" : "outline"}
                size="sm"
                onClick={() => setVersion(v)}
              >
                {v.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">数量</label>
          <input
            type="number"
            min={1}
            max={100}
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
            className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleGenerate}>
          <RefreshCw className="h-4 w-4 mr-1" /> 生成
        </Button>
        {uuids.length > 0 && (
          <Button variant="outline" onClick={handleCopyAll}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? "已复制" : "复制全部"}
          </Button>
        )}
      </div>

      {uuids.length > 0 && (
        <div className="rounded-lg border border-border bg-secondary p-4">
          <div className="space-y-1">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center justify-between">
                <code className="font-mono text-sm">{uuid}</code>
                <button
                  className="text-xs text-muted-foreground hover:text-foreground"
                  onClick={() => copy(uuid)}
                >
                  复制
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
