"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const t = useTranslations("common");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-16">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 text-sm text-muted-foreground">
        <span>CodeToolbox &copy; {year}</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">
            {t("privacy")}
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            {t("terms")}
          </a>
        </div>
      </div>
    </footer>
  );
}
