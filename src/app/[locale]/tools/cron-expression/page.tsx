"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";

const RANGES = {
  minute: { min: 0, max: 59, label: "minute" },
  hour: { min: 0, max: 23, label: "hour" },
  day: { min: 1, max: 31, label: "day" },
  month: { min: 1, max: 12, label: "month" },
  weekday: { min: 0, max: 6, label: "weekday" },
} as const;

type Field = keyof typeof RANGES;

const MONTH_NAMES = [
  "", "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const WEEKDAY_NAMES = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
];

function numbersRange(min: number, max: number): number[] {
  return Array.from({ length: max - min + 1 }, (_, i) => min + i);
}

function explainCron(
  minute: string,
  hour: string,
  day: string,
  month: string,
  weekday: string,
): string {
  const parts: string[] = [];

  const explain = (val: string, unit: string, names?: string[]) => {
    if (val === "*") return `every ${unit}`;
    if (val.includes(",")) {
      const items = val.split(",").map((v) => names ? names[Number(v)] : v);
      return `${items.join(", ")}`;
    }
    if (val.includes("/")) {
      const [, step] = val.split("/");
      return `every ${step} ${unit}`;
    }
    if (val.includes("-")) {
      const [from, to] = val.split("-");
      const fromName = names ? names[Number(from)] : from;
      const toName = names ? names[Number(to)] : to;
      return `${fromName} through ${toName}`;
    }
    return names ? names[Number(val)] : val;
  };

  parts.push(explain(minute, "minute"));
  parts.push(explain(hour, "hour"));
  parts.push(explain(day, "day of month"));
  parts.push(explain(month, "month", MONTH_NAMES));
  parts.push(explain(weekday, "weekday", WEEKDAY_NAMES));

  return `Runs at ${parts.join(", ")}`;
}

export default function CronExpressionPage() {
  const t = useTranslations("cronExpression");

  const [mode, setMode] = useState<Record<Field, "every" | "specific" | "range" | "step">>({
    minute: "every",
    hour: "every",
    day: "every",
    month: "every",
    weekday: "every",
  });

  const [selected, setSelected] = useState<Record<Field, number[]>>({
    minute: [0],
    hour: [0],
    day: [1],
    month: [1],
    weekday: [0],
  });

  const [rangeVal, setRangeVal] = useState<Record<Field, [number, number]>>({
    minute: [0, 59],
    hour: [0, 23],
    day: [1, 31],
    month: [1, 12],
    weekday: [0, 6],
  });

  const [stepVal, setStepVal] = useState<Record<Field, number>>({
    minute: 1,
    hour: 1,
    day: 1,
    month: 1,
    weekday: 1,
  });

  const fields: Field[] = ["minute", "hour", "day", "month", "weekday"];

  const cronExpression = useMemo(() => {
    return fields
      .map((f) => {
        const m = mode[f];
        if (m === "every") return "*";
        if (m === "step") return `*/${stepVal[f]}`;
        if (m === "range") {
          const [from, to] = rangeVal[f];
          return `${from}-${to}`;
        }
        if (selected[f].length === 0) return "*";
        return selected[f].sort((a, b) => a - b).join(",");
      })
      .join(" ");
  }, [mode, selected, rangeVal, stepVal]);

  const explanation = useMemo(
    () => explainCron(...fields.map((f) => {
      const m = mode[f];
      if (m === "every") return "*";
      if (m === "step") return `*/${stepVal[f]}`;
      if (m === "range") {
        const [from, to] = rangeVal[f];
        return `${from}-${to}`;
      }
      if (selected[f].length === 0) return "*";
      return selected[f].sort((a, b) => a - b).join(",");
    }) as [string, string, string, string, string]),
    [mode, selected, rangeVal, stepVal],
  );

  const handleSelect = (field: Field, value: number) => {
    setSelected((prev) => {
      const arr = prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value];
      return { ...prev, [field]: arr };
    });
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["timestamp", "regex-tester", "uuid-generator"]}
    >
      {fields.map((field) => {
        const rng = RANGES[field];
        const nums = numbersRange(rng.min, rng.max);
        const labels: Record<Field, string> = {
          minute: t("minute"),
          hour: t("hour"),
          day: t("day"),
          month: t("month"),
          weekday: t("weekday"),
        };

        return (
          <div key={field} className="space-y-2">
            <label className="text-sm font-medium">{labels[field]}</label>
            <div className="flex flex-wrap gap-2 items-center">
              <select
                value={mode[field]}
                onChange={(e) =>
                  setMode((prev) => ({
                    ...prev,
                    [field]: e.target.value as "every" | "specific" | "range" | "step",
                  }))
                }
                className="rounded-md border border-border bg-secondary px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                <option value="every">{t("every")}</option>
                <option value="specific">{t("specific")}</option>
                <option value="step">{t("step")}</option>
                <option value="range">{t("range")}</option>
              </select>

              {mode[field] === "specific" && (
                <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                  {nums.map((n) => (
                    <button
                      key={n}
                      onClick={() => handleSelect(field, n)}
                      className={`min-w-[2rem] rounded px-1.5 py-0.5 text-xs ${
                        selected[field].includes(n)
                          ? "bg-blue-500 text-white"
                          : "bg-secondary text-foreground hover:bg-blue-500/20"
                      }`}
                    >
                      {field === "month" ? MONTH_NAMES[n] : field === "weekday" ? WEEKDAY_NAMES[n].slice(0, 3) : n}
                    </button>
                  ))}
                </div>
              )}

              {mode[field] === "step" && (
                <div className="flex items-center gap-1 text-sm">
                  <span>*/</span>
                  <input
                    type="number"
                    min={1}
                    max={rng.max}
                    value={stepVal[field]}
                    onChange={(e) =>
                      setStepVal((prev) => ({
                        ...prev,
                        [field]: Number(e.target.value),
                      }))
                    }
                    className="w-16 rounded-md border border-border bg-secondary px-2 py-1 text-sm"
                  />
                </div>
              )}

              {mode[field] === "range" && (
                <div className="flex items-center gap-1 text-sm">
                  <input
                    type="number"
                    min={rng.min}
                    max={rng.max}
                    value={rangeVal[field][0]}
                    onChange={(e) =>
                      setRangeVal((prev) => ({
                        ...prev,
                        [field]: [Number(e.target.value), prev[field][1]],
                      }))
                    }
                    className="w-16 rounded-md border border-border bg-secondary px-2 py-1 text-sm"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    min={rng.min}
                    max={rng.max}
                    value={rangeVal[field][1]}
                    onChange={(e) =>
                      setRangeVal((prev) => ({
                        ...prev,
                        [field]: [prev[field][0], Number(e.target.value)],
                      }))
                    }
                    className="w-16 rounded-md border border-border bg-secondary px-2 py-1 text-sm"
                  />
                </div>
              )}
            </div>
          </div>
        );
      })}

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("expression")}</label>
        <pre className="w-full rounded-lg border border-border bg-secondary p-4 font-mono text-sm">
          {cronExpression}
        </pre>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">{t("explanation")}</label>
        <p className="text-sm text-muted-foreground">{explanation}</p>
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