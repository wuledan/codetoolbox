"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";

function parseColor(input: string) {
  input = input.trim();

  // Hex
  const hexMatch = input.match(/^#?([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return { r, g, b, a: 1, format: "hex" as const };
    }
    if (hex.length === 8) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      const a = parseInt(hex.slice(6, 8), 16) / 255;
      return { r, g, b, a, format: "hex" as const };
    }
  }

  // RGB/RGBA
  const rgbMatch = input.match(
    /^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i
  );
  if (rgbMatch) {
    return {
      r: Number(rgbMatch[1]),
      g: Number(rgbMatch[2]),
      b: Number(rgbMatch[3]),
      a: rgbMatch[4] ? Number(rgbMatch[4]) : 1,
      format: "rgb" as const,
    };
  }

  // HSL/HSLA
  const hslMatch = input.match(
    /^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)$/i
  );
  if (hslMatch) {
    const h = Number(hslMatch[1]) / 360;
    const s = Number(hslMatch[2]) / 100;
    const l = Number(hslMatch[3]) / 100;
    const a = hslMatch[4] ? Number(hslMatch[4]) : 1;

    // HSL to RGB
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h * 6) % 2) - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    const hi = Math.floor(h * 6);
    switch (hi % 6) {
      case 0: r = c; g = x; break;
      case 1: r = x; g = c; break;
      case 2: g = c; b = x; break;
      case 3: g = x; b = c; break;
      case 4: r = x; b = c; break;
      case 5: r = c; b = x; break;
    }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
      a,
      format: "hsl" as const,
    };
  }

  return null;
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

function toRgb(r: number, g: number, b: number, a: number): string {
  return a < 1 ? `rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})` : `rgb(${r}, ${g}, ${b})`;
}

function toHsl(r: number, g: number, b: number): string {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return "hsl(0, 0%, " + Math.round(l * 100) + "%)";
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) {
    case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60; break;
    case gn: h = ((bn - rn) / d + 2) * 60; break;
    case bn: h = ((rn - gn) / d + 4) * 60; break;
  }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorConverterPage() {
  const [input, setInput] = useState("");

  const color = useMemo(() => {
    if (!input.trim()) return null;
    try {
      return parseColor(input);
    } catch {
      return null;
    }
  }, [input]);

  return (
    <ToolLayout
      title="颜色转换"
      description="Hex、RGB、HSL 颜色格式互转，支持透明度通道。"
      relatedIds={["code-formatter"]}
    >
      <InputArea
        value={input}
        onChange={setInput}
        placeholder="#ff6600 或 rgb(255, 102, 0) 或 hsl(24, 100%, 50%)"
        minHeight="60px"
      />

      {color && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div
            className="h-16 rounded-lg border"
            style={{
              backgroundColor: `rgb(${color.r}, ${color.g}, ${color.b})`,
            }}
          />

          <div className="space-y-2">
            {[
              { label: "Hex", value: toHex(color.r, color.g, color.b) },
              { label: "RGB", value: toRgb(color.r, color.g, color.b, color.a) },
              { label: "HSL", value: toHsl(color.r, color.g, color.b) },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between rounded bg-secondary px-3 py-2"
              >
                <span className="text-xs text-muted-foreground">{row.label}</span>
                <code className="font-mono text-xs">{row.value}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {input.trim() && !color && (
        <p className="text-xs text-red-500">⚠ 无法识别的颜色格式</p>
      )}
    </ToolLayout>
  );
}
