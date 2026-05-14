"use client";

import { useTranslations } from "next-intl";

const locales = [
  { code: "en", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
];

export default function LanguageSwitcher() {
  return (
    <select
      onChange={(e) => {
        const locale = e.target.value;
        window.location.href = `/${locale === "en" ? "" : locale}`;
      }}
      className="rounded-lg border border-border bg-card px-2 py-1 text-xs"
      defaultValue=""
    >
      <option value="" disabled>
        🌐
      </option>
      {locales.map((l) => (
        <option key={l.code} value={l.code}>
          {l.label}
        </option>
      ))}
    </select>
  );
}
