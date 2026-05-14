import Link from "next/link";
import tools, { categoryLabels, type ToolCategory } from "@/lib/registry";
import ToolCard from "@/components/tools/ToolCard";

const categories = Object.keys(categoryLabels) as ToolCategory[];

export const metadata = {
  title: "全部工具",
  description: "浏览所有可用的在线代码工具",
};

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">全部工具</h1>
      {categories.map((cat) => {
        const catTools = tools.filter((t) => t.category === cat);
        if (catTools.length === 0) return null;
        return (
          <section key={cat} className="mb-8">
            <h2 className="mb-3 text-sm font-medium text-muted-foreground">
              {categoryLabels[cat]}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {catTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
