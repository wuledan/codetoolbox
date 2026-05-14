"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

const ENTITY_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const REVERSE_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&#x2F;": "/",
};

export default function HtmlEscapePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    if (mode === "escape") {
      setOutput(
        input.replace(/[&<>"']/g, (c) => ENTITY_MAP[c] || c)
      );
    } else {
      setOutput(
        input.replace(/&(?:amp|lt|gt|quot|#39|#x27|#x2F);/g, (m) => REVERSE_MAP[m] || m)
      );
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="HTML 转义 / 反转义"
      description="转义 HTML 特殊字符（&lt; &gt; &amp; &quot; &#39;）或还原。"
      relatedIds={["url-encode", "base64-encode"]}
    >
      <div className="flex gap-2">
        <Button variant={mode === "escape" ? "default" : "outline"} size="sm" onClick={() => setMode("escape")}>
          转义
        </Button>
        <Button variant={mode === "unescape" ? "default" : "outline"} size="sm" onClick={() => setMode("unescape")}>
          反转义
        </Button>
      </div>

      <InputArea
        value={input}
        onChange={setInput}
        placeholder={mode === "escape" ? '<script>alert("XSS")</script>' : "&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;"}
      />

      <Button onClick={handleConvert}>▶ 转换</Button>

      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
