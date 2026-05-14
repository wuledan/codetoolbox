"use client";

import { useState, useCallback, useRef } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type Mode = "text-encode" | "text-decode" | "image-encode" | "image-decode";

export default function Base64Page() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<Mode>("text-encode");
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleConvert = useCallback(() => {
    setError(null);
    if (!input.trim()) { setOutput(""); return; }

    try {
      if (mode === "text-encode") {
        setOutput(btoa(input));
      } else if (mode === "text-decode") {
        setOutput(atob(input));
      } else if (mode === "image-encode") {
        // Image already encoded via file input
        setOutput(input);
      } else if (mode === "image-decode") {
        // Validate and show
        const decoded = atob(input);
        const blob = new Blob([decoded]);
        const url = URL.createObjectURL(blob);
        setOutput(url);
      }
    } catch (e: any) {
      setError(e.message || "处理失败");
      setOutput("");
    }
  }, [input, mode]);

  const handleImageFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setInput(reader.result as string);
      setOutput(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  return (
    <ToolLayout
      title="Base64 编解码器"
      description="对文本和图片进行 Base64 编码与解码，所有处理在浏览器端完成。"
      relatedIds={["url-encode", "html-escape"]}
    >
      <div className="flex flex-wrap gap-2">
        {([
          { key: "text-encode", label: "文本 → Base64" },
          { key: "text-decode", label: "Base64 → 文本" },
          { key: "image-encode", label: "图片 → Base64" },
        ] as const).map((m) => (
          <Button
            key={m.key}
            variant={mode === m.key ? "default" : "outline"}
            size="sm"
            onClick={() => setMode(m.key)}
          >
            {m.label}
          </Button>
        ))}
      </div>

      {(mode === "image-encode") && (
        <div
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-6 text-center hover:border-muted-foreground/50"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-xs text-muted-foreground">点击选择图片</p>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
        </div>
      )}

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder={mode === "text-encode" ? "输入要编码的文本..." : mode === "text-decode" ? "输入 Base64 字符串..." : "选择图片后将自动显示..."}
        error={error}
      />

      {mode !== "image-encode" && (
        <Button onClick={handleConvert}>▶ 转换</Button>
      )}

      <OutputArea
        value={output}
        label="输出"
        onClear={() => { setOutput(""); setInput(""); }}
      />
    </ToolLayout>
  );
}
