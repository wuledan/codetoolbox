"use client";

import { useCallback, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileDropZoneProps {
  onFile: (content: string, name: string) => void;
  accept?: string;
  label?: string;
}

export default function FileDropZone({
  onFile,
  accept = ".json,.txt",
  label = "拖放文件到此处，或点击选择",
}: FileDropZoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => onFile(reader.result as string, file.name);
        reader.readAsText(file);
      }
    },
    [onFile]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => onFile(reader.result as string, file.name);
        reader.readAsText(file);
      }
    },
    [onFile]
  );

  return (
    <div
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
        dragging
          ? "border-blue-500 bg-blue-500/5"
          : "border-border hover:border-muted-foreground/50"
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
