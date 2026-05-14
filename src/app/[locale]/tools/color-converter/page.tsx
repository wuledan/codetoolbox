"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";

function parseColor(input: string) {
  input = input.trim();
  const hexMatch = input.match(/^#?([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[1];
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 6) {
      return { r: parseInt(hex.slice(0, 2), 16), g: parseInt(hex.slice(2, 4), 16), b: parseInt(hex.slice(4, 6), 16) };
    }
  }
  const rgbMatch = input.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (rgbMatch) return { r: Number(rgbMatch[1]), g: Number(rgbMatch[2]), b: Number(rgbMatch[3]) };
  const hslMatch = input.match(/^hsla?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+))?\s*\)$/i);
  if (hslMatch) {
    const h = Number(hslMatch[1]) / 360, s = Number(hslMatch[2]) / 100, l = Number(hslMatch[3]) / 100;
    const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h * 6) % 2) - 1)), m = l - c / 2;
    let r = 0, g = 0, b = 0;
    switch (Math.floor(h * 6) % 6) {
      case 0: r = c; g = x; break; case 1: r = x; g = c; break;
      case 2: g = c; b = x; break; case 3: g = x; b = c; break;
      case 4: r = x; b = c; break; case 5: r = c; b = x; break;
    }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
  }
  return null;
}

function toHex(r: number, g: number, b: number) { return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`; }
function toRgb(r: number, g: number, b: number) { return `rgb(${r}, ${g}, ${b})`; }
function toHsl(r: number, g: number, b: number) {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn), l = (max + min) / 2;
  if (max === min) return `hsl(0, 0%, ${Math.round(l * 100)}%)`;
  const d = max - min, s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  switch (max) { case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) * 60; break; case gn: h = ((bn - rn) / d + 2) * 60; break; case bn: h = ((rn - gn) / d + 4) * 60; break; }
  return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

export default function ColorConverterPage() {
  const t = useTranslations("colorConverter");
  const [input, setInput] = useState("");
  const color = useMemo(() => { try { return parseColor(input); } catch { return null; } }, [input]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={[]}>
      <InputArea value={input} onChange={setInput} placeholder={t("placeholder")} minHeight="60px" />
      {color && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="h-16 rounded-lg border" style={{ backgroundColor: toRgb(color.r, color.g, color.b) }} />
          {[{ label: "Hex", value: toHex(color.r, color.g, color.b) }, { label: "RGB", value: toRgb(color.r, color.g, color.b) }, { label: "HSL", value: toHsl(color.r, color.g, color.b) }].map((r) => (
            <div key={r.label} className="flex items-center justify-between rounded bg-secondary px-3 py-2">
              <span className="text-xs text-muted-foreground">{r.label}</span>
              <code className="font-mono text-xs">{r.value}</code>
            </div>
          ))}
        </div>
      )}
      {input.trim() && !color && <p className="text-xs text-red-500">⚠ {t("unrecognized")}</p>}
    </ToolLayout>
  );
}
