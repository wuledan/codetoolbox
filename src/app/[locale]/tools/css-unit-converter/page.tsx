"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";

type Unit = "px" | "rem" | "em" | "%";

const UNITS: Unit[] = ["px", "rem", "em", "%"];

function convert(value: number, fromUnit: Unit, baseFontSize: number): Record<Unit, number> {
  let px: number;
  switch (fromUnit) {
    case "px":
      px = value;
      break;
    case "rem":
    case "em":
      px = value * baseFontSize;
      break;
    case "%":
      px = (value / 100) * baseFontSize;
      break;
  }

  return {
    px: px,
    rem: px / baseFontSize,
    em: px / baseFontSize,
    "%": (px / baseFontSize) * 100,
  };
}

export default function CssUnitConverterPage() {
  const t = useTranslations("cssUnitConverter");
  const [inputValue, setInputValue] = useState("16");
  const [unit, setUnit] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState("16");

  const base = Number(baseFontSize) || 16;
  const value = Number(inputValue) || 0;

  const results = useMemo(
    () => convert(value, unit, base),
    [value, unit, base],
  );

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["color-converter", "timestamp", "json-formatter"]}
    >
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("inputValue")}
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            {t("inputUnit")}
          </label>
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as Unit)}
            className="rounded-md border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {UNITS.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          {t("baseFontSize")}
        </label>
        <input
          type="number"
          value={baseFontSize}
          onChange={(e) => setBaseFontSize(e.target.value)}
          className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {UNITS.filter((u) => u !== unit).map((u) => (
          <div
            key={u}
            className="rounded-lg border border-border bg-secondary p-4 text-center"
          >
            <div className="text-2xl font-bold">
              {results[u].toFixed(u === "%" ? 2 : 4).replace(/\.?0+$/, "") || "0"}
            </div>
            <div className="text-sm text-muted-foreground">{u}</div>
          </div>
        ))}
      </div>

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