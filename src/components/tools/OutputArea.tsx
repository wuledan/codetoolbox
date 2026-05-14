"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2 } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface OutputAreaProps {
  value: string;
  onClear?: () => void;
  className?: string;
  label?: string;
  language?: string;
  status?: string | null;
  statusType?: "success" | "error" | "info";
  clearLabel?: string;
  downloadLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  emptyLabel?: string;
}

export default function OutputArea({
  value,
  onClear,
  className,
  label = "Output",
  language,
  status,
  statusType,
  clearLabel = "Clear",
  downloadLabel = "Download",
  copyLabel = "Copy",
  copiedLabel = "Copied",
  emptyLabel = "Waiting for input...",
}: OutputAreaProps) {
  const { copied, copy } = useCopyToClipboard();

  const handleCopy = useCallback(() => {
    copy(value);
  }, [value, copy]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `output.${language === "json" ? "json" : "txt"}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [value, language]);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <div className="flex gap-1">
          {onClear && (
            <Button variant="ghost" size="sm" onClick={onClear}>
              <Trash2 className="h-3 w-3 mr-1" />
              {clearLabel}
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={handleDownload}>
            <Download className="h-3 w-3 mr-1" />
            {downloadLabel}
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCopy}>
            <Copy className="h-3 w-3 mr-1" />
            {copied ? copiedLabel : copyLabel}
          </Button>
        </div>
      </div>
      <pre className="w-full overflow-auto rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed">
        <code>{value || emptyLabel}</code>
      </pre>
      {status && (
        <p
          className={cn(
            "text-xs flex items-center gap-1",
            statusType === "success" && "text-green-500",
            statusType === "error" && "text-red-500",
            statusType === "info" && "text-muted-foreground"
          )}
        >
          {statusType === "success" && "✓ "}
          {statusType === "error" && "✗ "}
          {status}
        </p>
      )}
    </div>
  );
}
