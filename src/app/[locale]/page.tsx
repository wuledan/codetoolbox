import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/navigation";
import ToolCard from "@/components/tools/ToolCard";
import tools, { categoryLabels, type ToolCategory } from "@/lib/registry";

const categories = Object.keys(categoryLabels) as ToolCategory[];

export default async function HomePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await props.params;
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          CodeToolbox <span className="text-blue-500">&mdash;</span>{" "}
          {t("tagline")}
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">{t("subtitle")}</p>
      </section>

      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        if (catTools.length === 0) return null;
        return (
          <section key={cat} className="mb-10">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {categoryLabels[cat]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {catTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-16 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">💡 {t("blog")}</h2>
        <p className="text-sm text-muted-foreground">{t("latestBlog")}</p>
      </section>
    </div>
  );
}
