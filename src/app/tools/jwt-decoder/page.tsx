"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

export default function JwtDecoderPage() {
  const [input, setInput] = useState("");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleDecode = useCallback(() => {
    setError(null);
    setHeader("");
    setPayload("");
    setSignature("");
    if (!input.trim()) return;

    const parts = input.trim().split(".");
    if (parts.length !== 3) {
      setError("无效的 JWT Token：需要三部分（header.payload.signature）");
      return;
    }

    try {
      const decode = (str: string) => {
        const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
        const padded = base64.padEnd(
          base64.length + ((4 - (base64.length % 4)) % 4),
          "="
        );
        return JSON.parse(atob(padded));
      };

      setHeader(JSON.stringify(decode(parts[0]), null, 2));
      setPayload(JSON.stringify(decode(parts[1]), null, 2));
      setSignature(parts[2]);
    } catch {
      setError("解码失败：JWT 格式无效");
    }
  }, [input]);

  return (
    <ToolLayout
      title="JWT 解码器"
      description="解析 JSON Web Token (JWT)，查看 Header、Payload 和 Signature。注意：本工具不验证签名。"
      relatedIds={["base64-encode"]}
    >
      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0..."
        error={error}
      />

      <Button onClick={handleDecode}>▶ 解码</Button>

      {header && (
        <div className="space-y-4 mt-4">
          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">Header</h3>
            <pre className="rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed overflow-auto">
              <code>{header}</code>
            </pre>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">Payload</h3>
            <pre className="rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed overflow-auto">
              <code>{payload}</code>
            </pre>
          </div>
          <div>
            <h3 className="mb-2 text-xs font-medium text-muted-foreground">Signature</h3>
            <pre className="rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed overflow-auto">
              <code>{signature}</code>
            </pre>
          </div>
        </div>
      )}
    </ToolLayout>
  );
}
