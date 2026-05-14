import Link from "next/link";
import tools, { categoryLabels, type ToolCategory } from "@/lib/registry";
import ToolCard from "@/components/tools/ToolCard";

const categories = Object.keys(categoryLabels) as ToolCategory[];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      {/* Hero */}
      <section className="mb-12 text-center">
        <h1 className="mb-3 text-3xl font-bold tracking-tight">
          代码工具箱 <span className="text-blue-500">&mdash;</span>{" "}
          每个开发者都需要
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          纯浏览器端运行 &middot; 保护隐私 &middot; 即开即用
        </p>
      </section>

      {/* 工具列表 */}
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

      {/* 博客区 */}
      <section className="mt-16 rounded-lg border border-border bg-card p-6">
        <h2 className="mb-2 text-lg font-semibold">💡 最新文章</h2>
        <p className="text-sm text-muted-foreground">
          前端开发者必备的 10 个在线工具 &rarr;
        </p>
      </section>
    </div>
  );
}
