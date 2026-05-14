"use client";

import { useState, useMemo } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

// Simple Markdown renderer - no external deps
function renderMarkdown(md: string): string {
  let html = md
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      const langClass = lang ? ` class="language-${lang}"` : "";
      return `<pre${langClass}><code>${code.trim()}</code></pre>`;
    })
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Bold
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Headings
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    // Blockquotes
    .replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>")
    // Horizontal rules
    .replace(/^---$/gm, "<hr />")
    // Lists
    .replace(/^- (.+)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, "<ul>$&</ul>")
    // Paragraphs
    .replace(/^(?!<[hupbco]|<li|<pre)(.+)$/gm, "<p>$1</p>");

  return html;
}

export default function MarkdownPreviewPage() {
  const [input, setInput] = useState("# Hello\n\nThis is **markdown** preview.");

  const html = useMemo(() => {
    try {
      return renderMarkdown(input);
    } catch {
      return "<p>渲染错误</p>";
    }
  }, [input]);

  return (
    <ToolLayout
      title="Markdown 预览"
      description="实时 Markdown 渲染预览，支持标题、粗体、代码块、列表等常用语法。"
      relatedIds={["code-formatter", "diff-checker"]}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">编辑</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ minHeight: "300px", height: "60vh" }}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">预览</label>
          <div
            className="prose prose-sm dark:prose-invert w-full overflow-auto rounded-lg border border-border bg-card p-4"
            style={{ minHeight: "300px", height: "60vh" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
