import type { Metadata } from "next";

export default function sitemap() {
  const base = "https://arcus.tecnologia";
  return [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${base}/#servicos`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${base}/#contato`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.9 },
  ];
}

export const metadata: Metadata = {};
