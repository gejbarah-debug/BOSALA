"use client";

import { useEffect, useState } from "react";
import { formatKuwait } from "@/lib/format";

function ClockIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export default function LiveClock({ compact = false }: { compact?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // قبل التحميل على المتصفح نحجز مساحة لتفادي القفز
  if (!now) {
    return <div aria-hidden className={compact ? "h-4" : "h-[62px]"} />;
  }

  const { dateStr, timeStr } = formatKuwait(now, { seconds: true });

  if (compact) {
    return (
      <p className="text-center text-[11px] font-medium text-slate-500">
        <span className="tabular-nums">{timeStr}</span> · {dateStr} · بتوقيت
        الكويت
      </p>
    );
  }

  return (
    <div className="mt-4 flex items-center justify-center gap-3 rounded-2xl border border-[#e87a28]/25 bg-white px-4 py-3 shadow-sm">
      <ClockIcon className="h-7 w-7 shrink-0 text-[#e87a28]" />
      <div className="text-center leading-tight">
        <div className="text-[11px] font-medium text-slate-400">
          الوقت الآن · بتوقيت الكويت
        </div>
        <div className="text-lg font-extrabold tabular-nums text-[#1c3f63]">
          {timeStr}
        </div>
        <div className="text-[11px] text-slate-500">{dateStr}</div>
      </div>
    </div>
  );
}
