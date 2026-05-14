"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";

function renderMarkdown(md: string): string {
  let html = md
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/^(?!<[hupbco]|<li|<pre)(.+)$/gm, "<p>$1</p>");
  return html;
}

export default function MarkdownPreviewPage() {
  const t = useTranslations("markdownPreview");
  const [input, setInput] = useState("# Hello\n\nThis is **Markdown** preview.");
  const html = useMemo(() => { try { return renderMarkdown(input); } catch { return "<p>Error</p>"; } }, [input]);

  return (
    <ToolLayout title={t("title")} description={t("description")} relatedIds={["code-formatter", "diff-checker"]}>
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("edit")}</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500" style={{ minHeight: "300px", height: "50vh" }} spellCheck={false} />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">{t("preview")}</label>
          <div className="w-full overflow-auto rounded-lg border border-border bg-card p-4" style={{ minHeight: "300px", height: "50vh" }} dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </ToolLayout>
  );
}
