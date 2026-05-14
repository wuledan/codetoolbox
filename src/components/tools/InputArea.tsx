import { cn } from "@/lib/utils";

interface InputAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
  error?: string | null;
  readOnly?: boolean;
}

export default function InputArea({
  value,
  onChange,
  placeholder = "Paste your data here...",
  minHeight = "200px",
  className,
  error,
  readOnly = false,
}: InputAreaProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        readOnly={readOnly}
        className={cn(
          "w-full resize-y rounded-lg border bg-secondary p-4 font-mono text-sm leading-relaxed focus:outline-none focus:ring-1",
          error
            ? "border-red-500 focus:ring-red-500"
            : "border-border focus:ring-blue-500",
          readOnly && "cursor-default opacity-80"
        )}
        style={{ minHeight }}
        spellCheck={false}
      />
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
