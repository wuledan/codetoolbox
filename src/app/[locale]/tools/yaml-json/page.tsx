"use client";

import { useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import yaml from "js-yaml";

export default function YamlJsonPage() {
  const t = useTranslations("yamlJson");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [error, setError] = useState<string | null>(null);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);
    try { setOutput(direction === "yaml-to-json" ? JSON.stringify(yaml.load(input), null, 2) : yaml.dump(JSON.parse(input))); }
    catch (e: any) { setError(e.message); setOutput(""); }
  }, [input, direction]);

  const swap = useCallback(() => { setInput(output); setOutput(""); setError(null); }, [output]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["json-formatter", "json-csv"]}>
      <div className="flex flex-wrap gap-2">
        <Button variant={direction === "yaml-to-json" ? "default" : "outline"} size="sm" onClick={() => setDirection("yaml-to-json")}>{t("yamlToJson")}</Button>
        <Button variant={direction === "json-to-yaml" ? "default" : "outline"} size="sm" onClick={() => setDirection("json-to-yaml")}>{t("jsonToYaml")}</Button>
        {output && <Button variant="outline" size="sm" onClick={swap}>{t("swap")}</Button>}
      </div>
      <InputArea value={input} onChange={(v) => { setInput(v); setError(null); }} placeholder={direction === "yaml-to-json" ? t("placeholderYaml") : t("placeholderJson")} error={error} />
      <Button onClick={handleConvert}>{t("convert")}</Button>
      <OutputArea value={output} onClear={() => setOutput("")} />
    </ToolLayout>
  );
}
