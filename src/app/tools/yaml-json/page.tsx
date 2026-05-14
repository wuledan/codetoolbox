"use client";

import { useState, useCallback } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import OutputArea from "@/components/tools/OutputArea";
import { Button } from "@/components/ui/button";
import yaml from "js-yaml";

export default function YamlJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [direction, setDirection] = useState<"yaml-to-json" | "json-to-yaml">("yaml-to-json");
  const [error, setError] = useState<string | null>(null);
  const [indent, setIndent] = useState(2);

  const handleConvert = useCallback(() => {
    if (!input.trim()) { setOutput(""); return; }
    setError(null);

    try {
      if (direction === "yaml-to-json") {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, indent));
      } else {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent }));
      }
    } catch (e: any) {
      setError(e.message || "转换失败");
      setOutput("");
    }
  }, [input, direction, indent]);

  return (
    <ToolLayout
      title="YAML ↔ JSON 互转"
      description="在 YAML 和 JSON 格式之间快速转换。"
      relatedIds={["json-formatter", "json-csv"]}
    >
      <div className="flex flex-wrap gap-2">
        <Button
          variant={direction === "yaml-to-json" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("yaml-to-json")}
        >
          YAML → JSON
        </Button>
        <Button
          variant={direction === "json-to-yaml" ? "default" : "outline"}
          size="sm"
          onClick={() => setDirection("json-to-yaml")}
        >
          JSON → YAML
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setInput(""); setOutput(""); setError(null); }}>
          互换方向
        </Button>
      </div>

      <InputArea
        value={input}
        onChange={(v) => { setInput(v); setError(null); }}
        placeholder={
          direction === "yaml-to-json"
            ? "name: Alice\nage: 30\nroles:\n  - admin"
            : '{"name": "Alice", "age": 30, "roles": ["admin"]}'
        }
        error={error}
      />

      <Button onClick={handleConvert}>▶ 转换</Button>

      <OutputArea
        value={output}
        onClear={() => setOutput("")}
        language={direction === "yaml-to-json" ? "json" : "yaml"}
      />
    </ToolLayout>
  );
}
