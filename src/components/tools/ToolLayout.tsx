"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import tools from "@/lib/registry";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  relatedIds?: string[];
}

export default function ToolLayout({
  title,
  description,
  children,
  relatedIds,
}: ToolLayoutProps) {
  const t = useTranslations("toolPage");
  const related =
    relatedIds
      ?.map((id) => tools.find((t) => t.id === id))
      .filter(Boolean) ?? [];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors">
          {t("breadcrumb")}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{title}</span>
      </nav>

      <h1 className="mb-2 text-2xl font-bold">{title}</h1>
      <p className="mb-8 text-muted-foreground">{description}</p>

      <div className="space-y-4">{children}</div>

      {related.length > 0 && (
        <div className="mt-12">
          <h3 className="mb-3 text-sm font-medium text-muted-foreground">
            {t("relatedTools")}
          </h3>
          <div className="flex flex-wrap gap-2">
            {related.map((t) =>
              t ? (
                <Link
                  key={t.id}
                  href={t.path}
                  className="rounded-full border border-border bg-card px-3 py-1 text-xs transition-colors hover:border-blue-500/50 hover:text-blue-500"
                >
                  {t.name}
                </Link>
              ) : null
            )}
          </div>
        </div>
      )}
    </div>
  );
}
