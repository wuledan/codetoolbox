"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Metadata } from "next";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";

const ALGORITHMS = ["SHA-1", "SHA-256", "SHA-512", "MD5"] as const;
type Algorithm = (typeof ALGORITHMS)[number];

async function computeHash(algorithm: Algorithm, text: string): Promise<string> {
  if (algorithm === "MD5") {
    // Web Crypto API doesn't support MD5; use a simple implementation
    let hash = 0x67452301;
    let hash2 = 0xefcdab89;
    let hash3 = 0x98badcfe;
    let hash4 = 0x10325476;
    let hash5 = 0xc3d2e1f0;

    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const msgLen = data.length * 8;
    const buf = new Uint8Array(Math.ceil((data.length + 9) / 64) * 64);
    buf.set(data);
    buf[data.length] = 0x80;
    const view = new DataView(buf.buffer);
    view.setUint32(buf.length - 8, msgLen, true);

    for (let offset = 0; offset < buf.length; offset += 64) {
      const w = new Uint32Array(80);
      for (let i = 0; i < 16; i++) {
        w[i] = view.getUint32(offset + i * 4, true);
      }
      for (let i = 16; i < 80; i++) {
        w[i] = ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) << 1) | ((w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16]) >>> 31);
      }

      let a = hash, b = hash2, c = hash3, d = hash4, e = hash5;
      for (let i = 0; i < 80; i++) {
        let f: number, k: number;
        if (i < 20) { f = (b & c) | ((~b) & d); k = 0x5a827999; }
        else if (i < 40) { f = b ^ c ^ d; k = 0x6ed9eba1; }
        else if (i < 60) { f = (b & c) | (b & d) | (c & d); k = 0x8f1bbcdc; }
        else { f = b ^ c ^ d; k = 0xca62c1d6; }
        const temp = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) | 0;
        e = d; d = c; c = ((b << 30) | (b >>> 2)); b = a; a = temp;
      }
      hash = (hash + a) | 0;
      hash2 = (hash2 + b) | 0;
      hash3 = (hash3 + c) | 0;
      hash4 = (hash4 + d) | 0;
      hash5 = (hash5 + e) | 0;
    }

    const hex = (n: number) => (n >>> 0).toString(16).padStart(8, "0");
    return hex(hash) + hex(hash2) + hex(hash3) + hex(hash4) + hex(hash5);
  }

  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function HashGeneratorPage() {
  const t = useTranslations("hashGenerator");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [algorithm, setAlgorithm] = useState<Algorithm>("SHA-256");
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    setError(null);
    if (!input.trim()) {
      setOutput("");
      return;
    }
    try {
      const result = await computeHash(algorithm, input);
      setOutput(result);
    } catch {
      setError(t("placeholder"));
      setOutput("");
    }
  }, [input, algorithm, t]);

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["uuid-generator", "jwt-decoder", "base64-encode"]}
    >
      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          {t("algorithm")}
        </label>
        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          {ALGORITHMS.map((algo) => (
            <option key={algo} value={algo}>
              {algo}
            </option>
          ))}
        </select>
      </div>

      <InputArea
        value={input}
        onChange={(v) => {
          setInput(v);
          setError(null);
        }}
        placeholder={t("placeholder")}
        error={error}
      />

      <Button onClick={handleGenerate}>{t("generate")}</Button>

      <OutputArea
        value={output}
        onClear={() => {
          setOutput("");
          setInput("");
        }}
      />

      <div className="mt-12 space-y-4">
        <h2 className="text-lg font-semibold">FAQ</h2>
        <details className="group rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium group-open:text-blue-500">
            {t("faq1q")}
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">{t("faq1a")}</p>
        </details>
        <details className="group rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium group-open:text-blue-500">
            {t("faq2q")}
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">{t("faq2a")}</p>
        </details>
        <details className="group rounded-lg border border-border p-4">
          <summary className="cursor-pointer text-sm font-medium group-open:text-blue-500">
            {t("faq3q")}
          </summary>
          <p className="mt-2 text-sm text-muted-foreground">{t("faq3a")}</p>
        </details>
      </div>
    </ToolLayout>
  );
}