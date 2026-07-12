// تذييل موحّد: الشعار النصي + الشعار التسويقي + أرقام التواصل

const PHONES = ["24556260", "97554492"];

function PhoneIcon() {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e87a28] text-white">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.3 21 3 13.7 3 4.5c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.2 2.2z" />
      </svg>
    </span>
  );
}

export default function BrandFooter() {
  return (
    <footer className="mt-8 text-center">
      <p className="text-xl font-extrabold text-[#1c3f63]">
        <span className="mx-1 inline-block h-1.5 w-6 rounded-full bg-[#e87a28] align-middle" />
        معنا يتجدد الأمل
        <span className="mx-1 inline-block h-1.5 w-6 rounded-full bg-[#e87a28] align-middle" />
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-3">
        {PHONES.map((p) => (
          <a
            key={p}
            href={`tel:${p}`}
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#1c3f63] shadow-sm ring-1 ring-slate-100 transition hover:ring-[#e87a28]/40"
          >
            <PhoneIcon />
            <span dir="ltr">{p}</span>
          </a>
        ))}
      </div>
      <p className="mt-4 text-xs font-medium text-slate-400">
        مركز الأمل والنور للاستشارات
      </p>
    </footer>
  );
}
