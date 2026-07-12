import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بوصلة التخصص | لطلبة الثاني عشر علمي وأدبي",
  description:
    "استبيان إلكتروني يساعد طلبة الصف الثاني عشر (علمي/أدبي) في الكويت على اكتشاف التخصص الجامعي الأنسب بناءً على الميول والقدرات والسمات الشخصية.",
};

export const viewport: Viewport = {
  themeColor: "#0f766e",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} antialiased`}>
      <body>{children}</body>
    </html>
  );
}
