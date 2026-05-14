"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

export default function UrlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [component, setComponent] = useState(true);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    try {
      if (mode === "encode") {
        setOutput(component ? encodeURIComponent(input) : encodeURI(input));
      } else {
        setOutput(component ? decodeURIComponent(input) : decodeURI(input));
      }
    } catch {
      setOutput("解码失败：输入字符串无效");
    }
  }, [input, mode, component]);

  return (
    <ToolLayout
      title="URL 编解码器"
      description="对 URL 进行编码和解码，支持 Component 模式和完整 URL 模式。"
      relatedIds={["base64-encode", "html-escape"]}
    >
      <div className="flex flex-wrap gap-2">
        <Button variant={mode === "encode" ? "default" : "outline"} size="sm" onClick={() => setMode("encode")}>URL 编码</Button>
        <Button variant={mode === "decode" ? "default" : "outline"} size="sm" onClick={() => setMode("decode")}>URL 解码</Button>
      </div>

      <label className="flex items-center gap-2 text-xs text-muted-foreground">
        <input type="checkbox" checked={component} onChange={(e) => setComponent(e.target.checked)} />
        Component 模式（编码特殊字符）
      </label>

      <InputArea
        value={input}
        onChange={setInput}
        placeholder={mode === "encode" ? "https://example.com?name=Hello World" : "https%3A%2F%2Fexample.com"}
      />

      <Button onClick={handleConvert}>▶ 转换</Button>

      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
