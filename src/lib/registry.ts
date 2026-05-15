import type { LucideIcon } from "lucide-react";
import {
  Braces,
  KeyRound,
  Waypoints,
  Code2,
  Shuffle,
  FileJson,
  FileText,
  TestTube,
  Calendar,
  Palette,
  Hash,
  TableProperties,
  Split,
  Sigma,
  FileImage,
  Globe,
  Binary,
  LetterText,
  Clock,
  Ruler,
  CodeXml,
  type LucideProps,
} from "lucide-react";

export type ToolCategory =
  | "format"
  | "encode"
  | "test"
  | "generate"
  | "convert"
  | "transform";

export interface ToolInfo {
  id: string;
  name: string;
  description: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
  category: ToolCategory;
  path: string;
  keywords: string[];
}

const iconProps = { width: 28, height: 28 };

const tools: ToolInfo[] = [
  // 格式化工具
  {
    id: "json-formatter",
    name: "JSON 格式化器",
    description: "格式化、美化、校验你的 JSON 数据",
    icon: Braces,
    category: "format",
    path: "/tools/json-formatter",
    keywords: [
      "json formatter",
      "json validator",
      "pretty json",
      "json美化",
    ],
  },
  {
    id: "code-formatter",
    name: "代码格式化",
    description: "JS/TS/CSS/HTML/JSON 代码一键美化",
    icon: Code2,
    category: "format",
    path: "/tools/code-formatter",
    keywords: ["code formatter", "prettier", "代码格式化"],
  },
  {
    id: "sql-formatter",
    name: "SQL 格式化",
    description: "SQL 语句美化，支持多种数据库方言",
    icon: TableProperties,
    category: "format",
    path: "/tools/sql-formatter",
    keywords: ["sql formatter", "sql美化", "sql pretty"],
  },
  // 编解码工具
  {
    id: "base64-encode",
    name: "Base64 编解码",
    description: "文本和图片的 Base64 编码与解码",
    icon: KeyRound,
    category: "encode",
    path: "/tools/base64-encode",
    keywords: ["base64 encode", "base64 decode", "base64编码"],
  },
  {
    id: "url-encode",
    name: "URL 编解码",
    description: "URL 编码与解码，支持 Component 模式",
    icon: Waypoints,
    category: "encode",
    path: "/tools/url-encode",
    keywords: ["url encode", "url decode", "url编码"],
  },
  {
    id: "html-escape",
    name: "HTML 转义",
    description: "HTML 特殊字符转义与反转义",
    icon: FileText,
    category: "encode",
    path: "/tools/html-escape",
    keywords: ["html escape", "html encode", "html转义"],
  },
  {
    id: "jwt-decoder",
    name: "JWT 解码器",
    description: "解析 JWT Token，查看 Header 和 Payload",
    icon: Hash,
    category: "encode",
    path: "/tools/jwt-decoder",
    keywords: ["jwt decoder", "jwt parser", "jwt解码"],
  },
  // 测试工具
  {
    id: "regex-tester",
    name: "正则测试器",
    description: "正则表达式实时匹配测试，语法高亮",
    icon: TestTube,
    category: "test",
    path: "/tools/regex-tester",
    keywords: ["regex tester", "regular expression", "正则测试"],
  },
  {
    id: "diff-checker",
    name: "文本差异对比",
    description: "比较两段文本的差异，支持行内和并排模式",
    icon: Split,
    category: "test",
    path: "/tools/diff-checker",
    keywords: ["diff checker", "text diff", "文本对比"],
  },
  {
    id: "markdown-preview",
    name: "Markdown 预览",
    description: "实时 Markdown 渲染预览，支持 GFM",
    icon: FileText,
    category: "test",
    path: "/tools/markdown-preview",
    keywords: ["markdown preview", "markdown渲染", "markdown编辑器"],
  },
  // 生成工具
  {
    id: "uuid-generator",
    name: "UUID 生成器",
    description: "生成 UUID v1/v4/v7，支持批量生成",
    icon: Sigma,
    category: "generate",
    path: "/tools/uuid-generator",
    keywords: ["uuid generator", "uuid生成", "uuid v4"],
  },
  {
    id: "timestamp",
    name: "时间戳转换",
    description: "Unix 时间戳与日期互转，支持多种格式",
    icon: Calendar,
    category: "generate",
    path: "/tools/timestamp",
    keywords: ["timestamp converter", "time converter", "时间戳转换"],
  },
  // 转换工具
  {
    id: "yaml-json",
    name: "YAML ↔ JSON",
    description: "YAML 与 JSON 格式互转",
    icon: Shuffle,
    category: "convert",
    path: "/tools/yaml-json",
    keywords: ["yaml to json", "json to yaml", "yaml json互转"],
  },
  {
    id: "json-csv",
    name: "JSON ↔ CSV",
    description: "JSON 与 CSV 格式互转",
    icon: FileJson,
    category: "convert",
    path: "/tools/json-csv",
    keywords: ["json to csv", "csv to json", "json csv互转"],
  },
  {
    id: "color-converter",
    name: "颜色转换",
    description: "Hex / RGB / HSL 颜色格式互转",
    icon: Palette,
    category: "convert",
    path: "/tools/color-converter",
    keywords: ["color converter", "hex to rgb", "颜色转换"],
  },
  {
    id: "hash-generator",
    name: "Hash 生成器",
    description: "使用 Web Crypto API 生成 MD5/SHA-1/SHA-256/SHA-512 哈希",
    icon: Binary,
    category: "encode",
    path: "/tools/hash-generator",
    keywords: ["hash generator", "sha256", "md5", "hash生成"],
  },
  {
    id: "html-preview",
    name: "HTML 预览",
    description: "实时预览 HTML 代码，沙箱 iframe 渲染",
    icon: CodeXml,
    category: "test",
    path: "/tools/html-preview",
    keywords: ["html preview", "html renderer", "html预览"],
  },
  {
    id: "cron-expression",
    name: "Cron 表达式",
    description: "可视化构建 Cron 表达式，生成人类可读解释",
    icon: Clock,
    category: "generate",
    path: "/tools/cron-expression",
    keywords: ["cron expression", "cron builder", "cron表达式"],
  },
  {
    id: "css-unit-converter",
    name: "CSS 单位转换",
    description: "px / rem / em / % CSS 单位互转",
    icon: Ruler,
    category: "convert",
    path: "/tools/css-unit-converter",
    keywords: ["css unit converter", "px to rem", "css单位转换"],
  },
  {
    id: "string-case-converter",
    name: "字符串大小写转换",
    description: "camelCase / snake_case / kebab-case / PascalCase 互转",
    icon: LetterText,
    category: "transform",
    path: "/tools/string-case-converter",
    keywords: ["string case converter", "camelCase", "snake_case", "大小写转换"],
  },
  {
    id: "ip-lookup",
    name: "IP 查询",
    description: "查询 IPv4 地址的地理位置与 ISP 信息",
    icon: Globe,
    category: "test",
    path: "/tools/ip-lookup",
    keywords: ["ip lookup", "ip geolocation", "ip查询"],
  },
];

export default tools;

export function getToolById(id: string): ToolInfo | undefined {
  return tools.find((t) => t.id === id);
}

export function getToolsByCategory(cat: ToolCategory): ToolInfo[] {
  return tools.filter((t) => t.category === cat);
}

export const categoryLabels: Record<ToolCategory, string> = {
  format: "格式化工具",
  encode: "编解码工具",
  test: "测试工具",
  generate: "生成工具",
  convert: "转换工具",
  transform: "转换工具",
};
