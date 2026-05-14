"use client";

import { Button } from "@/components/ui/button";
import { Copy, Download, Trash2 } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { cn } from "@/lib/utils";
import { useCallback } from "react";

interface OutputButtonsProps {
  value: string;
  onClear?: () => void;
  copyLabel?: string;
  copiedLabel?: string;
  clearLabel?: string;
  downloadLabel?: string;
  language?: string;
}

export default function OutputButtons({
  value,
  onClear,
  copyLabel = "Copy",
  copiedLabel = "Copied",
  clearLabel = "Clear",
  downloadLabel = "Download",
  language,
}: OutputButtonsProps) {
  const { copied, copy } = useCopyToClipboard();

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
      <Button variant="ghost" size="sm" onClick={() => copy(value)}>
        <Copy className="h-3 w-3 mr-1" />
        {copied ? copiedLabel : copyLabel}
      </Button>
    </div>
  );
}
