import type { NextConfig } from "next";

// عند النشر على GitHub Pages يُضبط PAGES_BASE_PATH=/BOSALA
// محلياً يبقى المسار الجذر "/" حتى يعمل التطوير بشكل طبيعي.
const basePath = process.env.PAGES_BASE_PATH;

const nextConfig: NextConfig = {
  output: "export", // تصدير ثابت (HTML/CSS/JS) مناسب للاستضافة على GitHub Pages
  trailingSlash: true,
  images: { unoptimized: true },
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
};

export default nextConfig;
