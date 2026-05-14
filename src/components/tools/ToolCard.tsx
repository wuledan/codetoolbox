import Link from "next/link";
import type { ToolInfo } from "@/lib/registry";

export default function ToolCard({ tool }: { tool: ToolInfo }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.path}
      className="group flex items-start gap-4 rounded-lg border border-border bg-card p-4 transition-all hover:border-blue-500/50 hover:shadow-md hover:shadow-blue-500/5"
    >
      <div className="mt-1 rounded-md bg-blue-500/10 p-2 text-blue-500 transition-colors group-hover:bg-blue-500/20">
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm group-hover:text-blue-500 transition-colors">
          {tool.name}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
          {tool.description}
        </p>
      </div>
    </Link>
  );
}
