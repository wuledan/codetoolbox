"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { v1, v4, v7 } from "uuid";

const generators: Record<string, () => string> = { v1, v4, v7 };

export default function UuidGeneratorPage() {
  const t = useTranslations("uuidGenerator");
  const [version, setVersion] = useState("v4");
  const [count, setCount] = useState(5);
  const [uuids, setUuids] = useState<string[]>([]);
  const { copied, copy } = useCopyToClipboard();

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["timestamp"]}>
      <div className="flex flex-wrap gap-4">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("version")}</label>
          <div className="flex gap-2">
            {["v1", "v4", "v7"].map((v) => (
              <Button key={v} variant={version === v ? "default" : "outline"} size="sm" onClick={() => setVersion(v)}>{v.toUpperCase()}</Button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("count")}</label>
          <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Number(e.target.value))} className="w-20 rounded-lg border border-border bg-card px-3 py-2 text-sm" />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={() => { const gen = generators[version] || v4; setUuids(Array.from({ length: count }, gen)); }}>
          <RefreshCw className="h-4 w-4 mr-1" /> {t("generate")}
        </Button>
        {uuids.length > 0 && (
          <Button variant="outline" onClick={() => copy(uuids.join("\n"))}>
            <Copy className="h-4 w-4 mr-1" /> {copied ? t("copied") : t("copyAll")}
          </Button>
        )}
      </div>
      {uuids.length > 0 && (
        <div className="rounded-lg border border-border bg-secondary p-4">
          {uuids.map((uuid, i) => (
            <div key={i} className="flex items-center justify-between py-0.5">
              <code className="font-mono text-sm">{uuid}</code>
              <button className="text-xs text-muted-foreground hover:text-foreground" onClick={() => copy(uuid)}>{t("copyAll")}</button>
            </div>
          ))}
        </div>
      )}
    </ToolLayout>
  );
}
