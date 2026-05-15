"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import ToolLayout from "@/components/tools/ToolLayout";
import InputArea from "@/components/tools/InputArea";
import { Button } from "@/components/ui/button";

interface IpResult {
  ip: string;
  city: string;
  region: string;
  country_name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  org: string;
  asn: string;
}

function isValidIpv4(ip: string): boolean {
  const parts = ip.split(".");
  if (parts.length !== 4) return false;
  return parts.every(
    (p) => /^\d+$/.test(p) && Number(p) >= 0 && Number(p) <= 255,
  );
}

export default function IpLookupPage() {
  const t = useTranslations("ipLookup");
  const [input, setInput] = useState("");
  const [result, setResult] = useState<IpResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    setError(null);
    setResult(null);

    const trimmed = input.trim();
    if (!trimmed) return;

    if (!isValidIpv4(trimmed)) {
      setError(t("invalidIp"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`https://ipapi.co/${trimmed}/json/`);
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      setResult(data);
    } catch {
      setError(t("error"));
    } finally {
      setLoading(false);
    }
  };

  const fields: { key: keyof IpResult; label: string }[] = [
    { key: "ip", label: t("ip") },
    { key: "city", label: t("city") },
    { key: "region", label: t("region") },
    { key: "country_name", label: t("country") },
    { key: "latitude", label: t("latitude") },
    { key: "longitude", label: t("longitude") },
    { key: "timezone", label: t("timezone") },
    { key: "org", label: t("org") },
    { key: "asn", label: t("asn") },
  ];

  return (
    <ToolLayout
      title={t("title")}
      description={t("description")}
      relatedIds={["url-encode", "jwt-decoder", "regex-tester"]}
    >
      <InputArea
        value={input}
        onChange={(v) => {
          setInput(v);
          setError(null);
        }}
        placeholder={t("placeholder")}
        error={error}
      />

      <Button onClick={handleLookup} disabled={loading}>
        {loading ? t("loading") : t("lookup")}
      </Button>

      {result && (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary">
                <th className="px-4 py-2 text-left font-medium">
                  {t("field")}
                </th>
                <th className="px-4 py-2 text-left font-medium">
                  {t("value")}
                </th>
              </tr>
            </thead>
            <tbody>
              {fields.map(({ key, label }) => (
                <tr key={key} className="border-b border-border last:border-0">
                  <td className="px-4 py-2 font-medium text-muted-foreground">
                    {label}
                  </td>
                  <td className="px-4 py-2">
                    {result[key] != null ? String(result[key]) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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