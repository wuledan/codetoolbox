"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import prettier from "prettier/standalone";
import * as prettierPluginBabel from "prettier/plugins/babel";
import * as prettierPluginEstree from "prettier/plugins/estree";
import * as prettierPluginTypeScript from "prettier/plugins/typescript";
import * as prettierPluginPostCSS from "prettier/plugins/postcss";
import * as prettierPluginHtml from "prettier/plugins/html";
import * as prettierPluginMarkdown from "prettier/plugins/markdown";

const LANGUAGES = ["javascript", "typescript", "jsx", "tsx", "css", "html", "json", "markdown"];

const PARSER_MAP: Record<string, string> = {
  javascript: "babel",
  typescript: "typescript",
  jsx: "babel",
  tsx: "typescript",
  css: "css",
  html: "html",
  json: "json",
  markdown: "markdown",
};

export default function CodeFormatterPage() {
  const t = useTranslations("codeFormatter");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [error, setError] = useState<string | null>(null);

  const handleFormat = useCallback(async () => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);
    try {
      if (language === "json") {
        setOutput(JSON.stringify(JSON.parse(input), null, 2));
        return;
      }
      const parser = PARSER_MAP[language];
      if (!parser) { setOutput(input); return; }
      const result = await prettier.format(input, {
        parser,
        plugins: [
          prettierPluginBabel,
          prettierPluginEstree,
          prettierPluginTypeScript,
          prettierPluginPostCSS,
          prettierPluginHtml,
          prettierPluginMarkdown,
        ],
      });
      setOutput(result);
    } catch (e: any) { setError(e.message); setOutput(""); }
  }, [input, language]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["json-formatter", "sql-formatter"]}>
      <div>
        <label className="mb-1 block text-xs text-muted-foreground">{t("language")}</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm">
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang.charAt(0).toUpperCase() + lang.slice(1)}</option>
          ))}
        </select>
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={t("placeholder")} error={error} />
      <Button onClick={handleFormat}>{t("format")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
