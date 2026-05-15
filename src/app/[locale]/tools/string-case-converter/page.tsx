"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

type CaseMode = "camel" | "snake" | "kebab" | "pascal";

function splitWords(text: string): string[] {
  // Split on spaces, underscores, hyphens, and camelCase boundaries
  return text
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .replace(/([a-zA-Z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([a-zA-Z])/g, "$1 $2")
    .split(/[\s_-]+/)
    .filter(Boolean);
}

function toCamelCase(words: string[]): string {
  return words
    .map((w, i) =>
      i === 0
        ? w.toLowerCase()
        : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(),
    )
    .join("");
}

function toSnakeCase(words: string[]): string {
  return words.map((w) => w.toLowerCase()).join("_");
}

function toKebabCase(words: string[]): string {
  return words.map((w) => w.toLowerCase()).join("-");
}

function toPascalCase(words: string[]): string {
  return words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join("");
}

export default function StringCaseConverterPage() {
  const t = useTranslations("stringCaseConverter");
  const [input, setInput] = useState("");

  const words = splitWords(input);

  const results: Record<CaseMode, string> = {
    camel: words.length ? toCamelCase(words) : "",
    snake: words.length ? toSnakeCase(words) : "",
    kebab: words.length ? toKebabCase(words) : "",
    pascal: words.length ? toPascalCase(words) : "",
  };

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["regex-tester", "url-encode", "html-escape"]}
    >
      <InputArea
        value={input}
        onChange={setInput}
        placeholder={t("placeholder")}
      />

      {words.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              ["camel", t("camelCase")],
              ["snake", t("snakeCase")],
              ["kebab", t("kebabCase")],
              ["pascal", t("pascalCase")],
            ] as const
          ).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center gap-2 rounded-lg border border-border bg-secondary p-3"
            >
              <span className="text-xs text-muted-foreground min-w-[5rem]">
                {label}
              </span>
              <code className="flex-1 truncate text-sm font-mono">
                {results[key as CaseMode]}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(results[key as CaseMode], key)}
                className="shrink-0"
              >
                {copied === key ? "✓" : "Copy"}
              </Button>
            </div>
          ))}
        </div>
      )}

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