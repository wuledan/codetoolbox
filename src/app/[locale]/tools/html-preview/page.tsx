"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";

export default function HtmlPreviewPage() {
  const t = useTranslations("htmlPreview");
  const [html, setHtml] = useState(t("placeholder"));

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["markdown-preview", "code-formatter", "html-escape"]}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            HTML
          </label>
          <textarea
            value={html}
            onChange={(e) => setHtml(e.target.value)}
            className="w-full resize-y rounded-lg border border-border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-blue-500"
            style={{ minHeight: "400px" }}
            spellCheck={false}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground">
            Preview
          </label>
          <iframe
            srcDoc={html}
            sandbox=""
            title="HTML Preview"
            className="w-full rounded-lg border border-border bg-white"
            style={{ minHeight: "400px" }}
          />
        </div>
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