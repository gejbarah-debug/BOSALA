// شعار الأمل والنور للاستشارات (الصورة الرسمية من مجلد public)

export default function Logo({ className = "" }: { className?: string }) {
  // على GitHub Pages يكون المسار /BOSALA، ومحلياً يكون فارغاً
  const base = process.env.NEXT_PUBLIC_BASE_PATH || "";
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`${base}/mk.jpeg`}
      alt="شعار الأمل والنور للاستشارات"
      className={`object-contain ${className}`}
    />
  );
}
